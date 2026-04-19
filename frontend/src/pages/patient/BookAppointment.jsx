import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/bookPatAppointment.css";

const PatientBookAppointment = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [formData, setFormData] = useState({
        patientName: "",
        age: "",
        gender: "",
        disease: "",
        date: "",
        time: ""
    });

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await API.get("/doctors");
                console.log("Doctors API response:", res.data);
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Submit appointment request
    const handleSubmit = async () => {
        try {
            if (!formData.patientName || !formData.date || !formData.time) {
                return alert("Please fill required fields");
            }

            await API.post("/appointments", {
                doctorId: selectedDoctor._id,
                ...formData
            });

            alert("Request Sent ✅");

            // Reset
            setSelectedDoctor(null);
            setFormData({
                patientName: "",
                age: "",
                gender: "",
                disease: "",
                date: "",
                time: ""
            });

        } catch (err) {
            console.error(err);
            alert("Failed ❌");
        }
    };

    return (
        <div className="page-container">

            <h1 className="page-title">Book Appointment</h1>

            {loading ? (
                <p>Loading doctors...</p>
            ) : doctors.length === 0 ? (
                <p>No doctors available</p>
            ) : (
                <div className="doctor-grid">

                    {doctors.map((doc) => (
                        <div className="doctor-card" key={doc._id}>

                            <h2>{doc.userId?.name || "Doctor"}</h2>
                            <p><strong>Name:</strong> {doc.userId?.name}</p>
                            <p><strong>Specialization:</strong> {doc.specialization}</p>
                            <p><strong>Experience:</strong> {doc.experience} yrs</p>
                            <p><strong>Fee:</strong> ₹{doc.consultationFee}</p>

                            <button
                                className="view-btn"
                                onClick={() => setSelectedDoctor(doc)}
                            >
                                Book Appointment
                            </button>

                        </div>
                    ))}

                </div>
            )}

            {/* Appointment Form */}
            {selectedDoctor && (
                <div className="appointment-form">

                    <h2>Book with {selectedDoctor.userId?.name}</h2>

                    <input
                        placeholder="Your Name"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    />

                    <input
                        placeholder="Age"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />

                    <select
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>

                    <input
                        placeholder="Describe Disease"
                        value={formData.disease}
                        onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                    />

                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />

                    <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />

                    <button onClick={handleSubmit} className="view-btn">
                        Request Appointment
                    </button>

                    <button className="view-btn"
                        onClick={() => setSelectedDoctor(null)}
                    >
                        Cancel
                    </button>

                </div>
            )}

        </div>
    );
};

export default PatientBookAppointment;