import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/receptionDashboard.css"; // 👈 add this

const ReceptionDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await API.get("/appointments/");
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="home reception-page">

            <h1 className="page-title">Receptionist Portal</h1>

            <div className="dashboard-grid">

                <div className="card dashboard-card" onClick={() => navigate("/receptionist/register-patient")}>
                    <div className="icon">👥</div>
                    <h3>Register Patient</h3>
                    <p>Onboard new patients into the hospital system</p>
                </div>

                <div className="card dashboard-card" onClick={() => navigate("/receptionist/book-appointment")}>
                    <div className="icon">📅</div>
                    <h3>Book Appointment</h3>
                    <p>Schedule visits for patients with doctors</p>
                </div>

                <div className="card dashboard-card" onClick={() => navigate("/receptionist/all-patients")}>
                    <div className="icon">📋</div>
                    <h3>All Patients</h3>
                    <p>Access and search patient database</p>
                </div>

                <div className="card dashboard-card" onClick={() => navigate("/receptionist/appointments")}>
                    <div className="icon">📅</div>
                    <h3>All Appointments</h3>
                    <p>View all scheduled and pending appointments</p>
                </div>

                <div className="card dashboard-card" onClick={() => navigate("/receptionist/prescriptions")}>
                    <div className="icon">✍️</div>
                    <h3>Prescriptions</h3>
                    <p>View all digital prescriptions</p>
                </div>

            </div>


            <div className="card recent-card">

                <div className="card-header">
                    <h2>📋 Recent Appointments</h2>
                    <button className="outline-btn" onClick={() => navigate("/receptionist/book-appointment")}>
                        Book New
                    </button>
                </div>

                <div className="appointments-list">

                    {appointments.length > 0 ? appointments.slice(0, 5).map(app => (
                        <div key={app._id} className="appointment-item">

                            <div className="appointment-left">
                                <strong>{app.patientId?.name}</strong>

                                <div className="meta">
                                    <span>{app.patientId?.age} yrs</span>
                                    <span>•</span>
                                    <span>{app.patientId?.gender}</span>
                                    <span>•</span>
                                    <span className="blood">
                                        {app.patientId?.bloodGroup || app.patientId?.bloodgroup}
                                    </span>
                                </div>

                                <p className="date">
                                    📅 {app.date} at {app.time}
                                </p>

                                {app.doctorId?.name && (
                                    <p className="doctor">
                                        👨‍⚕️ Dr. {app.doctorId.name}
                                    </p>
                                )}
                            </div>

                            <div className="appointment-right">
                                <span className={`status ${app.status}`}>
                                    {app.status?.toUpperCase()}
                                </span>

                                {app.attendingTime && (
                                    <span className="time">
                                        🕒 {app.attendingTime}
                                    </span>
                                )}
                            </div>

                        </div>
                    )) : (
                        <div className="empty">
                            No appointments found.
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default ReceptionDashboard;