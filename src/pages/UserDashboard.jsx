import { useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar,
    XAxis, YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import "../styles/dashboard.css";


/* =========================
   GITHUB RAW DATA
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

/* =========================
   CREDIT SCORE GAUGE
========================= */
const CreditScoreGauge = ({ score }) => {
    const MIN = 300;
    const MAX = 850;

    const safeScore = Math.min(Math.max(score, MIN), MAX);

    /* ✅ Correct angle mapping */
    const percent = (safeScore - MIN) / (MAX - MIN);
    const needleAngle = -90 + percent * 180;

    const zones = [
        { value: 0.33, color: COLORS.red },
        { value: 0.34, color: COLORS.orange },
        { value: 0.33, color: COLORS.green }
    ];

    return (
        <div style={{ position: "relative", height: 260 }}>

            {/* Gauge */}
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
                    bottom: 60,
                    left: "50%",
                    width: 4,
                    height: 90,
                    background: "#111",
                    borderRadius: 4,
                    transformOrigin: "bottom center",
                    transform: `translateX(-50%) rotate(${needleAngle}deg)`,
                    transition: "transform 1s ease-out",
                    zIndex: 10
                }}
            />

            {/* Needle Center */}
            <div
                style={{
                    position: "absolute",
                    bottom: 55,
                    left: "50%",
                    width: 14,
                    height: 14,
                    background: "#111",
                    borderRadius: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 11
                }}
            />

            {/* Score */}
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

            <span style={{ position: "absolute", bottom: 10, left: 10 }}>300</span>
            <span style={{ position: "absolute", bottom: 10, right: 10 }}>850</span>
        </div>
    );
};

/* =========================
   USER DASHBOARD
========================= */
const UserDashboard = () => {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState("All");

    /* Fetch data */
    useEffect(() => {
        fetch(DATA_URL)
            .then(res => res.json())
            .then(data => setUsers(data.applications || []))
            .catch(err => console.error("FETCH ERROR:", err));
    }, []);

    /* Selected user */
    const selectedUser = useMemo(() => {
        if (!users.length) return null;
        if (selectedId === "All") return users[0];
        return users.find(u => String(u.id) === selectedId);
    }, [users, selectedId]);

    /* Derived values */
    const creditScore = selectedUser?.credit_score || 0;
    const vehicleType = selectedUser?.vehicle_type || "-";
    const annualMileage = selectedUser?.annual_mileage || 0;

    const riskLevel =
        creditScore >= 700 ? "LOW RISK" :
            creditScore >= 550 ? "MEDIUM RISK" :
                "HIGH RISK";

    const riskColor =
        creditScore >= 700 ? COLORS.green :
            creditScore >= 550 ? COLORS.orange :
                COLORS.red;

    /* Violations */
    const violationData = useMemo(() => ([
        { name: "DUIs", value: selectedUser?.duis || 0 },
        { name: "Accidents", value: selectedUser?.past_accidents || 0 },
        { name: "Speeding", value: selectedUser?.speeding_violations || 0 }
    ]), [selectedUser]);

    /* Mileage distribution */
    const mileageData = useMemo(() => {
        const map = {};
        users.forEach(u => {
            map[u.mileage_group] =
                (map[u.mileage_group] || 0) + u.annual_mileage;
        });
        return Object.entries(map).map(([k, v]) => ({
            name: k,
            value: Math.round(v)
        }));
    }, [users]);

    return (
        <div className="dashboard-page">

            <div className="dashboard-header">
                <h2>User Risk & Insurance Profile</h2>
                <p>Personalized insurance risk analytics</p>
            </div>

            <div className="filter-card">
                <label>User ID</label>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                    <option value="All">All</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.id}</option>
                    ))}
                </select>
            </div>

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

                <div className="kpi-card" style={{ borderTop: `4px solid ${riskColor}` }}>
                    <span>RISK LEVEL</span>
                    <h3 style={{ color: riskColor }}>{riskLevel}</h3>
                </div>
            </div>

            <div className="chart-row">
                <div className="chart-card">
                    <h5>Credit Score Health</h5>
                    <CreditScoreGauge score={creditScore} />
                </div>

                <div className="chart-card">
                    <h5>Driving Violations</h5>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={violationData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value" fill={COLORS.red} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-row">
                <div className="chart-card">
                    <h5>Annual Mileage Distribution</h5>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={mileageData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill={COLORS.blue} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default UserDashboard;
