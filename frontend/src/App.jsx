import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Headernav from "./header";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Carspage from "./Cars";
import ProfilePage from "./ProfilePage";
import MyRentals from "./MyRentals";
import ManageRentals from "./ManageRentals";
import MyInvoices from "./MyInvoices";

function AppContent() {
    const navigate = useNavigate();

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || "");
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState("User");

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

                const isAdminOrAgent = roleClaim === "Admin" || roleClaim === "2" || roleClaim === 2 || roleClaim === "Agent" || roleClaim === "1" || roleClaim === 1;
                setIsAdmin(isAdminOrAgent);
                let currentRole = "User";
                if (roleClaim === "Admin" || roleClaim === "2" || roleClaim === 2) currentRole = "Admin";
                else if (roleClaim === "Agent" || roleClaim === "1" || roleClaim === 1) currentRole = "Agent";
                setUserRole(currentRole);
            } catch (err) {
                console.error("Hiba a token dekódolásakor:", err);
                handleLogout();
            }
        } else {
            setIsAdmin(false);
            setUserId(null);
            setUserRole("User");
        }
    }, [token]);

    return (
        <div className="app-layout">
            <Headernav
                token={token}
                username={username}
                isAdmin={isAdmin}
                userRole={userRole} 
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
                    {token && <Route path="/profile" element={<ProfilePage token={token} />} />}
                    {token && <Route path="/my-rentals" element={<MyRentals token={token} />} />}
                    {isAdmin && <Route path="/manage-rentals" element={<ManageRentals token={token} />} />}
                    {token && <Route path="/my-invoices" element={<MyInvoices token={token} />} />}
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