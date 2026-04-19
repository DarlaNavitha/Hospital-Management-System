import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/patientAppointments.css"; 

const Appointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [history, setHistory] = useState({});
    const [attendingTimes, setAttendingTimes] = useState({});

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await API.get("/appointments/doctor/requests");
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAppointments();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const attendingTime = attendingTimes[id];
            if (status === 'confirmed' && !attendingTime) {
                return alert("Please set an attending time before confirming.");
            }

            await API.put(`/appointments/${id}/status`, {
                status,
                attendingTime
            });

            alert("Status updated successfully");
            window.location.reload();
        } catch (err) {
            alert("Error updating status");
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
            try {
                const res = await API.get(`/prescriptions/patient/${patientId}`);
                setHistory({ ...history, [patientId]: res.data });
            } catch (err) {
                alert("Could not load medical history.");
            }
        }
    };

 
    return (
        <div className="doctor-appointments-page">

    <div className="doctor-page-header">
        <h1>Patient Appointment Requests</h1>
        <button className="doctor-back-btn" onClick={() => navigate("/doctor")}>
            ← Back
        </button>
    </div>

    <div className="doctor-appointments-list">

        {appointments.length > 0 ? appointments.map(app => (
            <div key={app._id} className="doctor-glass-card doctor-appointment-card">

                <div className="doctor-appointment-top">

                    <div className="doctor-appointment-info">

                        <div className="doctor-name-row">
                            <h3>👤 {app.patientId?.name}</h3>

                            <button
                                className="doctor-history-btn"
                                onClick={() => toggleHistory(app.patientId?._id)}
                            >
                                {history[app.patientId?._id] ? 'Hide History' : '📋 Medical History'}
                            </button>
                        </div>

                        <p className="doctor-request-time">
                            Requested: <strong>{app.date}</strong> at <strong>{app.time}</strong>
                        </p>

                        <div className="doctor-patient-grid">
                            <div>
                                <span>Age/Gender</span>
                                <strong>{app.patientId?.age} / {app.patientId?.gender}</strong>
                            </div>

                            <div>
                                <span>Blood Group</span>
                                <strong className="doctor-blood">
                                    {app.patientId?.bloodGroup || app.patientId?.bloodgroup}
                                </strong>
                            </div>

                            <div>
                                <span>Contact</span>
                                <strong>📞 {app.patientId?.phone}</strong>
                            </div>

                            <div className="full">
                                <span>Address</span>
                                <strong>📍 {app.patientId?.address}</strong>
                            </div>
                        </div>

                        {history[app.patientId?._id] && (
                            <div className="doctor-history-box">
                                <h4>📜 Previous Prescriptions</h4>

                                {history[app.patientId._id].length > 0 ? history[app.patientId._id].map(presc => (
                                    <div key={presc._id} className="doctor-history-item">

                                        <div className="doctor-history-head">
                                            <strong>Dr. {presc.doctorId?.userId?.name}</strong>
                                            <span>{new Date(presc.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div>
                                            <strong>Medicines:</strong>
                                            <ul>
                                                {presc.medicines?.map((m, i) => (
                                                    <li key={i}>
                                                        {m.name} {m.dosage && `(${m.dosage})`} {m.instructions && `- ${m.instructions}`}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
                                )) : (
                                    <p className="doctor-no-history">No previous prescriptions found.</p>
                                )}
                            </div>
                        )}

                    </div>

                    <span className={`doctor-status ${app.status}`}>
                        {app.status.toUpperCase()}
                    </span>
                </div>

                {app.status === 'pending' && (
                    <div className="doctor-action-box">
                        <label>Set Attending Time</label>

                        <div className="doctor-action-row">
                            <input type="time" onChange={(e) => handleTimeChange(app._id, e.target.value)}/>

                            <button className="doctor-confirm-btn" onClick={() => updateStatus(app._id, 'confirmed')}>
                                Confirm
                            </button>

                            <button className="doctor-reject-btn" onClick={() => updateStatus(app._id, 'rejected')}>
                                Reject
                            </button>
                        </div>
                    </div>
                )}

                {app.status === 'confirmed' && app.attendingTime && (
                    <p className="doctor-confirmed-time">
                        🕒 Scheduled: {app.attendingTime}
                    </p>
                )}

            </div>
        )) : (
            <div className="doctor-glass-card doctor-empty-card">
                <p>No appointment requests at the moment.</p>
            </div>
        )}

    </div>

</div>
    );
};

export default Appointments;