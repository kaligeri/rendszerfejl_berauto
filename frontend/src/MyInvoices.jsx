import React, { useState, useEffect } from "react";
import "./myrentals.css"; // Újrahasznosítjuk a meglévő CSS-t

const API_BASE = "http://localhost:5239/api";

export default function MyInvoices({ token }) {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchInvoices = async () => {
        try {
            const res = await fetch(`${API_BASE}/Invoices/my-invoices`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Nem sikerült betölteni a számlákat.");
            const data = await res.json();
            setInvoices(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchInvoices();
    }, [token]);

    // Számla kifizetése
    const handlePay = async (id) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Invoices/${id}/pay`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Hiba a fizetés során.");
            alert("Sikeres fizetés!");
            fetchInvoices(); // Újratöltjük a listát, hogy frissüljön a státusz
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    // PDF letöltése
    const handleDownload = async (id) => {
        setActionLoading(true);
        try {
            const res = await fetch(`${API_BASE}/Invoices/${id}/download`, {
                method: "GET",
                // Bár AllowAnonymous van a backendemen, jó gyakorlat átadni a tokent
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Hiba a PDF letöltésekor.");

            // A PDF fájlt bináris blob-ként kapjuk meg
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            // Létrehozunk egy láthatatlan linket és rákattintunk a letöltéshez
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Szamla_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Számlák betöltése...</div>;

    return (
        <div className="rentals-root">
            <div className="rentals-container" style={{ maxWidth: "900px" }}>
                <div className="rp-form-header">
                    <h1 className="rp-title">Számláim</h1>
                    <p className="rp-subtitle">Itt találod a bérléseid után kiállított számlákat.</p>
                </div>

                {error && <div className="rp-error">{error}</div>}

                {invoices.length === 0 && !error ? (
                    <p style={{ color: "#8a8880", marginTop: "20px" }}>Jelenleg nincsenek kiállított számláid.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="rentals-table">
                            <thead>
                                <tr>
                                    <th>Számlaszám</th>
                                    <th>Autó</th>
                                    <th>Összeg</th>
                                    <th>Kiállítva</th>
                                    <th>Státusz</th>
                                    <th>Műveletek</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td><strong>#INV-{invoice.id.toString().padStart(4, '0')}</strong></td>
                                        <td>{invoice.rental?.car?.brand || "Ismeretlen autó"}</td>
                                        <td>{invoice.totalAmount} €</td>
                                        <td>{new Date(invoice.issuedAt).toLocaleDateString('hu-HU')}</td>
                                        <td>
                                            {invoice.isPaid ? (
                                                <span className="status-badge status-approved">Kifizetve</span>
                                            ) : (
                                                <span className="status-badge status-rejected">Fizetésre vár</span>
                                            )}
                                        </td>
                                        <td>
                                            {!invoice.isPaid ? (
                                                <button
                                                    className="action-btn btn-handover"
                                                    disabled={actionLoading}
                                                    onClick={() => handlePay(invoice.id)}>
                                                    💳 Fizetés
                                                </button>
                                            ) : (
                                                <button
                                                    className="action-btn btn-approve"
                                                    disabled={actionLoading}
                                                    onClick={() => handleDownload(invoice.id)}>
                                                    📥 PDF Letöltés
                                                </button>
                                            )}
                                        </td>
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