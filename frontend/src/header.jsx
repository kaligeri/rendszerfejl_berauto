import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

function Headernav({ token, username, isAdmin, userRole, handleLogout }) {
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
                            <button
                                className={`nav-item ${isActive("/my-rentals") ? "active" : ""}`}
                                onClick={() => navigate("/my-rentals")}
                            >
                                Bérléseim
                            </button>
                            {isAdmin && (
                                <button
                                    className={`nav-item ${isActive("/manage-rentals") ? "active" : ""}`}
                                    onClick={() => navigate("/manage-rentals")}
                                >
                                    Bérlések Kezelése
                                </button>
                            )}
                            {userRole === "User" && (
                                <button
                                    className={`nav-item ${isActive("/my-invoices") ? "active" : ""}`}
                                    onClick={() => navigate("/my-invoices")}
                                >
                                    Számláim
                                </button>
                            )}
                            <span style={{ color: "#8a8880", margin: "0 10px", alignSelf: "center", fontSize: "14px" }}>
                                {userRole === "Admin" && "👑 Admin: "}
                                {userRole === "Agent" && "💼 Ügynök: "}
                                {userRole === "User" && "👤 Felhasználó: "}
                                <strong style={{ color: "black" }}>{username}</strong>
                            </span>
                            <button
                                className={`nav-item ${isActive("/profile") ? "active" : ""}`}
                                onClick={() => navigate("/profile")}> Profilom
                            </button>

                        <button
                            className="nav-item logout-btn"
                            onClick={() => {
                                handleLogout();
                                navigate("/login");
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