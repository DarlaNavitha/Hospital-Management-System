import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/writePrescription.css"; // 👈 add this

const WritePrescription = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [data, setData] = useState({ patientId: "", consultationFee: "", prescriptionFee: "" });
    const [medicines, setMedicines] = useState([{ name: "", dosage: "", instructions: "" }]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get("/patients");
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPatients();
    }, []);

    const handleMedChange = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index] = { ...newMeds[index], [field]: value };
        setMedicines(newMeds);
    };

    const addMedRow = () => {
        setMedicines([...medicines, { name: "", dosage: "", instructions: "" }]);
    };

    const removeMedRow = (index) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        }
    };

    const submit = async () => {
        try {
            if (!data.patientId || medicines.some(m => !m.name)) {
                return alert("Please select a patient and provide medicine names");
            }

            await axios.post("/prescriptions", { ...data, medicines });
            alert("Prescription submitted successfully!");
            navigate("/doctor");
        } catch (err) {
            alert(err.response?.data?.msg || "Error submitting prescription");
        }
    };

    const selectedPatient = patients.find(p => p._id === data.patientId);

    return (
        <div className="prescription-page">

            <div className="page-header">
                <h1>Add Prescription</h1>
                <button className="back-btn" onClick={() => navigate("/doctor")}>
                    ← Back
                </button>
            </div>

            <div className="glass-card main-card">

                <div className="form-group">
                    <label>Select Patient</label>
                    <select
                        value={data.patientId}
                        onChange={(e) => setData({ ...data, patientId: e.target.value })}
                    >
                        <option value="">Choose a patient...</option>
                        {patients.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

               
                {selectedPatient && (
                    <div className="glass-card patient-info">
                        <h3>👤 Patient Profile</h3>

                        <div className="info-grid">
                            <div><span>Name</span><strong>{selectedPatient.name}</strong></div>
                            <div><span>Age/Gender</span><strong>{selectedPatient.age} / {selectedPatient.gender}</strong></div>
                            <div><span>Blood</span><strong className="blood">{selectedPatient.bloodGroup || selectedPatient.bloodgroup}</strong></div>
                            <div><span>Phone</span><strong>📞 {selectedPatient.phone}</strong></div>
                            <div className="full"><span>Address</span><strong>📍 {selectedPatient.address}</strong></div>
                        </div>
                    </div>
                )}

             
                <div className="med-section">
                    <div className="med-header">
                        <h3>💊 Medicines</h3>
                        <button onClick={addMedRow} className="add-btn">+ Add</button>
                    </div>

                    {medicines.map((med, index) => (
                        <div key={index} className="med-card">

                            <div className="grid-2">
                                <input
                                    type="text"
                                    placeholder="Medicine Name"
                                    value={med.name}
                                    onChange={(e) => handleMedChange(index, "name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Dosage"
                                    value={med.dosage}
                                    onChange={(e) => handleMedChange(index, "dosage", e.target.value)}
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="Instructions"
                                value={med.instructions}
                                onChange={(e) => handleMedChange(index, "instructions", e.target.value)}
                            />

                            {medicines.length > 1 && (
                                <button className="remove-btn" onClick={() => removeMedRow(index)}>✕</button>
                            )}

                        </div>
                    ))}
                </div>

               
                <div className="glass-card finance-box">
                    <h3>💰 Financial Details</h3>

                    <div className="grid-2">
                        <input
                            type="number"
                            placeholder="Consultation Fee"
                            value={data.consultationFee}
                            onChange={(e) => setData({ ...data, consultationFee: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Prescription Fee"
                            value={data.prescriptionFee}
                            onChange={(e) => setData({ ...data, prescriptionFee: e.target.value })}
                        />
                    </div>

                    <div className="total">
                        Total: $
                        {(parseInt(data.consultationFee) || 0) +
                         (parseInt(data.prescriptionFee) || 0)}
                    </div>
                </div>

                <button className="submit-btn" onClick={submit}>
                    Generate Prescription
                </button>

            </div>

        </div>
    );
};

export default WritePrescription;