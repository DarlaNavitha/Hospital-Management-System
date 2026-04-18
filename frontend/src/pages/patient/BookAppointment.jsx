import React, { useEffect, useState } from "react";
import API from "../../api/axios"; 
import "../../styles/bookPatAppointment.css";

const BookAppointment = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingId, setBookingId] = useState(null);

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await API.get("/doctors");
                setDoctors(res.data);
            } catch (err) {
                console.error("Error fetching doctors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Handle booking
    const handleBook = async (doctorId) => {
        try {
            setBookingId(doctorId);

            const res = await API.post("/appointments", {
                doctorId,
                date: new Date(), // later we can add date picker
                time: "10:00 AM"
            });

            alert("✅ Appointment booked successfully!");

        } catch (err) {
            console.error("Booking error:", err);
            alert("❌ Failed to book appointment");
        } finally {
            setBookingId(null);
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

                            <h2>{doc.name || "Doctor"}</h2>
                            <p><strong>Specialization:</strong> {doc.specialization}</p>
                            <p><strong>Experience:</strong> {doc.experience} yrs</p>
                            <p><strong>Fee:</strong> ₹{doc.consultationFee}</p>

                            <button
                                className="book-btn"
                                onClick={() => handleBook(doc._id)}
                                disabled={bookingId === doc._id}
                            >
                                {bookingId === doc._id ? "Booking..." : "Book Appointment"}
                            </button>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default BookAppointment;