import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ KEY FIX

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    const userEmail = localStorage.getItem("email");
    const role = localStorage.getItem("role"); // user | admin

    /* 🔄 SYNC AUTH (same tab + other tabs) */
    useEffect(() => {
        const syncAuth = () => {
            setIsLoggedIn(localStorage.getItem("auth") === "true");
        };

        syncAuth(); // ✅ run immediately on route change
        window.addEventListener("storage", syncAuth);

        return () => window.removeEventListener("storage", syncAuth);
    }, [location.pathname]); // 🔥 triggers after login redirect

    /* 🚪 Logout */
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setShowProfile(false);
        navigate("/login");
    };

    /* 📌 Dashboard path by role */
    const dashboardPath =
        role === "admin" ? "/admin-dashboard" : "/user-dashboard";

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="navbar navbar-expand-lg fixed-top fin-navbar shadow-lg px-4 py-3">
                <div className="container-fluid">

                    {/* BRAND */}
                    <NavLink
                        to="/"
                        className="navbar-brand d-flex align-items-center gap-2"
                    >
                        <img
                            src={logo}
                            alt="FinDrive Analytics Logo"
                            className="navbar-logo"
                            height={90}
                        />
                        <span className="text-info fs-4 fw-bold">
                            FinDrive Analytics
                        </span>
                    </NavLink>

                    {/* MOBILE TOGGLER */}
                    <button
                        className="navbar-toggler text-light border-0"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileMenu"
                    >
                        ☰
                    </button>

                    {/* DESKTOP MENU */}
                    <div className="collapse navbar-collapse d-none d-lg-flex">

                        {/* CENTER LINKS */}
                        <ul className="navbar-nav mx-auto gap-lg-4">

                            {[
                                { path: "/", label: "Home" },
                                { path: "/about", label: "About" },
                                { path: "/contact", label: "Contact" },
                            ].map((item) => (
                                <li className="nav-item" key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        end
                                        className={({ isActive }) =>
                                            `nav-link nav-underline ${isActive ? "active" : ""}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}

                            {/* DASHBOARD */}
                            {isLoggedIn && (
                                <li className="nav-item">
                                    <NavLink
                                        to={dashboardPath}
                                        className={({ isActive }) =>
                                            `nav-link nav-underline fw-semibold ${isActive ? "active" : ""}`
                                        }
                                    >
                                        {role === "admin"
                                            ? "Admin Dashboard"
                                            : "User Dashboard"}
                                    </NavLink>
                                </li>
                            )}
                        </ul>

                        {/* RIGHT ACTIONS */}
                        <div className="d-flex align-items-center gap-3">

                            {/* 🔐 NOT LOGGED IN */}
                            {!isLoggedIn ? (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="btn btn-outline-light px-4"
                                    >
                                        Login
                                    </NavLink>

                                    <NavLink
                                        to="/signup"
                                        className="btn btn-info text-dark fw-semibold px-4"
                                    >
                                        Get Started
                                    </NavLink>
                                </>
                            ) : (
                                /* 👤 LOGGED IN */
                                <div className="position-relative">
                                    <FaUserCircle
                                        className="user-icon"
                                        onClick={() =>
                                            setShowProfile(!showProfile)
                                        }
                                    />

                                    {showProfile && (
                                        <div className="profile-dropdown">
                                            <p className="email">
                                                {userEmail || "Logged in user"}
                                            </p>

                                            <p className="role-tag">
                                                Role: {role}
                                            </p>

                                            <button
                                                className="btn btn-sm btn-outline-danger w-100"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* ================= MOBILE OFFCANVAS ================= */}
            <div
                className="offcanvas offcanvas-start text-bg-dark"
                id="mobileMenu"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title text-info fw-bold">
                        FinDrive Analytics
                    </h5>
                    <button
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <ul className="navbar-nav gap-3 text-center">

                        {["/", "/about", "/contact"].map((path, i) => (
                            <li key={i}>
                                <NavLink
                                    className="nav-link"
                                    to={path}
                                    data-bs-dismiss="offcanvas"
                                >
                                    {path === "/" ? "Home" : path.slice(1)}
                                </NavLink>
                            </li>
                        ))}

                        {isLoggedIn && (
                            <li>
                                <NavLink
                                    className="nav-link fw-semibold"
                                    to={dashboardPath}
                                    data-bs-dismiss="offcanvas"
                                >
                                    {role === "admin"
                                        ? "Admin Dashboard"
                                        : "Dashboard"}
                                </NavLink>
                            </li>
                        )}

                        <hr />

                        {!isLoggedIn ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className="btn btn-outline-light w-100"
                                    data-bs-dismiss="offcanvas"
                                >
                                    Login
                                </NavLink>

                                <NavLink
                                    to="/signup"
                                    className="btn btn-info text-dark fw-semibold w-100 mt-2"
                                    data-bs-dismiss="offcanvas"
                                >
                                    Get Started
                                </NavLink>
                            </>
                        ) : (
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleLogout}
                                data-bs-dismiss="offcanvas"
                            >
                                Logout
                            </button>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;