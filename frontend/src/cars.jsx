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
        } catch (err) { setError(err.message); } finally { setIsLoading(false); }
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
        } catch (err) { alert(err.message); }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd?")) return;
        try {
            await fetch(`${API_BASE}/cars/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            setCars(cars.filter(c => c.id !== id));
        } catch (err) { alert("Hiba a törlés során."); }
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

    if (isLoading) return <div className="loading">Betöltés...</div>;

    return (
        <div style={{ position: "relative", padding: "20px" }}>
            {rentingCar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Bérlés: {rentingCar.brand}</h3>
                        <p style={{ fontSize: '14px', color: '#666' }}>Kérjük, adja meg a bérlés időtartamát.</p>

                        <form onSubmit={handleRentalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Mettől:</label>
                                <input type="date" required min={new Date().toISOString().split("T")[0]} value={rentalForm.startDate} onChange={e => setRentalForm({ ...rentalForm, startDate: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Meddig:</label>
                                <input type="date" required min={rentalForm.startDate} value={rentalForm.endDate} onChange={e => setRentalForm({ ...rentalForm, endDate: e.target.value })} style={{ width: '100%', padding: '8px' }} />
                            </div>

                            {!token && (
                                <>
                                    <input type="text" placeholder="Az Ön neve" required value={rentalForm.guestName} onChange={e => setRentalForm({ ...rentalForm, guestName: e.target.value })} style={{ padding: '8px' }} />
                                    <input type="text" placeholder="Email / Telefonszám" required value={rentalForm.guestContact} onChange={e => setRentalForm({ ...rentalForm, guestContact: e.target.value })} style={{ padding: '8px' }} />
                                </>
                            )}

                            <div className="modal-actions">
                                <button type="submit" className="btn-confirm">Foglalás véglegesítése</button>
                                <button type="button" className="btn-cancel" onClick={() => setRentingCar(null)}>Mégse</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isAdmin && !showForm && (
                <button className="admin-add-btn" onClick={() => { setFormData(emptyAdminForm); setShowForm(true); }}>
                    + Új autó hozzáadása
                </button>
            )}

            {isAdmin && showForm && (
                <form className="admin-form" onSubmit={handleAdminSave}>
                    <h3>{formData.id ? "Autó szerkesztése" : "Új autó hozzáadása"}</h3>
                    <div className="admin-inputs">
                        <input type="text" placeholder="Márka" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />
                        <input type="text" placeholder="Rendszám" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} required />
                        <input type="number" placeholder="Napi díj (€)" value={formData.dailyRate} onChange={e => setFormData({ ...formData, dailyRate: parseInt(e.target.value) })} required />
                        <input type="text" placeholder="Kép URL" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                    </div>
                    <div className="admin-actions">
                        <button type="submit" className="btn-save">Mentés</button>
                        <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Mégse</button>
                    </div>
                </form>
            )}
            <div className="cars-container">
                {cars.map((car) => (
                    <div className="car-card" key={car.id}>
                        <div className="car-image">
                            <img src={car.imageUrl} alt={car.brand} />
                        </div>
                        <div className="car-content">
                            <h3>{car.brand} {!car.isAvailable && <span className="taken-label">(Foglalt)</span>}</h3>
                            <div className="price"><strong>{car.dailyRate} €</strong> / nap</div>

                            <div className="btn-group">
                                <button className="rent-btn" disabled={!car.isAvailable} onClick={() => setRentingCar(car)}>
                                    {car.isAvailable ? "Bérlés" : "Nem elérhető"}
                                </button>

                                {isAdmin && (
                                    <div className="admin-card-actions">
                                        <button className="edit-btn" onClick={() => { setFormData(car); setShowForm(true); }}>✏️</button>
                                        <button className="del-btn" onClick={() => handleDelete(car.id)}>🗑️</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carspage;