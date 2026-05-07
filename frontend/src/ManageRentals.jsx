import React, { useState, useEffect } from "react";
import "./myrentals.css";

const API_BASE = "http://localhost:5239/api";

export default function ManageRentals({ token }) {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false); // Gombok letiltása kérés közben
    const [error, setError] = useState("");

    const fetchAllRentals = async () => {
        try {
            const res = await fetch(`${API_BASE}/Rentals/manage`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Nem sikerült betölteni a bérléseket.");
            const data = await res.json();
            setRentals(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchAllRentals();
    }, [token]);

    // Bérlés elfogadása vagy elutasítása
    const handleDecide = async (id, approve) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Rentals/manage/${id}/decide?approve=${approve}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Hiba a döntés során.");
            fetchAllRentals(); 
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Autó átadása
    const handleHandover = async (id) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Rentals/manage/${id}/handover`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Hiba az átadás rögzítésekor.");
            fetchAllRentals();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Autó visszavétele
    const handleReturn = async (id) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Rentals/manage/${id}/return`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Hiba a visszavétel rögzítésekor.");
            fetchAllRentals();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // Számla kiállítása
    const handleCreateInvoice = async (rentalId) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Invoices/create/${rentalId}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Hiba a számla kiállításakor.");
            }
            alert("A számla sikeresen kiállítva!");
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="status-badge status-pending">Függőben</span>;
            case 1: return <span className="status-badge status-approved">Elfogadva</span>;
            case 2: return <span className="status-badge status-active">Folyamatban</span>; //Active
            case 3: return <span className="status-badge status-completed">Befejezve</span>; //Completed
            case 4: return <span className="status-badge status-rejected">Elutasítva</span>; //Rejected
            default: return <span className="status-badge">Ismeretlen</span>;
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Bérlések betöltése...</div>;

    return (
        <div className="rentals-root">
            <div className="rentals-container" style={{ maxWidth: "1400px" }}>
                <div className="rp-form-header">
                    <h1 className="rp-title">Bérlések Menedzselése</h1>
                    <p className="rp-subtitle">Ügynök felület a bérlések és számlák kezeléséhez.</p>
                </div>

                {error && <div className="rp-error">{error}</div>}

                <div className="table-responsive">
                    <table className="rentals-table">
                        <thead>
                            <tr>
                                <th>Azonosító</th>
                                <th>Szerepkör</th>
                                <th>Bérlő</th>
                                <th>Autó</th>
                                <th>Kezdés</th>
                                <th>Befejezés</th>
                                <th>Státusz</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(r => (
                                <tr key={r.id}>
                                    <td><strong>#R-{r.id}</strong></td>
                                    {/* Ha van GuestName, akkor Vendég, ha nincs, akkor Regisztrált user */}
                                    <td>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            backgroundColor: r.guestName ? "#f0efe9" : "#e6f2ff",
                                            color: r.guestName ? "#8a8880" : "#0984e3"
                                        }}>
                                            {r.guestName ? "Vendég" : "Regisztrált"}
                                        </span>
                                    </td>
                                    <td>
                                        {r.guestName ? (
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div>
                                                    <strong>{r.guestName}</strong> <span style={{ fontSize: "12px", color: "#8a8880" }}></span>
                                                </div>
                                                {r.guestContact && (
                                                    <span style={{ fontSize: "12px", color: "#6b6a67" }}>{r.guestContact}</span>
                                                )}
                                            </div>
                                        ) : r.user ? (
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <strong style={{ color: "#141412" }}>{r.user.username}</strong>
                                                {r.user.email && (
                                                    <span style={{ fontSize: "12px", color: "#6b6a67" }}>{r.user.email}</span>
                                                )}
                                            </div>
                                        ) : (
                                            `Regisztrált fiók (ID: ${r.userId})`
                                        )}
                                    </td>
                                    <td>{r.car?.brand || `Autó ID: ${r.carId}`}</td>
                                    <td>{new Date(r.startDate).toLocaleDateString('hu-HU')}</td>
                                    <td>{new Date(r.endDate).toLocaleDateString('hu-HU')}</td>
                                    <td>{getStatusBadge(r.status)}</td>
                                    <td>
                                        {/* A megfelelő gombok megjelenítése a státusz alapján */}
                                        {r.status === 0 && ( // Pending (0)
                                            <>
                                                <button className="action-btn btn-approve" disabled={actionLoading} onClick={() => handleDecide(r.id, true)}>Elfogad</button>
                                                <button className="action-btn btn-reject" disabled={actionLoading} onClick={() => handleDecide(r.id, false)}>Elutasít</button>
                                            </>
                                        )}
                                        {r.status === 1 && ( // Approved (1)
                                            <button className="action-btn btn-handover" disabled={actionLoading} onClick={() => handleHandover(r.id)}>Átadás</button>
                                        )}
                                        {r.status === 2 && ( // Active (2)
                                            <button className="action-btn btn-return" disabled={actionLoading} onClick={() => handleReturn(r.id)}>Visszavétel</button>
                                        )}
                                        {r.status === 3 && ( // Completed (3)
                                            <button className="action-btn btn-invoice" disabled={actionLoading} onClick={() => handleCreateInvoice(r.id)}>Számla kiállítása</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}