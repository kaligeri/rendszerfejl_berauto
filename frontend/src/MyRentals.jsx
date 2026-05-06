import React, { useState, useEffect } from "react";
import "./myrentals.css";

const API_BASE = "http://localhost:5239/api";

export default function MyRentals({ token }) {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await fetch(`${API_BASE}/Rentals/my-rentals`, {
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

        if (token) fetchRentals();
    }, [token]);

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
            <div className="rentals-container">
                <div className="rp-form-header">
                    <h1 className="rp-title">Saját bérléseim</h1>
                    <p className="rp-subtitle">Itt láthatod az eddigi és folyamatban lévő foglalásaidat.</p>
                </div>

                {error && <div className="rp-error">{error}</div>}

                {rentals.length === 0 && !error ? (
                    <p style={{ color: "#8a8880", marginTop: "20px" }}>Jelenleg nincsenek aktív vagy lezárt bérléseid.</p>
                ) : (
                    <div className="table-responsive">
                            <table className="rentals-table">
                                <thead>
                                    <tr>
                                        <th>Autó</th>
                                        <th>Kezdés</th>
                                        <th>Befejezés</th>
                                        <th>Státusz</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentals.map(r => (
                                        <tr key={r.id}>
                                            {/* Ha a backend küldi a Car objektumot, kiírjuk a márkát, különben az ID-t */}
                                            <td><strong>{r.car?.brand || `Autó (ID: ${r.carId})`}</strong></td>
                                            <td>{new Date(r.startDate).toLocaleDateString('hu-HU')}</td>
                                            <td>{new Date(r.endDate).toLocaleDateString('hu-HU')}</td>
                                            <td>{getStatusBadge(r.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    </div>
                )}
            </div>
        </div>
    );
}