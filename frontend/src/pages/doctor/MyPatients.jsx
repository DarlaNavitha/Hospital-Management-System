import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/myPatients.css";

const MyPatients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await API.get("/patients");
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="mp-page mp-center">
                <div className="mp-glass mp-loading">
                    <div className="mp-spinner"></div>
                    <h2>Fetching your patients...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="mp-page">

            <div className="mp-header">
                <div>
                    <h1 className="mp-title">👥 All Patients</h1>
                    <p>View the comprehensive hospital patient registry</p>
                </div>

                <button className="mp-back" onClick={() => navigate("/doctor")}>
                    ← Back Dashboard
                </button>
            </div>

            <div className="mp-glass mp-search-card">
                <div className="mp-search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name, phone or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="mp-container">
                <div className="mp-grid">

                    {filteredPatients.length > 0 ? (
                        filteredPatients.map(p => (
                            <div key={p._id} className="mp-glass mp-card">

                                <div className="mp-top">
                                    <div>
                                        <h3>{p.name}</h3>
                                        <div className="mp-meta">
                                            <span>Age: {p.age}</span>
                                            <span> | </span>
                                            <span>{p.gender}</span>
                                        </div>
                                    </div>

                                    <div className="mp-blood">
                                        <span>{p.bloodGroup || p.bloodgroup}</span>
                                        <p>BLOOD</p>
                                    </div>
                                </div>

                                <div className="mp-details">

                                    <div className="mp-row">
                                        <span>📞</span>
                                        <div>
                                            <small>Phone</small>
                                            <strong>{p.phone}</strong>
                                        </div>
                                    </div>

                                    <div className="mp-row">
                                        <span>✉️</span>
                                        <div>
                                            <small>Email</small>
                                            <strong>{p.email}</strong>
                                        </div>
                                    </div>

                                    <div className="mp-row">
                                        <span>📍</span>
                                        <div>
                                            <small>Address</small>
                                            <strong>{p.address}</strong>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="mp-empty">
                            <h3>No patients found</h3>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default MyPatients;