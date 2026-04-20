import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import "../../styles/doctors.css";

const AllDoctors = () => {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const docRes = await API.get("/appointment/doctors/patient");
            setDoctors(docRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="doctors-page">

            <div className="page-header">
                <h1>👨‍⚕️ All Doctors Directory</h1>
            </div>

            <div className="glass-card table-card">

                <div className="table-wrapper">
                    <table className="doctor-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Experience</th>
                                <th>Fee</th>
                            </tr>
                        </thead>

                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc._id}>
                                    <td>
                                        <div className="doc-name">Dr. {doc.userId?.name}</div>
                                        <div className="doc-email">{doc.userId?.email}</div>
                                    </td>

                                    <td>{doc.specialization}</td>
                                    <td>{doc.experience} Years</td>
                                    <td>₹{doc.consultationFee}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {doctors.length === 0 && (
                        <p className="empty">No doctor records found.</p>
                    )}
                </div>

            </div>

        </div>
    );
};

export default AllDoctors;