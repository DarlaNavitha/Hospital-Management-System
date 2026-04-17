import React from 'react';
import "../../styles/footer.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-grid">

                <div className="footer-col">
                    <h3 className="footer-brand">🏥 MediCare Hospital</h3>
                    <p className="footer-text">
                        Providing world-class healthcare since 1995. Our mission is to deliver
                        compassionate, top-quality medical care with advanced technology.
                    </p>
                </div>

                <div className="footer-col">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul className="footer-list">
                        <li>Services</li>
                        <li>Find a Doctor</li>
                        <li>Appointments</li>
                        <li>Contact Us</li>
                        <li>About</li>
                    </ul>
                </div>

            
                <div className="footer-col">
                    <h4 className="footer-title">Contact Details</h4>
                    <p className="footer-text">📍 123 Health Ave, Medical City</p>
                    <p className="footer-text">📞 +1 (800) 123-4567</p>
                    <p className="footer-text">✉️ info@medicarehosp.com</p>

                    <div className="footer-social">
                        <span>🌐</span>
                        <span>📘</span>
                        <span>🐦</span>
                        <span>📸</span>
                    </div>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} MediCare Hospital. All rights reserved.
            </div>

        </footer>
    );
};

export default Footer;