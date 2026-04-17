import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import "../../styles/prescriptions.css"; 

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await API.get("/prescriptions/patient/current");
                setPrescriptions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPrescriptions();
    }, []);

    return (
        <div className="prescriptions-page">

            <h1 className="page-title">My Prescriptions</h1>

            <div className="prescriptions-list">

                {prescriptions.length > 0 ? prescriptions.map(p => (
                    <div key={p._id} className="glass-card prescription-card">

                        <div className="prescription-header">
                            <div>
                                <h3>🩺 Prescription</h3>
                                <p>
                                    Prescribed by: <strong>Dr. {p.doctorId?.userId?.name}</strong>
                                </p>
                            </div>

                            <span className="date">
                                {new Date(p.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                    
                        <div className="medicine-box">
                            <h4>💊 Medication Schedule</h4>

                            <div className="medicine-list">
                                {Array.isArray(p.medicines) ? p.medicines.map((med, idx) => (
                                    <div key={idx} className="medicine-item">

                                        <div className="med-top">
                                            <span className="med-name">{med.name}</span>
                                            <span className="dosage">{med.dosage}</span>
                                        </div>

                                        {med.instructions && (
                                            <p className="instructions">
                                                📝 {med.instructions}
                                            </p>
                                        )}

                                    </div>
                                )) : <p>{p.medicines}</p>}
                            </div>
                        </div>

                        {p.notes && (
                            <div className="notes-box">
                                <strong>Doctor's Notes:</strong> {p.notes}
                            </div>
                        )}

                     
                        <div className="billing-box">
                            <h4>🧾 Billing Details</h4>

                            <div className="bill-row">
                                <span>Consultation Fee</span>
                                <span>₹{p.consultationFee || 0}</span>
                            </div>

                            <div className="bill-row">
                                <span>Prescription Fee</span>
                                <span>₹{p.prescriptionFee || 0}</span>
                            </div>

                            <div className="bill-total">
                                <span>Total</span>
                                <span>₹{(p.consultationFee || 0) + (p.prescriptionFee || 0)}</span>
                            </div>
                        </div>

                    </div>
                )) : (
                    <div className="glass-card empty-card">
                        <p>No medical prescriptions found.</p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default Prescriptions;