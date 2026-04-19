import { useContext, useState, useEffect } from 'react';
import API from '../../api/axios.js';
import Ct from '../../context/Ct.jsx';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../../styles/login.css';
import "../../styles/auth.css";

const Login = () => {

    let [data, setData] = useState({ email: "", password: "" });
    let [msg, setMsg] = useState("");

    let obj = useContext(Ct);
    let navigate = useNavigate();

    // RESET STATE
    useEffect(() => {
    setData({ email: "", password: "" });

    const cookie = Cookies.get("logininfo");

    if (cookie) {
        try {
            const parsed = JSON.parse(cookie);

            if (parsed?.token && parsed?.user) {
                obj.updstate({
                    ...parsed.user,
                    token: parsed.token
                });

                navigate("/");
            } else {
                Cookies.remove("logininfo");
            }

        } catch (err) {
            Cookies.remove("logininfo"); // remove broken cookie
        }
    }
}, []);

    let fun = (e) => {
        let { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    let login = async () => {
        try {
            setMsg("");

            const trimmedData = {
                ...data,
                email: data.email.trim().toLowerCase()
            };

            let res = await API.post("/auth/login", trimmedData);

            if (res.data.token) {
                Cookies.set(
                        "logininfo",
                        JSON.stringify(res.data),
                        { expires: 1 }
                    );

                obj.updstate({
                    ...res.data.user,
                    token: res.data.token
                });

                navigate("/");
            } else {
                setMsg("Invalid response");
            }

        } catch (err) {
            setMsg(err.response?.data?.msg || "Login failed");
        }
    };

    return (
        <div className="login-page">

            <div className="login-container">

              
                <div className="login-left">
                    <div className="left-content">
                        <h2>WELCOME BACK!</h2>
                        <p>Access your dashboard and manage your healthcare.</p>
                    </div>
                </div>

               
                <div className="login-right">

                    <h2>Login</h2>

                    {msg && <p className="error">{msg}</p>}

                    <input type="text" style={{ display: "none" }} autoComplete="off" />
                    <input type="password" style={{ display: "none" }} autoComplete="new-password" />

                    <input
                        type="text"
                        name="email"
                        placeholder="Enter Email"
                        value={data.email}
                        onChange={fun}
                        autoComplete="off"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={data.password}
                        onChange={fun}
                        autoComplete="new-password"
                    />

                    <button onClick={login}>Login</button>

                    <Link to="/resetpwd" className="forgot">
                        Forgot Password?
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Login;