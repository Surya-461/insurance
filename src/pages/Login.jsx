import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

/* =========================
   PREDEFINED CREDENTIALS
========================= */

// ✅ Admin
const ADMIN = {
    email: "admin@findrive.com",
    password: "admin123",
    role: "admin"
};

// ✅ Users with IDs
const USERS = [
    { email: "user1@findrive.com", password: "user123", id: 569519 },
    { email: "user2@findrive.com", password: "user123", id: 750365 },
    { email: "user3@findrive.com", password: "user123", id: 199900 },
    { email: "user4@findrive.com", password: "user123", id: 478866 },
    { email: "user5@findrive.com", password: "user123", id: 731663 },
    { email: "user6@findrive.com", password: "user123", id: 877557 },
    { email: "user7@findrive.com", password: "user123", id: 930134 },
    { email: "user8@findrive.com", password: "user123", id: 461006 },
    { email: "user9@findrive.com", password: "user123", id: 68365 }
];

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        /* =========================
           ADMIN LOGIN
        ========================= */
        if (email === ADMIN.email && password === ADMIN.password) {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", "admin");

            navigate("/admin-dashboard");
            return;
        }

        /* =========================
           USER LOGIN
        ========================= */
        const matchedUser = USERS.find(
            (u) => u.email === email && u.password === password
        );

        if (matchedUser) {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", "user");
            localStorage.setItem("userId", matchedUser.id);

            navigate(`/user-dashboard/${matchedUser.id}`);
            return;
        }

        setError("Invalid email or password");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h3 className="login-title">Login</h3>
                <p className="login-subtitle">
                    Access your FinDrive Analytics dashboard
                </p>

                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                    }}
                />

                {error && (
                    <div className="alert alert-danger py-2 text-center">
                        {error}
                    </div>
                )}

                <button className="btn login-btn w-100" onClick={handleLogin}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
