import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import "../../styles/manageDoctors.css";

const ManageDoctors = () => {

    const [doctors, setDoctors] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const [newData, setNewData] = useState({
        name: "",
        email: "",
        specialization: "",
        experience: "",
        consultationFee: ""
    });

    const [editingDoctor, setEditingDoctor] = useState(null);

    const [editData, setEditData] = useState({
        specialization: "",
        experience: "",
        consultationFee: ""
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await API.get("/doctors");
            setDoctors(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Add

    const handleAdd = async () => {
        try {
            await API.post("/doctors", newData);

            alert("Doctor added successfully");

            setNewData({
                name: "",
                email: "",
                specialization: "",
                experience: "",
                consultationFee: ""
            });

            setIsAdding(false);
            fetchDoctors();

        } catch (err) {
            alert(err.response?.data?.msg || "Error adding doctor");
        }
    };

    // DELETE 
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await API.delete(`/doctors/${id}`);
            fetchDoctors();
        }
    };

    // EDIT
    const handleEditClick = (doc) => {
        setEditingDoctor(doc._id);

        setEditData({
            specialization: doc.specialization,
            experience: doc.experience,
            consultationFee: doc.consultationFee
        });

        setIsAdding(false);
    };

    //  Update
    const handleUpdate = async () => {
        try {
            await API.put(`/doctors/${editingDoctor}`, editData);

            alert("Updated successfully");

            setEditingDoctor(null);
            fetchDoctors();

        } catch (err) {
            alert("Error updating doctor");
        }
    };

    return (
        <div className="manage-page">

           
            <div className="page-header">
                <h1>👩‍⚕️ Manage Doctors</h1>

                <button
                    className={`toggle-btn ${isAdding ? "danger" : ""}`}
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? "Cancel" : "+ Add Doctor"}
                </button>
            </div>

            {isAdding && (
                <div className="glass-card form-card">

                    <h2>Add Doctor</h2>
                    <p className="note">Enter doctor details manually</p>

                    <div className="grid-4">

                        <input
                            placeholder="Doctor Name"
                            value={newData.name}
                            onChange={(e) =>
                                setNewData({ ...newData, name: e.target.value })
                            }
                        />

                        <input
                            placeholder="Doctor Email"
                            value={newData.email}
                            onChange={(e) =>
                                setNewData({ ...newData, email: e.target.value })
                            }
                        />

                        <input
                            placeholder="Specialization"
                            value={newData.specialization}
                            onChange={(e) =>
                                setNewData({ ...newData, specialization: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Experience"
                            value={newData.experience}
                            onChange={(e) =>
                                setNewData({ ...newData, experience: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Consultation Fee"
                            value={newData.consultationFee}
                            onChange={(e) =>
                                setNewData({ ...newData, consultationFee: e.target.value })
                            }
                        />

                    </div>

                    <button className="primary-btn" onClick={handleAdd}>
                        Save Doctor
                    </button>

                </div>
            )}

            {editingDoctor && (
                <div className="glass-card form-card">

                    <h2>Edit Doctor</h2>

                    <div className="grid-3">

                        <input
                            placeholder="Specialization"
                            value={editData.specialization}
                            onChange={(e) =>
                                setEditData({ ...editData, specialization: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Experience"
                            value={editData.experience}
                            onChange={(e) =>
                                setEditData({ ...editData, experience: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="Consultation Fee"
                            value={editData.consultationFee}
                            onChange={(e) =>
                                setEditData({ ...editData, consultationFee: e.target.value })
                            }
                        />

                    </div>

                    <div className="btn-row">
                        <button className="primary-btn" onClick={handleUpdate}>
                            Update
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => setEditingDoctor(null)}
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            )}

    
            <div className="glass-card table-card">

                <table className="doctor-table">

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Experience</th>
                            <th>Fee</th>
                            <th className="right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors.map(doc => (
                            <tr key={doc._id}>

                                <td>
                                    <div className="doc-name">
                                        {doc.userId?.name}
                                    </div>
                                    <div className="doc-email">
                                        {doc.userId?.email}
                                    </div>
                                </td>

                                <td>{doc.specialization}</td>
                                <td>{doc.experience} yrs</td>
                                <td>₹{doc.consultationFee}</td>

                                <td className="right">
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEditClick(doc)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(doc._id)}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

                {doctors.length === 0 && (
                    <p className="empty">No doctors found</p>
                )}

            </div>

        </div>
    );
};

export default ManageDoctors;