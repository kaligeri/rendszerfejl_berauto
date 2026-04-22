import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Headernav from "./header";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Carspage from "./Cars";

function AppContent() {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null)

    const handleLogout = () => {
        setToken(null);
        setUsername("");
        setIsAdmin(false);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    };

    const handleLogin = (newToken, loggedInUser) => {
        setToken(newToken);
        setUsername(loggedInUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", loggedInUser);
        navigate("/autos");
    };

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decodedToken.nameid || decodedToken.sub;
                setUserId(id);
                const roleClaim =
                    decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
                    decodedToken.role ||
                    decodedToken.Role;

                setIsAdmin(roleClaim === "Admin" || roleClaim === 2 || roleClaim === "2");
            } catch (err) {
                console.error("Hiba a token dekódolásakor:", err);
                handleLogout();
            }
        } else {
            setIsAdmin(false);
            setUserId(null);
        }
    }, [token]);

    return (
        <div className="app-layout">
            <Headernav
                token={token}
                username={username}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
            />

            <main style={{ padding: "30px" }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/autos" />} />

                    <Route path="/autos" element={<Carspage token={token} isAdmin={isAdmin} userId={userId} />} />

                    <Route path="/gyik" element={<div>Ide jön a GYIK oldal...</div>} />

                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                    <Route path="/register" element={
                        <RegisterPage
                            onSuccess={() => navigate("/login")}
                            onLoginClick={() => navigate("/login")}
                        />
                    } />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;