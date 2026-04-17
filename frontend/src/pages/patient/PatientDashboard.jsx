import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Ct from "../../context/Ct.jsx";
import axios from "../../api/axios.js";
import "../../styles/patientDashboard.css"; 

const PatientDashboard = () => {
    const obj = useContext(Ct);
    const [patientInfo, setPatientInfo] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get("/patients/profile/me");
                setPatientInfo(res.data);
            } catch (err) {
                console.error("Could not fetch patient profile", err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="patient-dashboard">

            <div className="header">
                <h1>Patient Dashboard</h1>

                <div className="welcome-box">
                    <span>Welcome back,</span>
                    <strong>{obj.state.name}</strong>
                </div>
            </div>

            {patientInfo && (
                <div className="glass-card profile-card">
                    <h3>🏥 Your Medical Profile</h3>

                    <div className="profile-grid">
                        <div><span>🎂 Age</span><strong>{patientInfo?.age}</strong></div>
                        <div><span>👤 Gender</span><strong>{patientInfo?.gender}</strong></div>
                        <div><span>🩸 Blood</span><strong className="blood">{patientInfo?.bloodGroup}</strong></div>
                        <div><span>📞 Phone</span><strong>{patientInfo?.phone}</strong></div>
                        <div className="full"><span>📍 Address</span><strong>{patientInfo?.address}</strong></div>
                    </div>
                </div>
            )}

            <div className="dashboard-grid">

                <div className="glass-card dash-card">
                    <div className="icon">📅</div>
                    <h3>My Appointments</h3>
                    <p>View and manage your consultations</p>

                    <Link to="/patient/my-appointments" className="view-btn">
                        View Appointments
                    </Link>
                </div>

                <div className="glass-card dash-card">
                    <div className="icon">💊</div>
                    <h3>Prescriptions</h3>
                    <p>Access your medical reports</p>

                    <Link to="/patient/prescriptions" className="view-btn">
                        View Reports
                    </Link>
                </div>

            </div>

            <div className="glass-card tip-card">
                <div className="tip-content">
                    <div className="tip-icon">💡</div>
                    <div>
                        <h4>Health Tip of the Day</h4>
                        <p>
                            Stay hydrated! Drinking enough water helps maintain energy and overall health.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PatientDashboard;