import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

function Headernav() {
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
      </div>
    </nav>
  );
}

export default Headernav;
