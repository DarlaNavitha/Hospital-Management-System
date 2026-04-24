import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Ct from "../../context/Ct.jsx";
import Cookies from "js-cookie";
import "../../styles/nav.css";

const Nav = () => {
    const obj = useContext(Ct);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // sidebar state

    const logout = () => {
        Cookies.remove("logininfo");
        obj.updstate({ token: "", uid: "", name: "", role: "" });
        navigate("/Login");
        setOpen(false);
    };

    return (
        <nav className="nav">

            {/* BRAND + MENU ICON */}
            <div className="brand">
                <span className="brand-icon">🏥 MediCare Hospital</span>

                {/* MENU BUTTON */}
                <span className="menu-toggle" onClick={() => setOpen(!open)}>
                    ☰
                </span>
            </div>

            {/* SIDEBAR */}
            <div className={`nav-links ${open ? "active" : ""}`}>

                <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Home</Link>

                {!obj.state.token && (
                    <>
                        <Link to="/Login" className="btn-outline" onClick={() => setOpen(false)}>🔑 Login</Link>
                        <Link to="/register" className="btn-gradient" onClick={() => setOpen(false)}>📝 Register</Link>
                    </>
                )}

                {obj.state.token && (
                    <>
                        <Link
                            to={
                                obj.state.role?.toLowerCase() === 'admin' ? '/admin'
                                    : obj.state.role?.toLowerCase() === 'doctor' ? '/doctor'
                                        : obj.state.role?.toLowerCase() === 'receptionist' ? '/receptionist'
                                            : '/patient'
                            }
                            className="nav-link highlight"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>

                        <button onClick={logout} className="btn-danger">
                            Logout
                        </button>
                    </>
                )}
            </div>

            {/* OVERLAY */}
            {open && <div className="overlay" onClick={() => setOpen(false)}></div>}

        </nav>
    );
};

export default Nav;