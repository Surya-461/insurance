// components/Footer.jsx
import { NavLink } from "react-router-dom";

const Footer = () => (
    <footer className="bg-dark text-light py-5">
        <div className="container">

            <div className="footer-container d-flex flex-wrap justify-content-between">

                {/* ================= LOGO + DESCRIPTION ================= */}
                <div className="mb-4" style={{ maxWidth: "260px" }}>
                    <div className="footer-logo d-flex align-items-center mb-2">
                        <div
                            className="logo-icon bg-info text-dark fw-bold rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: "38px", height: "38px" }}
                        >
                            F
                        </div>
                        <span className="fw-bold fs-5">FinDrive Analytics</span>
                    </div>
                    <p className="text-secondary small">
                        A data-driven vehicle loan and insurance analytics platform helping
                        banks, NBFCs, and insurers make smarter, risk-aware decisions using
                        real-time insights.
                    </p>
                </div>

                {/* ================= QUICK LINKS ================= */}
                <div className="footer-links mb-4">
                    <h5 className="text-info mb-3">Quick Links</h5>
                    <ul className="list-unstyled small">
                        <li>
                            <NavLink to="/" className="text-light text-decoration-none d-block mb-1">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/about" className="text-light text-decoration-none d-block mb-1">
                                About Us
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" className="text-light text-decoration-none d-block mb-1">
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </div>

                {/* ================= SERVICES ================= */}
                <div className="footer-links mb-4">
                    <h5 className="text-info mb-3">Our Solutions</h5>
                    <ul className="list-unstyled small">
                        <li className="mb-1">Vehicle Loan Analytics</li>
                        <li className="mb-1">Credit Risk Assessment</li>
                        <li className="mb-1">Approval & Default Monitoring</li>
                        <li className="mb-1">Insurance Portfolio Insights</li>
                        <li className="mb-1">Power BI Dashboards</li>
                    </ul>
                </div>

                {/* ================= SOCIAL / CONNECT ================= */}
                <div className="footer-links mb-4">
                    <h5 className="text-info mb-3">Connect With Us</h5>
                    <ul className="list-unstyled small">
                        <li><a href="#" className="text-light text-decoration-none d-block mb-1">LinkedIn</a></li>
                        <li><a href="#" className="text-light text-decoration-none d-block mb-1">Twitter</a></li>
                        <li><a href="#" className="text-light text-decoration-none d-block mb-1">YouTube</a></li>
                        <li><a href="#" className="text-light text-decoration-none d-block mb-1">Analytics Blog</a></li>
                    </ul>
                </div>

            </div>

            {/* ================= COPYRIGHT ================= */}
            <div className="text-center text-secondary small pt-3 border-top mt-4">
                <p className="mb-0">
                    © 2025 FinDrive Analytics. All rights reserved.
                    Banking & Insurance Analytics Platform.
                </p>
            </div>

        </div>
    </footer>
);

export default Footer;
