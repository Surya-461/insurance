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
import "../styles/UserDashboard.css";

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
    blue: "#3b82f6",
    purple: "#8b5cf6"
};

/* =========================
   CREDIT SCORE GAUGE
========================= */
const CreditScoreGauge = ({ score }) => {
    const MIN = 300;
    const MAX = 850;

    const safeScore = Math.min(Math.max(score ?? 0, MIN), MAX);
    const percent = (safeScore - MIN) / (MAX - MIN);
    const needleAngle = -90 + percent * 180;

    const zones = [
        { value: 0.33, color: COLORS.red },
        { value: 0.34, color: COLORS.orange },
        { value: 0.33, color: COLORS.green }
    ];

    return (
        <div className="gauge-wrapper">
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

            <div
                className="gauge-needle"
                style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)` }}
            />
            <div className="gauge-center" />

            <div className="gauge-score">
                <h2>{safeScore}</h2>
                <p>Credit Score</p>
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

    /* AUTH GUARD */
    useEffect(() => {
        if (
            localStorage.getItem("auth") !== "true" ||
            localStorage.getItem("role") !== "user"
        ) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    /* USER ID */
    const userId = useMemo(
        () => paramId || localStorage.getItem("dbId"),
        [paramId]
    );

    /* FETCH DATA */
    useEffect(() => {
        fetch(DATA_URL)
            .then(res => res.json())
            .then(data => setUsers(data.applications || []))
            .catch(console.error);
    }, []);

    /* SELECT USER */
    const selectedUser = useMemo(() => {
        if (!users.length || !userId) return null;
        return users.find(u => String(u.id) === String(userId));
    }, [users, userId]);

    /* APPROVAL STATUS – SAFE */
    const approvalStatus = useMemo(() => {
        if (!selectedUser) return "Pending";
        return (
            selectedUser.approval_status ||
            selectedUser.Approval_Status ||
            selectedUser.policy_status ||
            "Pending"
        );
    }, [selectedUser]);

    /* AVG MILEAGE BY VEHICLE YEAR */
    const avgMileageByYear = useMemo(() => {
        const map = {};
        users.forEach(u => {
            if (!map[u.vehicle_year]) {
                map[u.vehicle_year] = { total: 0, count: 0 };
            }
            map[u.vehicle_year].total += u.annual_mileage || 0;
            map[u.vehicle_year].count++;
        });

        return Object.keys(map).map(year => ({
            name: year,
            value: Math.round(map[year].total / map[year].count)
        }));
    }, [users]);

    if (!selectedUser) {
        return <p className="loading-text">Loading user profile…</p>;
    }

    return (
        <div className="dashboard-page fade-in">
            <div className="dashboard-header">
                <h2>User Risk Profile</h2>
                <p>User ID: <b>{userId}</b></p>
            </div>

            {/* KPI STRIP */}
            <div className="kpi-grid">
                <div className="kpi-card gradient-red">
                    <span>RISK CATEGORY</span>
                    <h3>{selectedUser.risk_category}</h3>
                </div>

                {/* SINGLE LINE VIOLATIONS */}
                <div className="kpi-card gradient-blue violation-strip">
                    <div>🚔 <b>DUIs:</b> {selectedUser.duis}</div>
                    <div>💥 <b>Past Accidents:</b> {selectedUser.past_accidents}</div>
                    <div>🚗 <b>Speeding:</b> {selectedUser.speeding_violations}</div>
                </div>

                <div
                    className={`kpi-card ${approvalStatus === "Approved"
                            ? "gradient-green"
                            : "gradient-red"
                        }`}
                >
                    <span>APPROVAL STATUS</span>
                    <h3>{approvalStatus}</h3>
                </div>
            </div>

            {/* USER PROFILE TABLE */}
            <div className="card">
                <h5>User Profile Details</h5>
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehicle Year</th>
                            <th>Vehicle Type</th>
                            <th>Accident Risk</th>
                            <th>Risk Category</th>
                            <th>Past Accidents</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{selectedUser.id}</td>
                            <td>{selectedUser.vehicle_year}</td>
                            <td>{selectedUser.vehicle_type}</td>
                            <td>{selectedUser.accident_risk}</td>
                            <td>{selectedUser.risk_category}</td>
                            <td>{selectedUser.past_accidents}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* CREDIT SCORE */}
            <div className="card">
                <h5>Credit Score Health</h5>
                <CreditScoreGauge score={selectedUser.credit_score} />
            </div>

            {/* CHART */}
            <div className="card">
                <h5>Average Annual Mileage by Vehicle Year</h5>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={avgMileageByYear}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default UserDashboard;
