import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import "../../styles/myAppointments.css"; 

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get("/appointments/patient/current");
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="myapp-page">

            <h1 className="page-title">My Scheduled Visits</h1>

            <div className="appointments-grid">

                {appointments.length > 0 ? appointments.map(app => (
                    <div key={app._id} className="glass-card appointment-card">

                        <h3>👨‍⚕️ {app.doctorId?.userId?.name}</h3>
                        <p className="specialization">
                            {app.doctorId?.specialization}
                        </p>

                        <div className="patient-box">
                            <p><strong>Patient:</strong> {app.patientId?.name} ({app.patientId?.age}/{app.patientId?.gender})</p>
                            <p><strong>Blood:</strong> {app.patientId?.bloodGroup}</p>
                            <p><strong>Contact:</strong> {app.patientId?.phone}</p>
                        </div>

                        <div className="divider"></div>

                        <p><strong>Date:</strong> {app.date}</p>
                        <p><strong>Request Time:</strong> {app.time}</p>

                        {app.status === 'confirmed' && app.attendingTime && (
                            <div className="confirmed-box">
                                🕒 Dr. attending at: {app.attendingTime}
                            </div>
                        )}

                        <p className="status-text">
                            Status:
                            <span className={`status ${app.status}`}>
                                {app.status.toUpperCase()}
                            </span>
                        </p>

                    </div>
                )) : (
                    <div className="glass-card empty-card">
                        <p>You have no upcoming appointments.</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default MyAppointments;