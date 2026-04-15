import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import Ct from "../context/Ct.jsx";
import Cookies from "js-cookie";
import "../styles/home.css";

const Home = () => {
    const obj = useContext(Ct);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove("logininfo");
        obj.updstate({ token: "", uid: "", name: "", role: "" });
        navigate("/Login");
    };

    // ================= LOGGED IN =================
    if (obj.state.token) {
        return (
            <div className="home-page">

                <section className="dashboard-section">
                    <div className="dashboard-grid">

                        {obj.state.role?.toLowerCase() === 'admin' && (
                            <div className="glass-card">
                                <h3>🩺 Admin Control</h3>
                                <p>Manage doctors and system users.</p>
                                <Link to="/admin" className="go-btn">Go</Link>
                            </div>
                        )}

                        {obj.state.role?.toLowerCase() === 'doctor' && (
                            <div className="glass-card">
                                <h3>📅 Doctor Panel</h3>
                                <p>Manage patients & prescriptions.</p>
                                <Link to="/doctor" className="card-btn">Open</Link>
                            </div>
                        )}

                        {obj.state.role?.toLowerCase() === 'patient' && (
                            <div className="glass-card">
                                <h3>📋 My Dashboard</h3>
                                <p>View appointments & reports.</p>
                                <Link to="/patient" className="view-btn">View</Link>
                            </div>
                        )}

                        {obj.state.role?.toLowerCase() === 'receptionist' && (
                            <div className="glass-card">
                                <h3>🏥 Reception Panel</h3>
                                <p>Register patients & book visits.</p>
                                <Link to="/receptionist" className="card-btn">Open</Link>
                            </div>
                        )}

                    </div>
                </section>
            </div>
        );
    }

    // ================= PUBLIC HOME =================
    return (
        <div className="home-page">

            {/* HERO */}
            <section className="hero">
                <h1>
                    Expert Care, <span>Trusted Doctors</span>
                </h1>
                <p>
                    World-class healthcare with advanced technology and compassionate care.
                </p>

                <Link to="/Login" className="primary-btn">
                    🔑 Login to Portal
                </Link>
            </section>

            {/* SERVICES */}
            <section className="dashboard-section">
                <h2 className="section-title">Our Services</h2>

                <div className="dashboard-grid">
                    <div className="glass-card">
                        <h3>🩺 General Checkup</h3>
                        <p>Routine health checkups and preventive care.</p>
                    </div>

                    <div className="glass-card">
                        <h3>💊 Pharmacy</h3>
                        <p>24/7 medical store with all essential medicines.</p>
                    </div>

                    <div className="glass-card">
                        <h3>🚑 Emergency Care</h3>
                        <p>Immediate medical attention anytime.</p>
                    </div>
                </div>
            </section>

            {/* DOCTORS */}
            <section className="dashboard-section">
                <h2 className="section-title">Our Specialists</h2>

                <div className="dashboard-grid">
                    <div className="glass-card">
                        <h3>👨‍⚕️ Cardiologist</h3>
                        <p>Heart specialists with 10+ years experience.</p>
                    </div>

                    <div className="glass-card">
                        <h3>🧠 Neurologist</h3>
                        <p>Brain and nervous system experts.</p>
                    </div>

                    <div className="glass-card">
                        <h3>🦴 Orthopedic</h3>
                        <p>Bone and joint specialists.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>Need Medical Help?</h2>
                <p>Book your appointment now and get expert consultation.</p>

                <Link to="/register" className="cta-btn">
                    📅 Book Appointment
                </Link>
            </section>

        </div>
    );
};

export default Home;