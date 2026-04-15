import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/appointments.css"; // 👈 add this

const ReceptionistAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [attendingTimes, setAttendingTimes] = useState({});
    const [history, setHistory] = useState({});

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get("/appointments/");
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        const attendingTime = attendingTimes[id];
        if (status === "confirmed" && !attendingTime) {
            return alert("Set attending time first");
        }

        try {
            await axios.put(`/appointments/${id}/status`, { status, attendingTime });
            alert("Updated");
            window.location.reload();
        } catch {
            alert("Error updating");
        }
    };

    const handleTimeChange = (id, val) => {
        setAttendingTimes({ ...attendingTimes, [id]: val });
    };

    const toggleHistory = async (patientId) => {
        if (history[patientId]) {
            const newHistory = { ...history };
            delete newHistory[patientId];
            setHistory(newHistory);
        } else {
            const res = await axios.get(`/prescriptions/patient/${patientId}`);
            setHistory({ ...history, [patientId]: res.data });
        }
    };

    const filtered = appointments.filter(app => {
        const q = search.toLowerCase();
        return (
            app.patientId?.name?.toLowerCase().includes(q) ||
            app.doctorId?.name?.toLowerCase().includes(q) ||
            app.date?.includes(q)
        );
    });

    if (loading) {
        return (
            <div className="home center">
                <div className="card center">
                    <div className="loading-spinner"></div>
                    <h2>Loading appointments...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="home container-lg">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="gradient-text">📅 All Appointments</h1>
                    <p>Full list of hospital appointments</p>
                </div>

                <button className="outline-btn" onClick={() => navigate("/receptionist")}>
                    ← Back
                </button>
            </div>

            {/* Search */}
            <div className="card search-card">
                <div className="search-box">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search patient / doctor / date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="appointments-list">

                {filtered.length > 0 ? filtered.map(app => (

                    <div key={app._id} className="card appointment-card">

                        <div className="appointment-header">

                            <div className="left">

                                <div className="title-row">
                                    <h3>👤 {app.patientId?.name}</h3>

                                    <button
                                        className="small-btn"
                                        onClick={() => toggleHistory(app.patientId?._id)}
                                    >
                                        {history[app.patientId?._id] ? "Hide" : "📋 History"}
                                    </button>
                                </div>

                                <p className="muted">
                                    {app.date} at {app.time}
                                </p>

                                <div className="patient-info">
                                    <div>{app.patientId?.age} / {app.patientId?.gender}</div>
                                    <div className="blood">{app.patientId?.bloodGroup}</div>
                                    <div>📞 {app.patientId?.phone}</div>
                                    <div className="full">📍 {app.patientId?.address}</div>
                                </div>

                                {app.doctorId?.name && (
                                    <p className="muted">
                                        👨‍⚕️ Dr. {app.doctorId.name}
                                    </p>
                                )}

                            </div>

                            <div className="right">
                                <span className={`status ${app.status}`}>
                                    {app.status?.toUpperCase()}
                                </span>
                            </div>

                        </div>

                        {/* History */}
                        {history[app.patientId?._id] && (
                            <div className="history-box">
                                <h4>📜 Prescriptions</h4>

                                {history[app.patientId._id].map(p => (
                                    <div key={p._id} className="history-item">
                                        <strong>Dr. {p.doctorId?.userId?.name}</strong>
                                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>

                                        <ul>
                                            {p.medicines?.map((m, i) => (
                                                <li key={i}>{m.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions */}
                        {app.status === "pending" && (
                            <div className="action-box">

                                <input
                                    type="time"
                                    onChange={(e) => handleTimeChange(app._id, e.target.value)}
                                />

                                <button className="success-btn" onClick={() => updateStatus(app._id, "confirmed")}>
                                    Confirm
                                </button>

                                <button className="danger-btn" onClick={() => updateStatus(app._id, "cancelled")}>
                                    Reject
                                </button>

                            </div>
                        )}

                        {app.status === "confirmed" && app.attendingTime && (
                            <p className="time">
                                🕒 {app.attendingTime}
                            </p>
                        )}

                    </div>

                )) : (
                    <div className="card empty">
                        No appointments found
                    </div>
                )}

            </div>

        </div>
    );
};

export default ReceptionistAppointments;