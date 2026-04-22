import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

function Headernav({ token, username, isAdmin, handleLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar-pill">
            <div
                className="brand"
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
            >
                Berauto
            </div>
            <div className="nav-links">
                <button
                    className={`nav-item ${isActive("/") ? "active" : ""}`}
                    onClick={() => navigate("/")}
                >
                    Home
                </button>
                <button
                    className={`nav-item ${isActive("/autos") ? "active" : ""}`}
                    onClick={() => navigate("/autos")}
                >
                    Autok
                </button>
                <button
                    className={`nav-item ${isActive("/gyik") ? "active" : ""}`}
                    onClick={() => navigate("/gyik")}
                >
                    GYIK
                </button>

                {!token ? (
                    <>
                        <button
                            className={`nav-item ${isActive("/login") ? "active" : ""}`}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className={`nav-item ${isActive("/register") ? "active" : ""}`}
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        <span style={{ color: "#8a8880", margin: "0 10px", alignSelf: "center", fontSize: "14px" }}>
                            {isAdmin ? "👑 Admin:" : "👤 Felhasználó:"} <strong style={{ color: "black" }}>{username}</strong>
                        </span>
                        <button
                            className="nav-item logout-btn"
                            onClick={() => {
                                handleLogout();
                                navigate("/login"); // Send them to login page after logging out
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Headernav;