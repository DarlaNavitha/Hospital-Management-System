import { useState, useEffect } from "react";
import API from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/bookAppointment.css"; 

const BookAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [data, setData] = useState({ patientId: "", doctorId: "", date: "", time: "", reason: "" });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [docRes, patRes] = await Promise.all([
                    API.get("/doctors"),
                    API.get("/patients")
                ]);
                setDoctors(docRes.data);
                setPatients(patRes.data);

                if (patRes.data.length === 0) {
                    setError("No patients found. Please register a patient first.");
                }
            } catch (err) {
                setError(err.response?.data?.msg || "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fun = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const book = async () => {
        if (!data.patientId || !data.doctorId || !data.date || !data.time) {
            return alert("Please fill all required fields");
        }
        try {
            const res = await API.post("/appointments", data);
            alert(res.data.msg);
            navigate("/receptionist");
        } catch (err) {
            alert(err.response?.data?.msg || "Error booking appointment");
        }
    };

    if (loading) return (
        <div className="home center">
            <div className="card center">
                <div className="loading-spinner"></div>
                <h2>Loading clinical data...</h2>
            </div>
        </div>
    );

    return (
        <div className="home form-container">

            <div className="header-card">
                <div>
                    <h1>📅 Schedule Appointment</h1>
                    <p>Book a clinical visit for a registered patient.</p>
                </div>

                <button className="glass-btn" onClick={() => navigate("/receptionist")}>
                    Cancel
                </button>
            </div>

            <div className="card form-card">

                {error && <p className="error-box">{error}</p>}

                <div className="form-group">
                    <label>Select Patient *</label>
                    <select name="patientId" value={data.patientId} onChange={fun}>
                        <option value="">-- Choose a registered patient --</option>
                        {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                </div>

                {data.patientId && (
                    <div className="preview-card">
                        <h4>👤 Patient Profile</h4>
                        {(() => {
                            const p = patients.find(p => p._id === data.patientId);
                            if (!p) return null;

                            return (
                                <div className="preview-grid">
                                    <div><span>Age</span><strong>{p.age}</strong></div>
                                    <div><span>Gender</span><strong>{p.gender}</strong></div>
                                    <div><span>Blood</span><strong className="blood">{p.bloodGroup}</strong></div>
                                    <div><span>Phone</span><strong>{p.phone}</strong></div>
                                    <div className="full"><span>Address</span><strong>{p.address}</strong></div>
                                </div>
                            );
                        })()}
                    </div>
                )}

             
                <div className="form-group">
                    <label>Assign Doctor *</label>
                    <select name="doctorId" value={data.doctorId} onChange={fun}>
                        <option value="">-- Choose a specialist --</option>
                        {doctors.map(d => (
                            <option key={d._id} value={d._id}>
                                Dr. {d.userId?.name} ({d.specialization})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date *</label>
                        <input type="date" name="date" value={data.date} onChange={fun} />
                    </div>

                    <div className="form-group">
                        <label>Time *</label>
                        <input type="time" name="time" value={data.time} onChange={fun} />
                    </div>
                </div>

               
                <div className="form-group">
                    <label>Reason</label>
                    <input
                        type="text"
                        name="reason"
                        placeholder="Reason for visit"
                        value={data.reason}
                        onChange={fun}
                    />
                </div>

                <button className="primary-btn" onClick={book}>✅ Confirm Appointment</button>

            </div>
        </div>
    );
};

export default BookAppointment;