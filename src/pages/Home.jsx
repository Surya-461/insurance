// pages/Home.jsx
import "./Home.css";

const Home = () => {
    const modules = [
        {
            title: "📑 Claim Processing Analytics",
            imgClass: "bg-claims",
            link: "https://www.ibm.com/analytics/claims-management",
            points: [
                "Total claims received vs settled",
                "Average claim processing time",
                "Pending & rejected claims analysis"
            ]
        },
        {
            title: "🚨 Fraud Detection Insights",
            imgClass: "bg-fraud",
            link: "https://www.sas.com/en_in/home.html",
            points: [
                "Suspicious claim identification",
                "High-risk customer profiling",
                "Duplicate & abnormal claims detection"
            ]
        },
        {
            title: "💰 Settlement & Payout Analysis",
            imgClass: "bg-settlement",
            link: "https://www.mckinsey.com/industries/financial-services/our-insights",
            points: [
                "Approved vs paid claim amounts",
                "Settlement turnaround tracking",
                "Loss ratio monitoring"
            ]
        },
        {
            title: "🌍 Regional Claim Performance",
            imgClass: "bg-region",
            link: "https://docs.oracle.com/en/industries/financial-services/ofs-analytical-applications/insurance-performance-insight-for-general-insurance/81200/ipigi/claim-performance-summary-tab.html",
            points: [
                "Region-wise claim volume",
                "Branch-level performance",
                "Urban vs rural claim trends"
            ]
        },
        {
            title: "📊 Policy & Risk Analytics",
            imgClass: "bg-risk",
            link: "https://www.tableau.com/solutions/industries/financial-services/insurance",
            points: [
                "Policy-wise claim frequency",
                "Risk exposure analysis",
                "Premium vs claims ratio"
            ]
        },
        {
            title: "📈 Forecasting & Trends",
            imgClass: "bg-forecast",
            link: "https://explodingtopics.com/blog/trend-forecasting",
            points: [
                "Future claim volume prediction",
                "Seasonal claim patterns",
                "Cost optimization insights"
            ]
        }
    ];

    return (
        <div className="home-page">

            {/* ================= HERO SECTION ================= */}
            <header className="home-hero-section">
                <div className="container min-vh-100 d-flex align-items-center">
                    <div className="row w-100 align-items-center">

                        <div className="col-lg-7 text-light">
                            <p className="home-tagline">
                                Trusted • Intelligent • Secure
                            </p>

                            <h1 className="home-hero-title">
                                Insurance Claim{" "}
                                <span className="home-hero-highlight">
                                    Analytics Platform
                                </span>
                            </h1>

                            <p className="home-hero-desc">
                                A real-world insurance analytics solution designed to help insurers
                                monitor claims, detect fraud, optimize settlements, and improve
                                operational efficiency using data-driven dashboards.
                            </p>

                            <div className="d-flex gap-3 flex-wrap">
                                <a href="#modules" className="btn btn-success btn-lg">
                                    Explore Analytics
                                </a>
                                <a href="#demo" className="btn btn-outline-light btn-lg">
                                    Request Demo
                                </a>
                            </div>

                            {/* ================= STATS ================= */}
                            <div className="home-stats">
                                <div className="stat-item">
                                    <h3>99.9%</h3>
                                    <p>Uptime</p>
                                </div>

                                <div className="stat-item">
                                    <h3>50M+</h3>
                                    <p>Claims Processed</p>
                                </div>

                                <div className="stat-item">
                                    <h3>200+</h3>
                                    <p>Enterprise Clients</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </header>

            {/* ================= ANALYTICS MODULES ================= */}
            <section id="modules" className="home-modules-section">
                <div className="container py-5">
                    <div className="text-center mb-5 text-light">
                        <h2>Insurance Analytics Modules</h2>
                        <p>
                            Core dashboards used by insurance companies, TPAs, and risk teams.
                        </p>
                    </div>

                    <div className="row g-4">

                        {modules.map((item, index) => (
                            <div className="col-md-6 col-lg-4" key={index}>
                                <div
                                    className={`home-module-card ${item.imgClass}`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => window.open(item.link, "_blank")}
                                >
                                    <div className="overlay">
                                        <h5>{item.title}</h5>
                                        <ul>
                                            {item.points.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>

                                        <button
                                            className="btn btn-outline-light btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(item.link, "_blank");
                                            }}
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ================= DEMO REQUEST SECTION ================= */}
            <section id="demo" className="home-demo-section">
                <div className="container py-5">
                    <div className="row align-items-center g-5">

                        <div className="col-lg-6 text-light">
                            <h3>Request an Insurance Analytics Demo</h3>
                            <p>
                                Discover how our dashboards help insurance companies reduce fraud,
                                speed up claim settlements, and improve profitability.
                            </p>
                            <ul>
                                <li>Claim lifecycle visibility</li>
                                <li>Fraud & risk monitoring</li>
                                <li>Power BI embedded dashboards</li>
                            </ul>
                        </div>

                        <div className="col-lg-6">
                            <div className="home-form-card">
                                <h5>Demo Request Form</h5>

                                <input className="form-control" placeholder="Full Name" required/>
                                <input className="form-control" placeholder="Official Email" required/>
                                <input className="form-control" placeholder="Insurance Company Name" required/>

                                <select className="form-control">
                                    <option>Select Role</option>
                                    <option>Claims Manager</option>
                                    <option>Risk Analyst</option>
                                    <option>Insurance Officer</option>
                                    <option>Student / Learner</option>
                                </select>

                                <textarea
                                    className="form-control"
                                    placeholder="What insights are you looking for?"
                                />

                                <button
                                    className="btn btn-success w-100"
                                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                >
                                    Request Demo
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
