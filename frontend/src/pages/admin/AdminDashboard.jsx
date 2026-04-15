import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/adminDashboard.css"; // 👈 add this

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get("/doctors");
                setDoctors(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="admin-dashboard">

            <h1 className="page-title">Admin Management Portal</h1>

            {/* ACTION CARD */}
            <div className="dashboard-grid">

                <div
                    className="glass-card action-card"
                    onClick={() => navigate("/admin/manage-doctors")}
                >
                    <span className="icon">👩‍⚕️</span>
                    <h3>Manage Doctors</h3>
                    <p>Add, edit or remove medical staff</p>
                </div>

            </div>

            {/* TABLE */}
            <div className="glass-card table-card">

                <h2>👨‍⚕️ Current Medical Staff</h2>

                <div className="table-wrapper">
                    <table className="doctor-table">

                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th className="right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {doctors.map(doc => (
                                <tr key={doc._id}>
                                    <td>{doc.userId?.name}</td>

                                    <td>
                                        <span className="badge">
                                            {doc.specialization}
                                        </span>
                                    </td>

                                    <td className="right">
                                        <button className="edit-btn">Edit</button>
                                        <button className="delete-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;