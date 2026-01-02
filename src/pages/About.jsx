// pages/About.jsx
import "./About.css";

const About = () => {
    return (
        <div className="about-page">

            {/* ================= TOP CAROUSEL ================= */}
            <section className="about-carousel">
                <div
                    id="aboutCarousel"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-interval="4000"
                >

                    {/* Indicators */}
                    <div className="carousel-indicators">
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="0" className="active"></button>
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="1"></button>
                        <button data-bs-target="#aboutCarousel" data-bs-slide-to="2"></button>
                    </div>

                    {/* Slides */}
                    <div className="carousel-inner">

                        <div className="carousel-item active">
                            <div className="carousel-bg slide-1">
                                <div className="carousel-content">
                                    <h1>Insurance Claim Analytics</h1>
                                    <p>
                                        Transforming complex insurance data into
                                        actionable business insights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <div className="carousel-bg slide-2">
                                <div className="carousel-content">
                                    <h1>Fraud & Risk Intelligence</h1>
                                    <p>
                                        Detect suspicious claims early and
                                        reduce financial losses.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <div className="carousel-bg slide-3">
                                <div className="carousel-content">
                                    <h1>Data-Driven Growth</h1>
                                    <p>
                                        Improve efficiency, compliance,
                                        and customer trust.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#aboutCarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon"></span>
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#aboutCarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon"></span>
                    </button>

                </div>
            </section>

            {/* ================= MISSION ================= */}
            <section className="about-section about-mission">
                <div className="container py-5">
                    <div className="row align-items-center">

                        <div className="col-md-6">
                            <h2 className="about-title text-wind mb-3">
                                Our Mission
                            </h2>
                            <p className="about-text">
                                Our mission is to empower insurance companies,
                                TPAs, and financial institutions with data-driven
                                analytics that improve claim efficiency, reduce fraud,
                                and enhance transparency.
                            </p>
                            <p className="about-text">
                                We transform raw operational data into interactive
                                dashboards that support faster and smarter decisions.
                            </p>
                        </div>

                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
                                alt="Insurance Analytics"
                                className="img-fluid shadow about-img"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= PROBLEMS WE SOLVE ================= */}
            <section className="about-section about-solutions">
                <div className="container py-5">
                    <div className="row text-center mb-4">
                        <h2 className="about-title text-wind">
                            What Problems We Solve
                        </h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>⏱ Claim Delays</h3>
                                <p>
                                    Identify bottlenecks and reduce
                                    claim processing turnaround time.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>🚨 Fraud Detection</h3>
                                <p>
                                    Detect abnormal claim patterns
                                    using analytical indicators.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>📉 Loss Control</h3>
                                <p>
                                    Monitor loss ratios, settlements,
                                    and portfolio profitability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ================= WHO WE SERVE ================= */}
            <section className="about-section about-serve">
                <div className="container py-5">
                    <div className="row text-center mb-4">
                        <h2 className="about-title text-wind">
                            Who We Serve
                        </h2>
                        <p className="about-text">
                            Designed for every stakeholder in the insurance ecosystem.
                        </p>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-3">
                            <div className="impact-card">
                                <h3>🏢 Insurers</h3>
                                <p>Portfolio monitoring and loss optimization</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <h3>🤝 TPAs</h3>
                                <p>Operational efficiency and faster settlements</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <h3>📊 Analysts</h3>
                                <p>Risk indicators and fraud intelligence</p>
                            </div>
                        </div>

                        <div className="col-md-3">
                            <div className="impact-card">
                                <h3>🎓 Learners</h3>
                                <p>Hands-on exposure to real analytics use cases</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= ANALYTICS APPROACH ================= */}
            <section className="about-section about-approach">
                <div className="container py-5">
                    <div className="row align-items-center">

                        <div className="col-md-6">
                            <h2 className="about-title text-wind mb-3">
                                Our Analytics Approach
                            </h2>
                            <ul className="about-list">
                                <li>Data ingestion from claim & policy systems</li>
                                <li>Cleaning, validation & feature engineering</li>
                                <li>Fraud and risk indicator analysis</li>
                                <li>Interactive Power BI dashboards</li>
                                <li>Continuous performance monitoring</li>
                            </ul>
                        </div>

                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80"
                                alt="Analytics Process"
                                className="img-fluid shadow about-img"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE US ================= */}
            <section className="about-section about-why">
                <div className="container py-5">
                    <div className="row text-center mb-4">
                        <h2 className="about-title text-wind">
                            Why Choose Our Platform
                        </h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>⚡ Real-Time Insights</h3>
                                <p>Faster decisions with up-to-date analytics</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>🔍 Fraud Prevention</h3>
                                <p>Reduce losses through early detection</p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="impact-card">
                                <h3>📈 Business Impact</h3>
                                <p>Improved profitability and customer trust</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
