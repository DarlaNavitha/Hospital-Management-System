import { useState, useEffect } from "react";
import axios from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import "../../styles/register.css";
import "../../styles/auth.css";
import Cookies from "js-cookie";

const Register = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        number: "",
        age: "",
        gender: "male",
        bloodGroup: "",
        address: ""
    });

    // RESET STATE
    useEffect(() => {
        setData({
            name: "",
            email: "",
            password: "",
            number: "",
            age: "",
            gender: "male",
            bloodGroup: "",
            address: ""
        });

        Cookies.remove("logininfo");
    }, []);

    const fun = (e) => {
        let { name, value } = e.target;

        // PHONE VALIDATION
        if (name === "number") {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setData({ ...data, [name]: value });
    };

    const register = async () => {

        if (data.number.length !== 10) {
            alert("Phone number must be exactly 10 digits");
            return;
        }

        try {
            const submitData = {
                ...data,
                role: "patient", 
                email: data.email.trim().toLowerCase(),
                age: Number(data.age) || 0,
                phone: data.number
            };

            let res = await axios.post("/auth/register", submitData);

            alert(res.data.msg);
            navigate("/Login");

        } catch (err) {
            alert(err.response?.data?.msg || "Error in registration");
        }
    };

    return (
        <div className="register-page">

            <div className="register-container">

                <input type="text" style={{ display: "none" }} autoComplete="off" />
                <input type="password" style={{ display: "none" }} autoComplete="new-password" />

               
                <div className="register-left">
                    <h2>Create Account</h2>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={data.name}
                        onChange={fun}
                        autoComplete="off"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={data.email}
                        onChange={fun}
                        autoComplete="off"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={fun}
                        autoComplete="new-password"
                    />

                    <input
                        type="text"
                        name="number"
                        placeholder="Phone Number"
                        value={data.number}
                        onChange={fun}
                        autoComplete="off"
                    />
                </div>

                
                <div className="register-right">

                    <h2>Medical Details</h2>

                    <div className="grid-2">
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={data.age}
                            onChange={fun}
                        />

                        <select name="gender" value={data.gender} onChange={fun}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        name="bloodGroup"
                        placeholder="Blood Group (e.g. O+)"
                        value={data.bloodGroup}
                        onChange={fun}
                    />

                    <textarea
                        name="address"
                        placeholder="Residential Address"
                        value={data.address}
                        onChange={fun}
                    />

                </div>

                
                <div className="register-bottom">
                    <button onClick={register}>Register</button>
                </div>

            </div>

        </div>
    );
};

export default Register;