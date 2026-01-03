import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    Tooltip, ResponsiveContainer, LabelList
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

    /* =========================
       STATE
    ========================= */
    const [users, setUsers] = useState([]);
    const [showApproved, setShowApproved] = useState(true);
    const [showRejected, setShowRejected] = useState(true);
    const [selectedId, setSelectedId] = useState("All");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("All");
    const [selectedRiskCategory, setSelectedRiskCategory] = useState("All");

    /* =========================
       AUTH GUARD
    ========================= */
    useEffect(() => {
        if (localStorage.getItem("role") !== "admin") {
            navigate("/login");
        }
    }, [navigate]);

    /* =========================
       FETCH + NORMALIZE DATA
    ========================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(DATA_URL);
                const data = await res.json();
                const apps = data.applications || [];

                setUsers(
                    apps.map(u => ({
                        ...u,
                        Approval_Status:
                            u.Approval_Status ||
                            u.policy_status ||
                            "Pending",

                        // ✅ FIX: Normalize risk_category
                        risk_category:
                            u.risk_category === "Medium" ||
                                u.risk_category === "Medium Risk"
                                ? "Medium Risk"
                                : u.risk_category === "High"
                                    ? "High Risk"
                                    : u.risk_category === "Low"
                                        ? "Low Risk"
                                        : u.risk_category
                    }))
                );
            } catch (err) {
                console.error("FETCH ERROR", err);
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

            if (selectedAgeGroup !== "All" && u.age_group !== selectedAgeGroup)
                return false;

            if (
                selectedRiskCategory !== "All" &&
                u.risk_category !== selectedRiskCategory
            )
                return false;

            return true;
        });
    }, [
        users,
        showApproved,
        showRejected,
        selectedAgeGroup,
        selectedRiskCategory
    ]);

    const tableUsers = useMemo(() => {
        if (selectedId === "All") return filteredUsers;
        return filteredUsers.filter(u => String(u.id) === selectedId);
    }, [filteredUsers, selectedId]);

    /* =========================
       KPI COUNTS
    ========================= */
    const approvedCount = filteredUsers.filter(
        u => u.Approval_Status === "Approved"
    ).length;

    const rejectedCount = filteredUsers.filter(
        u => u.Approval_Status === "Rejected"
    ).length;

    const approvalData = [
        { name: "Approved", value: approvedCount },
        { name: "Rejected", value: rejectedCount }
    ];


    /* =========================
       RISK vs STATUS
    ========================= */
    const riskApprovalData = useMemo(() => {
        const risks = ["Low Risk", "Medium Risk", "High Risk"];
        return risks.map(risk => {
            const rows = filteredUsers.filter(
                u => u.risk_category === risk
            );
            return {
                risk,
                Approved: rows.filter(
                    r => r.Approval_Status === "Approved"
                ).length,
                Rejected: rows.filter(
                    r => r.Approval_Status === "Rejected"
                ).length
            };
        });
    }, [filteredUsers]);

    /* =========================
       SAFE DRIVING DONUT
    ========================= */
    const safeDrivingData = useMemo(() => {
        const safe = filteredUsers.filter(
            u => u.safe_driving_flag === "Safe Driving"
        ).length;
        const risk = filteredUsers.length - safe;

        return [
            { name: "Safe Driving", value: safe },
            { name: "Risk Factors", value: risk }
        ];
    }, [filteredUsers]);

    const creditScoreBinData = useMemo(() => {
        const BIN_SIZE = 400;
        const bins = {};

        filteredUsers.forEach(u => {
            const score = Number(u.credit_score);
            if (isNaN(score)) return;

            const binStart = Math.floor(score / BIN_SIZE) * BIN_SIZE;
            const binEnd = binStart + BIN_SIZE - 1;
            const label = `${binStart}-${binEnd}`;

            bins[label] = (bins[label] || 0) + 1;
        });

        return Object.entries(bins)
            .map(([range, count]) => ({
                range,
                count
            }))
            .sort((a, b) => {
                const aStart = parseInt(a.range.split("-")[0]);
                const bStart = parseInt(b.range.split("-")[0]);
                return aStart - bStart;
            });
    }, [filteredUsers]); // ✅ THIS IS KEY


    /* =========================
       RECORD_ID by CLAIM STATUS & APPROVAL
    ========================= */
    const recordByClaimApprovalData = useMemo(() => {
        const map = {};

        filteredUsers.forEach(u => {
            const claim = u.claim_status || "Unknown";

            if (!map[claim]) {
                map[claim] = {
                    claim_status: claim,
                    Approved: 0,
                    Rejected: 0
                };
            }

            if (u.Approval_Status === "Approved") {
                map[claim].Approved += 1;
            } else if (u.Approval_Status === "Rejected") {
                map[claim].Rejected += 1;
            }
        });

        return Object.values(map);
    }, [filteredUsers]);

    // =========================
    // STATUS SHARE PERCENTAGE
    // =========================
    const totalApplications = approvedCount + rejectedCount;

    const renderPercentageLabel = ({ value }) => {
        if (!value || totalApplications === 0) return "";
        const percent = ((value / totalApplications) * 100).toFixed(1);
        return `${percent}%`;
    };

    /* =========================
   AVG ACCIDENTS & VIOLATIONS
   BY DRIVING EXPERIENCE
========================= */
    const drivingExperienceData = useMemo(() => {
        const groups = {};

        filteredUsers.forEach(u => {
            const exp = u.driving_experience || "Unknown";

            if (!groups[exp]) {
                groups[exp] = {
                    driving_experience: exp,
                    accidentsTotal: 0,
                    violationsTotal: 0,
                    count: 0
                };
            }

            groups[exp].accidentsTotal += Number(u.past_accidents || 0);
            groups[exp].violationsTotal += Number(u.speeding_violations || 0);
            groups[exp].count += 1;
        });

        return Object.values(groups).map(g => ({
            driving_experience: g.driving_experience,
            avg_past_accidents: +(g.accidentsTotal / g.count).toFixed(2),
            avg_speeding_violations: +(g.violationsTotal / g.count).toFixed(2)
        }));
    }, [filteredUsers]);


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
                    <span>Approved</span>
                    <h3>{approvedCount}</h3>
                </div>

                <div className="kpi-card danger">
                    <span>Rejected</span>
                    <h3>{rejectedCount}</h3>
                </div>
            </div>

            {/* FILTERS */}
            <div className="kpi-card filter-card">
                <h5>Filters</h5>

                <div className="filter-row-inline">
                    {/* APPROVED */}
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={showApproved}
                            onChange={() => setShowApproved(!showApproved)}
                        />
                        Approved
                    </label>

                    {/* REJECTED */}
                    <label className="filter-checkbox">
                        <input
                            type="checkbox"
                            checked={showRejected}
                            onChange={() => setShowRejected(!showRejected)}
                        />
                        Rejected
                    </label>

                    {/* AGE GROUP */}
                    <select
                        className="filter-select-inline"
                        value={selectedAgeGroup}
                        onChange={e => setSelectedAgeGroup(e.target.value)}
                    >
                        <option value="All">All Age Groups</option>
                        <option value="18-25">18–25</option>
                        <option value="26-35">26–35</option>
                        <option value="36-50">36–50</option>
                        <option value="50+">50+</option>
                    </select>

                    {/* RISK CATEGORY */}
                    <select
                        className="filter-select-inline"
                        value={selectedRiskCategory}
                        onChange={e => setSelectedRiskCategory(e.target.value)}
                    >
                        <option value="All">All Risk Categories</option>
                        <option value="Low Risk">Low Risk</option>
                        <option value="Medium Risk">Medium Risk</option>
                        <option value="High Risk">High Risk</option>
                    </select>
                </div>
            </div>


            {/* CHARTS */}
            <div className="kpi-grid">
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
                    <h5>Status Share (%)</h5>

                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={approvalData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={90}
                                label={renderPercentageLabel}   // ✅ PERCENT LABEL
                            >
                                {approvalData.map((e, i) => (
                                    <Cell
                                        key={i}
                                        fill={COLORS[e.name]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value) => {
                                    if (totalApplications === 0) return "0%";
                                    return `${((value / totalApplications) * 100).toFixed(1)}%`;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>


                <div className="chart-card">
                    <h5>Safe Driving</h5>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={safeDrivingData}
                                dataKey="value"
                                innerRadius={60}
                                outerRadius={90}
                                label
                            >
                                <Cell fill="#000000" />
                                <Cell fill="#eab308" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="chart-card">
                <h5>
                    Average of past_accidents and Average of speeding_violations
                    by driving_experience
                </h5>

                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={drivingExperienceData}
                        barGap={10}
                    >
                        {/* X-AXIS = DRIVING EXPERIENCE */}
                        <XAxis
                            dataKey="driving_experience"
                            type="category"
                        />

                        {/* Y-AXIS = AVERAGE VALUES */}
                        <YAxis type="number" />

                        <Tooltip />

                        {/* AVG PAST ACCIDENTS */}
                        <Bar
                            dataKey="avg_past_accidents"
                            fill="#14b8a6"
                            name="Average of past_accidents"
                        >
                            <LabelList
                                dataKey="avg_past_accidents"
                                position="top"
                            />
                        </Bar>

                        {/* AVG SPEEDING VIOLATIONS */}
                        <Bar
                            dataKey="avg_speeding_violations"
                            fill="#f97316"
                            name="Average of speeding_violations"
                        >
                            <LabelList
                                dataKey="avg_speeding_violations"
                                position="top"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <h5>Count by Credit Score (Bins of 400)</h5>

                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={creditScoreBinData}>
                        <XAxis dataKey="range" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

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
                            <th>Risk Profile</th>
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
