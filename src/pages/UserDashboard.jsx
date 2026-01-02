import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    BarChart, Bar,
    XAxis, YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import "../styles/dashboard.css";

/* =========================
   DATA SOURCE
========================= */
const DATA_URL =
    "https://raw.githubusercontent.com/Surya-461/users/main/users.json";

/* =========================
   COLORS
========================= */
const COLORS = {
    red: "#ef4444",
    orange: "#f59e0b",
    green: "#22c55e",
    blue: "#1e90ff",
    gray: "#e5e7eb"
};

/* Donut colors for violations */
const VIOLATION_COLORS = [
    COLORS.red,
    COLORS.orange,
    COLORS.blue
];

/* =========================
   CREDIT SCORE GAUGE
========================= */
const CreditScoreGauge = ({ score }) => {
    const MIN = 300;
    const MAX = 850;

    const safeScore = Math.min(Math.max(score, MIN), MAX);
    const percent = (safeScore - MIN) / (MAX - MIN);
    const needleAngle = -90 + percent * 180;

    const zones = [
        { value: 0.33, color: COLORS.red },
        { value: 0.34, color: COLORS.orange },
        { value: 0.33, color: COLORS.green }
    ];

    return (
        <div style={{ position: "relative", height: 260 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={zones}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={120}
                        dataKey="value"
                        stroke="none"
                    >
                        {zones.map((z, i) => (
                            <Cell key={i} fill={z.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* Needle */}
            <div
                style={{
                    position: "absolute",
                    bottom: 128,
                    left: "50%",
                    width: 4,
                    height: 80,
                    background: "black",
                    transformOrigin: "bottom center",
                    transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                    transition: "transform 1s ease-out"
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    left: "50%",
                    width: 14,
                    height: 14,
                    background: "black",
                    borderRadius: "50%",
                    transform: "translateX(-50%)"
                }}
            />

            <div
                style={{
                    position: "absolute",
                    bottom: 30,
                    width: "100%",
                    textAlign: "center"
                }}
            >
                <h2>{safeScore}</h2>
                <p style={{ color: "#6b7280" }}>Credit Score</p>
            </div>
        </div>
    );
};

/* =========================
   USER DASHBOARD
========================= */
const UserDashboard = () => {
    const navigate = useNavigate();
    const { id: paramId } = useParams();

    const [users, setUsers] = useState([]);

    /* =========================
       AUTH GUARD
    ========================= */
    useEffect(() => {
        const isAuth = localStorage.getItem("auth") === "true";
        const role = localStorage.getItem("role");

        if (!isAuth || role !== "user") {
            navigate("/login", { replace: true });
        }
    }, []);

    /* =========================
       USER ID RESOLUTION
    ========================= */
    const userId = paramId || localStorage.getItem("dbId");

    /* =========================
       FETCH USERS
    ========================= */
    useEffect(() => {
        fetch(DATA_URL)
            .then(res => res.json())
            .then(data => setUsers(data.applications || []))
            .catch(err => console.error("FETCH ERROR:", err));
    }, []);

    /* =========================
       SELECT USER
    ========================= */
    const selectedUser = useMemo(() => {
        if (!users.length || !userId) return null;
        return users.find(u => String(u.id) === String(userId));
    }, [users, userId]);

    const isLoading = !selectedUser;

    /* =========================
       SAFE VALUES
    ========================= */
    const creditScore = selectedUser?.credit_score ?? 0;
    const vehicleType = selectedUser?.vehicle_type ?? "-";
    const annualMileage = selectedUser?.annual_mileage ?? 0;

    const riskLevel =
        creditScore >= 700 ? "LOW RISK" :
        creditScore >= 550 ? "MEDIUM RISK" :
        "HIGH RISK";

    const riskColor =
        creditScore >= 700 ? COLORS.green :
        creditScore >= 550 ? COLORS.orange :
        COLORS.red;

    /* =========================
       DRIVING VIOLATIONS (DONUT)
    ========================= */
    const violationData = [
        { name: "DUIs", value: selectedUser?.duis ?? 0 },
        { name: "Accidents", value: selectedUser?.past_accidents ?? 0 },
        { name: "Speeding", value: selectedUser?.speeding_violations ?? 0 }
    ];

    /* =========================
       MILEAGE DISTRIBUTION
    ========================= */
    const mileageDistribution = useMemo(() => {
        const dist = { Low: 0, Medium: 0, High: 0 };

        users.forEach(u => {
            const miles = u.annual_mileage || 0;
            if (miles < 8000) dist.Low++;
            else if (miles <= 15000) dist.Medium++;
            else dist.High++;
        });

        return [
            { name: "Low", value: dist.Low },
            { name: "Medium", value: dist.Medium },
            { name: "High", value: dist.High }
        ];
    }, [users]);

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h2>User Risk & Insurance Profile</h2>
                <p>User ID: <b>{userId}</b></p>
            </div>

            {isLoading ? (
                <p style={{ textAlign: "center" }}>Loading user data...</p>
            ) : (
                <>
                    {/* KPI CARDS */}
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <span>VEHICLE TYPE</span>
                            <h3>{vehicleType}</h3>
                        </div>

                        <div className="kpi-card success">
                            <span>ANNUAL MILEAGE</span>
                            <h3>{(annualMileage / 1000).toFixed(2)}K</h3>
                        </div>

                        <div className="kpi-card">
                            <span>CREDIT SCORE</span>
                            <h3>{creditScore}</h3>
                        </div>

                        <div
                            className="kpi-card"
                            style={{ borderTop: `4px solid ${riskColor}` }}
                        >
                            <span>RISK LEVEL</span>
                            <h3 style={{ color: riskColor }}>
                                {riskLevel}
                            </h3>
                        </div>
                    </div>

                    {/* CHARTS ROW */}
                    <div className="kpi-grid">
                        <div className="kpi-card">
                            <h5>Credit Score Health</h5>
                            <CreditScoreGauge score={creditScore} />
                        </div>

                        {/* DONUT CHART */}
                        <div className="kpi-card">
                            <h5>Driving Violations</h5>

                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={violationData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={3}
                                    >
                                        {violationData.map((_, index) => (
                                            <Cell
                                                key={index}
                                                fill={VIOLATION_COLORS[index % VIOLATION_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Legend */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 16,
                                    marginTop: 8
                                }}
                            >
                                {violationData.map((v, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 10,
                                                height: 10,
                                                borderRadius: "50%",
                                                background: VIOLATION_COLORS[i]
                                            }}
                                        />
                                        <span style={{ fontSize: "0.8rem" }}>
                                            {v.name}: {v.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* MILEAGE DISTRIBUTION */}
                    <div className="chart-row">
                        <div className="chart-card">
                            <h5>Annual Mileage Distribution</h5>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={mileageDistribution}>
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill={COLORS.blue} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDashboard;
