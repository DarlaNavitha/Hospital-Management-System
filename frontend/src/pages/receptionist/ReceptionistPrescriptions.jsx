import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/receptionistPrescriptions.css"; 

const ReceptionistPrescriptions = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await axios.get("/prescriptions");
                setPrescriptions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    const filtered = prescriptions.filter(p => {
    const q = search.toLowerCase();

    const patient =
        typeof p.patientId === "object"
            ? p.patientId?.name?.toLowerCase() || ""
            : "";

        const doctor =
            p.doctorId?.userId?.name?.toLowerCase() || "";

        const id =
            p._id ? String(p._id).toLowerCase() : "";

        return (
            patient.includes(q) ||
            doctor.includes(q) ||
            id.includes(q)
        );
    });

    if (loading) return (
        <div className="home center">
            <div className="card center">
                <div className="loading-spinner"></div>
                <h2>Loading prescription records...</h2>
            </div>
        </div>
    );

    return (
        <div className="home container-lg">

          
            <div className="page-header">
                <div>
                    <h1 className="gradient-text">📋 All Prescriptions</h1>
                    <p className="sub-text">Full list of all hospital prescriptions</p>
                </div>

                <button className="outline-btn" onClick={() => navigate("/receptionist")}>
                    ← Back
                </button>
            </div>

            <div className="card search-box">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Search by patient, doctor, or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="dashboard-grid single">

                {filtered.length > 0 ? filtered.map(p => (
                    <div key={p._id} className="card prescription-card">

                        <div className="presc-header">
                            <h3>👤 {p.patientId?.name || "Unknown"}</h3>
                            <span className="date">
                                {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <p className="doctor">
                            👨‍⚕️ Dr. {p.doctorId?.userId?.name || "Unknown"}
                        </p>

                        <div className="med-box">
                            <h4>💊 Medicines</h4>
                            <ul>
                                {p.medicines?.map((m, i) => (
                                    <li key={i}>
                                        <strong>{m.name}</strong>
                                        {m.dosage && ` (${m.dosage})`}
                                        {m.instructions && ` - ${m.instructions}`}
                                        {m.days && ` for ${m.days} days`}
                                    </li>
                                ))}
                            </ul>
                        </div>

                 
                        <div className="bill-box">
                            <div>
                                <span>Consultation</span>
                                <strong>${p.consultationFee || 0}</strong>
                            </div>
                            <div>
                                <span>Medicine</span>
                                <strong>${p.amount || 0}</strong>
                            </div>
                            <div className="total">
                                Total: ${(Number(p.consultationFee) || 0) + (Number(p.amount) || 0)}
                            </div>
                        </div>

                    </div>
                )) : (
                    <div className="empty-state">
                        <div>📭</div>
                        <h3>No prescriptions found</h3>
                        <p>Try adjusting your search</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ReceptionistPrescriptions;