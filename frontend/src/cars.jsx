import React, { useState, useEffect } from "react";
import "./cars.css";

const API_BASE = "http://localhost:5239/api"; 

function Carspage({ token, isAdmin, userId }) {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [rentingCar, setRentingCar] = useState(null);
    const [rentalForm, setRentalForm] = useState({
        startDate: "", endDate: "", guestName: "", guestContact: ""
    });

    const [showForm, setShowForm] = useState(false);
    const emptyAdminForm = { id: 0, brand: "", licensePlate: "", fuelType: "", transmission: "", passengerCapacity: 5, dailyRate: 0, isAvailable: true, imageUrl: "", description: "" };
    const [formData, setFormData] = useState(emptyAdminForm);

    const fetchCars = async () => {
        try {
            const response = await fetch(`${API_BASE}/cars`);
            const data = await response.json();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCars(); }, []);

    const handleRentalSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            carId: rentingCar.id,
            userId: userId || null,
            guestName: token ? null : rentalForm.guestName,
            guestContact: token ? null : rentalForm.guestContact,
            startDate: rentalForm.startDate,
            endDate: rentalForm.endDate
        };

        try {
            const res = await fetch(`${API_BASE}/Rentals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(await res.text() || "Sikertelen foglalás.");
            alert("Sikeres foglalás!");
            setRentingCar(null);
            setRentalForm({ startDate: "", endDate: "", guestName: "", guestContact: "" });
            fetchCars(); // Frissítjük a listát, hogy az autó átmenjen "Foglalt" státuszba
        } catch (err) { alert(err.message); }
    };

    // --- ÚJ TÖRLÉS LOGIKA (VÉDELEMMEL) ---
    const handleDeleteCar = async (car) => {
        if (car.isAvailable === false || car.isAvailable === 0) {
            alert(`❌ Nem törölheted a(z) ${car.brand} modellt, mert jelenleg aktív vagy elfogadott bérlés alatt áll!`);
            return;
        }

        if (!window.confirm(`Biztosan véglegesen törölni szeretnéd a(z) ${car.brand} modellt a rendszerből?`)) return;

        try {
            const res = await fetch(`${API_BASE}/cars/${car.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("❌ A backend elutasította a törlést. Valószínűleg már tartozik hozzá egy rögzített bérlés a múltban.");

            alert("✅ Az autó sikeresen törölve!");
            setCars(cars.filter(c => c.id !== car.id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAdminSave = async (e) => {
        e.preventDefault();
        const isEditing = formData.id !== 0;
        const method = isEditing ? "PUT" : "POST";
        const url = isEditing ? `${API_BASE}/cars/${formData.id}` : `${API_BASE}/cars`;

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Sikertelen mentés.");
            fetchCars();
            setShowForm(false);
            setFormData(emptyAdminForm);
        } catch (err) { alert(err.message); }
    };

    if (isLoading) return <div style={{ textAlign: "center", padding: "50px", fontFamily: "Inter" }}>Betöltés...</div>;

    return (
        <div style={{ position: "relative", padding: "20px" }}>

            {/* --- BÉRLÉS MODAL --- */}
            {rentingCar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Bérlés: {rentingCar.brand}</h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: "20px" }}>Kérjük, adja meg a bérlés időtartamát.</p>

                        <form onSubmit={handleRentalSubmit}>
                            <div className="form-row">
                                <label>Mettől:</label>
                                <input type="date" required min={new Date().toISOString().split("T")[0]} value={rentalForm.startDate} onChange={e => setRentalForm({ ...rentalForm, startDate: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <label>Meddig:</label>
                                <input type="date" required min={rentalForm.startDate} value={rentalForm.endDate} onChange={e => setRentalForm({ ...rentalForm, endDate: e.target.value })} />
                            </div>

                            {!token && (
                                <>
                                    <div className="form-row">
                                        <label>Az Ön neve</label>
                                        <input type="text" placeholder="Teljes név" required value={rentalForm.guestName} onChange={e => setRentalForm({ ...rentalForm, guestName: e.target.value })} />
                                    </div>
                                    <div className="form-row">
                                        <label>Email / Telefonszám</label>
                                        <input type="text" placeholder="Elérhetőség" required value={rentalForm.guestContact} onChange={e => setRentalForm({ ...rentalForm, guestContact: e.target.value })} />
                                    </div>
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setRentingCar(null)}>Mégse</button>
                                <button type="submit" className="btn-confirm">Foglalás véglegesítése</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ÚJ AUTÓ GOMB (Admin) --- */}
            {isAdmin && !showForm && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className="add-car-btn" onClick={() => { setFormData(emptyAdminForm); setShowForm(true); }}>
                        + Új autó hozzáadása
                    </button>
                </div>
            )}

            {/* --- ADMIN SZERKESZTÉS/HOZZÁADÁS MODAL --- */}
            {isAdmin && showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{formData.id ? "Autó szerkesztése" : "Új autó hozzáadása"}</h2>
                        <form onSubmit={handleAdminSave}>
                            <div className="form-row">
                                <label>Márka és Típus</label>
                                <input type="text" placeholder="Pl.: Tesla Model 3" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <label>Rendszám</label>
                                <input type="text" placeholder="AAA-123" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <label>Napi díj (€)</label>
                                <input type="number" placeholder="0" value={formData.dailyRate} onChange={e => setFormData({ ...formData, dailyRate: parseInt(e.target.value) })} required />
                            </div>
                            <div className="form-row">
                                <label>Kép URL linkje</label>
                                <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Mégse</button>
                                <button type="submit" className="btn-confirm">Mentés</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- KÁRTYÁK LISTÁJA --- */}
            <div className="cars-container">
                {cars.map((car) => (
                    <div className="car-card" key={car.id}>
                        <div className="car-image">
                            {car.imageUrl ? (
                                <img src={car.imageUrl} alt={car.brand} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Nincs kép</div>
                            )}
                            {/* Opcionális "Foglalt" badge a képre */}
                            {!car.isAvailable && <span className="badge" style={{ color: '#c0392b' }}>FOGLALT</span>}
                        </div>

                        <div className="car-content">
                            <h3 className="car-title">{car.brand}</h3>

                            <div className="car-specs">
                                <span className="spec-item">{car.transmission || "Automata"}</span>
                                <span className="spec-item">{car.fuelType || "Benzin"}</span>
                                <span className="spec-item">{car.passengerCapacity || 5} fő</span>
                            </div>

                            <div className="car-footer">
                                <div>
                                    <span className="amount">{car.dailyRate} €</span>
                                    <span className="unit">/ nap</span>
                                </div>
                                <button className="rent-btn" disabled={!car.isAvailable} onClick={() => setRentingCar(car)}>
                                    {car.isAvailable ? "Bérlés" : "Nem elérhető"}
                                </button>
                            </div>

                            {/* --- ADMIN GOMBOK (Szerkesztés/Törlés) --- */}
                            {isAdmin && (
                                <div className="card-admin-actions">
                                    <button className="btn-card-edit" onClick={() => { setFormData(car); setShowForm(true); }}>
                                        Szerkesztés
                                    </button>
                                    <button className="btn-card-delete" onClick={() => handleDeleteCar(car)}>
                                        Törlés
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Carspage;