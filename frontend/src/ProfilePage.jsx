import React, { useState, useEffect } from "react";
import "./profile.css"; // Itt importáljuk be a külön lévő designt!

const API_BASE = "http://localhost:5239/api";

export default function ProfilePage({ token }) {
    const [form, setForm] = useState({
        username: "",
        email: "",
        address: "",
        phoneNumber: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/Users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Nem sikerült betölteni a profil adatokat.");
                const data = await res.json();

                setForm((prev) => ({
                    ...prev,
                    username: data.username || "",
                    email: data.email || "",
                    address: data.address || "",
                    phoneNumber: data.phoneNumber || "",
                }));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfile();
    }, [token]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword && form.newPassword !== form.confirmPassword) {
            setError("A megadott jelszavak nem egyeznek.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                username: form.username,
                email: form.email,
                address: form.address,
                phoneNumber: form.phoneNumber,
            };

            if (form.newPassword) {
                payload.newPassword = form.newPassword;
            }

            const res = await fetch(`${API_BASE}/Users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || "Sikertelen mentés. Ellenőrizd az adatokat!");
            }

            setSuccess("A profilod adatai sikeresen frissültek!");
            setForm((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Adatok betöltése...</div>;

    return (
        <div className="profile-root">
            <div className="profile-form-wrap">
                <div className="rp-form-header">
                    <h1 className="rp-title">Profilom</h1>
                    <p className="rp-subtitle">Itt tudod módosítani a személyes adataidat</p>
                </div>

                <form className="rp-form" onSubmit={handleSubmit} noValidate>
                    <div className="rp-row">
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="username">Felhasználónév</label>
                            <div className="rp-input-wrap">
                                <input id="username" className="rp-input" type="text"
                                    value={form.username} onChange={set("username")} required />
                            </div>
                        </div>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="email">Email</label>
                            <div className="rp-input-wrap">
                                <input id="email" className="rp-input" type="email"
                                    value={form.email} onChange={set("email")} required />
                            </div>
                        </div>
                    </div>

                    <div className="rp-row">
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="phone">Telefonszám</label>
                            <div className="rp-input-wrap">
                                <input id="phone" className="rp-input" type="tel"
                                    placeholder="+36 20 123 4567" value={form.phoneNumber} onChange={set("phoneNumber")} />
                            </div>
                        </div>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="address">Cím</label>
                            <div className="rp-input-wrap">
                                <input id="address" className="rp-input" type="text"
                                    placeholder="1234 Budapest, Fő utca 1." value={form.address} onChange={set("address")} />
                            </div>
                        </div>
                    </div>

                    <div className="rp-form-header" style={{ marginTop: "20px", marginBottom: "15px" }}>
                        <p className="rp-subtitle" style={{ color: "#141412", fontWeight: "500" }}>Jelszó módosítása (opcionális)</p>
                    </div>

                    <div className="rp-row">
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="new-password">Új jelszó</label>
                            <div className="rp-input-wrap">
                                <input id="new-password" className="rp-input" type="password"
                                    placeholder="Min. 6 karakter" value={form.newPassword} onChange={set("newPassword")} />
                            </div>
                        </div>
                        <div className="rp-field">
                            <label className="rp-label" htmlFor="confirm-password">Új jelszó újra</label>
                            <div className="rp-input-wrap">
                                <input id="confirm-password" className="rp-input" type="password"
                                    placeholder="Jelszó ismétlése" value={form.confirmPassword} onChange={set("confirmPassword")} />
                            </div>
                        </div>
                    </div>

                    {error && <div className="rp-error" role="alert">{error}</div>}
                    {success && <div className="rp-error rp-success" role="alert">{success}</div>}

                    <button className="rp-submit" type="submit" disabled={saving} style={{ marginTop: "15px" }}>
                        {saving ? <span className="rp-spinner" /> : "Változtatások mentése"}
                    </button>
                </form>
            </div>
        </div>
    );
}