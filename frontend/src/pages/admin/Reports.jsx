import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import "../../styles/reports.css"; // 👈 add this

const Reports = () => {
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0
    });
    const [recentAppointments, setRecentAppointments] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [docRes, patRes, appRes] = await Promise.all([
                    axios.get("/doctors"),
                    axios.get("/patients"),
                    axios.get("/appointments")
                ]);

                setStats({
                    doctors: docRes.data.length,
                    patients: patRes.data.length,
                    appointments: appRes.data.length
                });

                setRecentAppointments(appRes.data.slice(-5).reverse());
            } catch (err) {
                console.error(err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="reports-page">

            <h1 className="page-title">📊 Hospital Reports & Analytics</h1>

            {/* STATS */}
            <div className="stats-grid">

                <div className="glass-card stat-card primary">
                    <span className="icon">👨‍⚕️</span>
                    <h2>{stats.doctors}</h2>
                    <p>Registered Doctors</p>
                </div>

                <div className="glass-card stat-card secondary">
                    <span className="icon">👥</span>
                    <h2>{stats.patients}</h2>
                    <p>Total Patients</p>
                </div>

                <div className="glass-card stat-card warning">
                    <span className="icon">📅</span>
                    <h2>{stats.appointments}</h2>
                    <p>Appointments Booked</p>
                </div>

            </div>

            {/* UTILIZATION */}
            <div className="glass-card utilization-card">

                <h2>📈 Hospital Utilization</h2>

                <div className="progress-group">

                    <div className="progress-item">
                        <div className="progress-header">
                            <span>Doctor Capacity</span>
                            <span>{Math.min(100, (stats.doctors / 20) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill primary"
                                style={{ width: `${Math.min(100, (stats.doctors / 20) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="progress-item">
                        <div className="progress-header">
                            <span>Patient Enrollment</span>
                            <span>{Math.min(100, (stats.patients / 100) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill secondary"
                                style={{ width: `${Math.min(100, (stats.patients / 100) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                </div>

            </div>

            {/* RECENT ACTIVITY */}
            <div className="glass-card activity-card">

                <h2>Recent Activity Log</h2>

                <div className="activity-list">

                    {recentAppointments.map(app => (
                        <div key={app._id} className="activity-item">

                            <div>
                                <strong>{app.patientId?.name}</strong> with{" "}
                                <strong>Dr. {app.doctorId?.userId?.name}</strong>

                                <p>
                                    {app.date} at {app.time}
                                </p>
                            </div>

                            <span className={`status ${app.status}`}>
                                {app.status.toUpperCase()}
                            </span>

                        </div>
                    ))}

                    {recentAppointments.length === 0 && (
                        <p className="empty">No recent activity</p>
                    )}

                </div>

            </div>

        </div>
    );
};

export default Reports;