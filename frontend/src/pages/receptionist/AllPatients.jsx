import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/allPatients.css";

const AllPatients = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [history, setHistory] = useState({});

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

    const toggleHistory = async (patientId) => {
        if (history[patientId]) {
            const newHistory = { ...history };
            delete newHistory[patientId];
            setHistory(newHistory);
        } else {
            try {
                const res = await API.get(`/prescriptions/patient/${patientId}`);
                setHistory({ ...history, [patientId]: res.data });
            } catch {
                alert("Could not load history");
            }
        }
    };

    if (loading) {
        return (
            <div className="ap-loading-page">
                <div className="glass-card">
                    <div className="ap-loader"></div>
                    <h2>Accessing clinical database...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="ap-page">

            <div className="ap-header">
                <div>
                    <h1 className="ap-title">📋 All Patients</h1>
                    <p>Hospital patient registry</p>
                </div>

                <button className="ap-outline-btn" onClick={() => navigate("/receptionist")}>
                    ← Back
                </button>
            </div>

            <div className="glass-card ap-search-box">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Search patients..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="ap-grid">

                {filteredPatients.length > 0 ? filteredPatients.map(p => (
                    <div key={p._id} className="glass-card ap-card">

                        <div className="ap-top">
                            <div>
                                <h3>{p.name}</h3>
                                <small>{p.age} • {p.gender}</small>
                            </div>

                            <div className="ap-right">
                                <span className="ap-blood">{p.bloodGroup}</span>

                                <button
                                    className="ap-mini-btn"
                                    onClick={() => toggleHistory(p._id)}
                                >
                                    {history[p._id] ? "Hide" : "History"}
                                </button>
                            </div>
                        </div>

                        <div className="ap-info">
                            <p>📞 {p.phone}</p>
                            <p>✉️ {p.email}</p>
                            <p>📍 {p.address}</p>
                        </div>

                        {history[p._id] && (
                            <div className="ap-history">

                                <h4>📜 Prescriptions</h4>

                                {history[p._id].length > 0 ? history[p._id].map(h => (
                                    <div key={h._id} className="ap-history-item">

                                        <div className="ap-history-head">
                                            <strong>Dr. {h.doctorId?.userId?.name}</strong>
                                            <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <ul>
                                            {h.medicines?.map((m, i) => (
                                                <li key={i}>
                                                    {m.name} {m.dosage && `(${m.dosage})`}
                                                </li>
                                            ))}
                                        </ul>

                                    </div>
                                )) : <p>No records</p>}

                            </div>
                        )}

                    </div>
                )) : (
                    <div className="ap-empty">
                        <h3>No patients found</h3>
                        <p>Try different search</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default AllPatients;