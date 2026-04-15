import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Ct from "../../context/Ct.jsx";
import Cookies from "js-cookie";
import "../../styles/nav.css"; // 👈 add this
const Nav = () => {
    const obj = useContext(Ct);
    const navigate = useNavigate();

    const logout = () => {
        Cookies.remove("logininfo");
        obj.updstate({ token: "", uid: "", name: "", role: "" });
        navigate("/Login");
    };

    return (
        <nav className="nav">

            {/* Brand */}
            
            <div className="brand">
                <span className="brand-icon">🏥</span>
                MediCare Hospital
            </div>

            {/* Links */}
            <div className="nav-links">

                <Link to="/" className="nav-link">Home</Link>

                {!obj.state.token && (
                    <>
                        <Link to="/Login" className="btn-outline">
                            🔑 Login
                        </Link>

                        <Link to="/register" className="btn-gradient">
                            📝 Register
                        </Link>
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
                        >
                            Dashboard
                        </Link>

                        <button onClick={logout} className="btn-danger">
                            Logout
                        </button>
                    </>
                )}

            </div>
        </nav>
    );
};

export default Nav;