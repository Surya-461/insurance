// pages/Contact.jsx
import "./Contact.css";

const Contact = () => {
    return (
        <div className="contact-page py-5">
            <div className="container">

                {/* ================= HEADER ================= */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold contact-title">Contact Us</h2>
                    <p className="contact-subtitle">
                        Get in touch with our banking and insurance analytics experts for
                        product demos, integrations, or support.
                    </p>
                </div>

                {/* ================= INFO FRAMES ================= */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="contact-frame">
                            <h5>📍 Office Address</h5>
                            <p>
                                FinDrive Analytics Pvt Ltd<br />
                                Financial Technology Park<br />
                                Hyderabad, Telangana – 500081
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="contact-frame">
                            <h5>📞 Contact Details</h5>
                            <p>
                                Phone: +91 98765 43210<br />
                                Support: +91 90123 45678<br />
                                Email: support@findriveanalytics.com
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="contact-frame">
                            <h5>🕒 Working Hours</h5>
                            <p>
                                Monday – Friday: 9:00 AM – 6:00 PM<br />
                                Saturday: 10:00 AM – 4:00 PM<br />
                                Sunday: Closed
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================= FORM + MAP ================= */}
                <div className="row g-4 align-items-stretch">
                    {/* CONTACT FORM */}
                    <div className="col-lg-6">
                        <div className="contact-frame h-100">
                            <h5 className="mb-3">📩 Send a Message</h5>
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        className="form-control"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Official Email</label>
                                    <input
                                        className="form-control"
                                        placeholder="you@company.com"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Subject</label>
                                    <input
                                        className="form-control"
                                        placeholder="e.g., Dashboard demo / Integration"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        placeholder="Tell us about your analytics or reporting requirements"
                                    />
                                </div>

                                <button className="btn btn-success w-100">
                                    Submit Message
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* MAP */}
                    <div className="col-lg-6">
                        <div className="contact-frame h-100 text-center">
                            <h5 className="mb-3">🌍 Our Location</h5>

                            <div className="map-container">
                                <iframe
                                    title="Company Location"
                                    src="https://www.google.com/maps?q=Hyderabad,Telangana,India&output=embed"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: "12px" }}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Contact;
