import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer
} from "recharts";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/dashboard.css";


/* =========================
   COLOR PALETTE
========================= */
const COLORS = {
    Approved: "#22c55e",
    Rejected: "#ef4444",
    Pending: "#94a3b8"
};

const DATA_URL =
    "https://raw.githubusercontent.com/Surya-461/users/main/users.json";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [showApproved, setShowApproved] = useState(true);
    const [showRejected, setShowRejected] = useState(true);
    const [selectedId, setSelectedId] = useState("All");

    /* =========================
       AUTH GUARD (ADMIN ONLY)
    ========================= */
    useEffect(() => {
        if (localStorage.getItem("role") !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    /* =========================
       FETCH USERS (GITHUB JSON)
    ========================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(DATA_URL);
                const data = await response.json();

                // ✅ YOUR JSON: { applications: [...] }
                const applications = data.applications || [];

                setUsers(
                    applications.map(u => ({
                        ...u,
                        // normalize status field
                        Approval_Status:
                            u.Approval_Status || u.policy_status || "Pending"
                    }))
                );
            } catch (error) {
                console.error("FETCH ERROR:", error);
            }
        };

        fetchUsers();
    }, []);

    /* =========================
       FILTER LOGIC
    ========================= */
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            if (u.Approval_Status === "Approved" && !showApproved) return false;
            if (u.Approval_Status === "Rejected" && !showRejected) return false;
            return true;
        });
    }, [users, showApproved, showRejected]);

    const tableUsers = useMemo(() => {
        if (selectedId === "All") return filteredUsers;
        return filteredUsers.filter(u => String(u.id) === selectedId);
    }, [filteredUsers, selectedId]);

    /* =========================
       KPIs
    ========================= */
    const approvedCount = filteredUsers.filter(
        u => u.Approval_Status === "Approved"
    ).length;

    const rejectedCount = filteredUsers.filter(
        u => u.Approval_Status === "Rejected"
    ).length;

    /* =========================
       KPI TRENDS
    ========================= */
    const [prevStats, setPrevStats] = useState({
        approved: 0,
        rejected: 0
    });

    useEffect(() => {
        setPrevStats({
            approved: approvedCount,
            rejected: rejectedCount
        });
    }, [approvedCount, rejectedCount]);

    const trendArrow = (current, previous) =>
        current > previous ? "▲" : current < previous ? "▼" : "▬";

    /* =========================
       CHART DATA
    ========================= */
    const approvalData = [
        { name: "Approved", value: approvedCount },
        { name: "Rejected", value: rejectedCount }
    ];

    /* =========================
       INSIGHTS BUILDER
    ========================= */
    const buildInsight = key =>
        [...new Set(filteredUsers.map(u => u[key]))].map(v => {
            const rows = filteredUsers.filter(u => u[key] === v);
            return {
                label: v,
                Approved: rows.filter(r => r.Approval_Status === "Approved")
                    .length,
                Rejected: rows.filter(r => r.Approval_Status === "Rejected")
                    .length
            };
        });

    const riskInsight = buildInsight("risk_category");
    const vehicleInsight = buildInsight("vehicle_type");
    const incomeInsight = buildInsight("income");

    return (
        <div className="dashboard-page">

            {/* HEADER */}
            <div className="dashboard-header">
                <h2>🛠️ Insurance Risk & Approval Dashboard</h2>
                <p>Admin underwriting control</p>
            </div>

            {/* KPI */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <span>Total Applications</span>
                    <h3>{filteredUsers.length}</h3>
                </div>

                <div className="kpi-card success">
                    <span>
                        Approved {trendArrow(approvedCount, prevStats.approved)}
                    </span>
                    <h3>{approvedCount}</h3>
                </div>

                <div className="kpi-card danger">
                    <span>
                        Rejected {trendArrow(rejectedCount, prevStats.rejected)}
                    </span>
                    <h3>{rejectedCount}</h3>
                </div>
            </div>

            {/* FILTER + BAR + PIE */}
            <div className="chart-row">
                <div className="filter-card">
                    <h5>Filters</h5>
                    <label>
                        <input
                            type="checkbox"
                            checked={showApproved}
                            onChange={() =>
                                setShowApproved(!showApproved)
                            }
                        />
                        Approved
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showRejected}
                            onChange={() =>
                                setShowRejected(!showRejected)
                            }
                        />
                        Rejected
                    </label>
                </div>

                <div className="chart-card">
                    <h5>Approval Distribution</h5>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={approvalData}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="value">
                                {approvalData.map((e, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[e.name]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h5>Status Share</h5>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={approvalData}
                                dataKey="value"
                                nameKey="name"
                                label
                            >
                                {approvalData.map((e, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[e.name]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* INSIGHTS */}
            {[["Risk", riskInsight], ["Vehicle", vehicleInsight], ["Income", incomeInsight]].map(
                ([title, data], i) => (
                    <div className="chart-card" key={i}>
                        <h5>{title} vs Approval</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data}>
                                <XAxis dataKey="label" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="Approved"
                                    fill={COLORS.Approved}
                                />
                                <Bar
                                    dataKey="Rejected"
                                    fill={COLORS.Rejected}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            )}

            {/* TABLE */}
            <div className="table-card">
                <h5>📋 Application Overview</h5>

                <select
                    className="filter-select"
                    value={selectedId}
                    onChange={e => setSelectedId(e.target.value)}
                >
                    <option value="All">All IDs</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>
                            ID {u.id}
                        </option>
                    ))}
                </select>

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Credit</th>
                            <th>Vehicle</th>
                            <th>Risk</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableUsers.slice(0, 10).map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.credit_score}</td>
                                <td>{u.vehicle_type}</td>
                                <td>{u.risk_category}</td>
                                <td>
                                    <span
                                        className={`status ${u.Approval_Status.toLowerCase()}`}
                                    >
                                        {u.Approval_Status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AdminDashboard;
