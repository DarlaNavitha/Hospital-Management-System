import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/doctorDashboard.css"; 

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const appRes = await API.get("/appointments/doctor/current");
                setAppointments(appRes.data);
            } catch (err) {
                console.error("Appointments error:", err);
            }

            try {
                const docRes = await API.get("/doctors/profile/me");
                setDoctorProfile(docRes.data);
            } catch (err) {
                console.error("Doctor profile error:", err);
            }
        };
        fetchProfileData();
    }, []);

    return (
        <div className="doctor-dashboard">

            <h1 className="page-title">🩺🧑‍⚕️ Doctor Portal</h1>

            {doctorProfile && (
                <div className="profile-card">
                    <div className="profile-left">
                        <h2>Dr. {doctorProfile.userId?.name}</h2>
                        <p>{doctorProfile.specialization}</p>
                    </div>

                    <div className="profile-right">
                        <div><strong>Experience:</strong> {doctorProfile.experience} Years</div>
                        <div><strong>Fee:</strong> ${doctorProfile.consultationFee}</div>
                    </div>
                </div>
            )}

           
            <div className="dashboard-grid">

                <div className="dashboard-card" onClick={() => navigate("/doctor/appointments")}>
                    <div className="icon">📅</div>
                    <h3>Appointments</h3>
                    <p>Manage and confirm patient requests</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/doctor/my-patients")}>
                    <div className="icon">👥</div>
                    <h3>All Patients</h3>
                    <p>Full clinical registry</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/doctor/write-prescription")}>
                    <div className="icon">✍️</div>
                    <h3>Prescriptions</h3>
                    <p>Issue digital prescriptions</p>
                </div>

                <div className="dashboard-card" onClick={() => navigate("/doctor/all-doctors")}>
                    <div className="icon">👨‍⚕️</div>
                    <h3>All Doctors</h3>
                    <p>Medical staff directory</p>
                </div>

            </div>

            <div className="glass-card recent-card">

                <div className="recent-header">
                    <h2>📋 Recent Appointments</h2>
                </div>

                <div className="recent-list">
                    
                </div>

                <button
                    className="view-btn bottom-btn"
                    onClick={() => navigate("/doctor/appointments")}
                >
                    View All
                </button>

                <div className="recent-list">

                    {appointments.length > 0 ? appointments.slice(0, 5).map(app => (
                        <div key={app._id} className="recent-item">

                            <div className="patient-info">
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

                                <p className="time">
                                    📅 {new Date(app.date).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })} at {app.time}
                                </p>
                            </div>

                            <div className="status-box">
                                <span className={`status ${app.status}`}>
                                    {app.status.toUpperCase()}
                                </span>

                                {app.attendingTime && (
                                    <span className="attending">
                                        🕒 {app.attendingTime}
                                    </span>
                                )}
                            </div>

                        </div>
                    )) : (
                        <div className="empty">
                            No appointments scheduled for today.
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default DoctorDashboard;