import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        const storedUser = JSON.parse(localStorage.getItem("userData"));

        if (!storedUser) {
            setError("No account found. Please sign up first.");
            return;
        }

        if (email === storedUser.email && password === storedUser.password) {
            localStorage.setItem("auth", "true");
            localStorage.setItem("role", storedUser.role);

            // ✅ CORRECT ROUTES
            navigate(
                storedUser.role === "admin"
                    ? "/admin-dashboard"
                    : "/user-dashboard"
            );
        } else {
            setError("Invalid email or password");
        }
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

                <p className="login-footer">
                    Don’t have an account?{" "}
                    <span onClick={() => navigate("/signup")}>
                        Sign Up
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Login;
