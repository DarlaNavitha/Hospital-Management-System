import { useState } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/registerPatient.css"; // 👈 add this

const RegisterPatient = () => {
    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        age: "",
        gender: "male",
        phone: "",
        bloodGroup: "",
        address: ""
    });

    const fun = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const register = async () => {
        if (!data.name || !data.email || !data.age || !data.phone) {
            return alert("Please fill required fields");
        }

        try {
            const res = await axios.post("/patients", {
                ...data,
                age: Number(data.age) || 0
            });

            alert(res.data.msg + "\nPassword: " + res.data.tempPassword);
            navigate("/receptionist");
        } catch (err) {
            alert(err.response?.data?.msg || "Error in registration");
        }
    };

    return (
        <div className="home register-patient">

            {/* Header */}
            <div className="form-header">

                <div className="header-center">
                    <h1 className="gradient-text">🧑 ➕ Patient Registration</h1>
                    <p className="sub-text">Enter patient medical & contact details</p>
                </div>

                <button className="cancel-btn" onClick={() => navigate("/receptionist")}>
                    Cancel
                </button>

            </div>

            {/* Form */}
            <div className="card form-card">

                {/* Row */}
                <div className="form-grid">

                    <div className="form-group">
                        <label>👤 Full Name *</label>
                        <input name="name" value={data.name} onChange={fun} />
                    </div>

                    <div className="form-group">
                        <label>📧 Email *</label>
                        <input name="email" value={data.email} onChange={fun} />
                    </div>

                </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>🎂 Age *</label>
                        <input type="number" name="age" value={data.age} onChange={fun} />
                    </div>

                    <div className="form-group">
                        <label>⚧ Gender</label>
                        <select name="gender" value={data.gender} onChange={fun}>
                            <option>male</option>
                            <option>female</option>
                            <option>other</option>
                        </select>
                    </div>

                    
                    <div className="form-group">
                        <label>📞 Phone *</label>
                        <input name="phone" value={data.phone} onChange={fun} />
                    </div>

                    <div className="form-group">
                        <label>🩸Blood Group</label>
                        <input name="bloodGroup" value={data.bloodGroup} onChange={fun} />
                    </div>

                </div>


                <div className="form-group">
                    <label>📍 Address</label>
                    <textarea name="address" value={data.address} onChange={fun}></textarea>
                </div>

                <div className="btn-center">
                    <button className="primary-btn" onClick={register}>✅ Save Patient</button>
                </div>

            </div>
        </div>
    );
};

export default RegisterPatient;