import React, { useState, useEffect } from "react";
import "./cars.css";

const API_BASE = "http://localhost:5239/api";

function Carspage({ token, isAdmin }) {
    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);

    // 1. Fixed the default state so text boxes are empty instead of saying "string"
    const emptyFormState = {
        id: 0,
        brand: "",
        licensePlate: "",
        fuelType: "",
        transmission: "",
        passengerCapacity: 5,
        dailyRate: 0,
        isAvailable: true,
        imageUrl: "",
        description: ""
    };

    const [formData, setFormData] = useState(emptyFormState);

    const fetchCars = async () => {
        try {
            const response = await fetch(`${API_BASE}/cars`);
            if (!response.ok) throw new Error("Failed to fetch cars from the server");
            const data = await response.json();
            setCars(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCars();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt az autót?")) return;

        try {
            const res = await fetch(`${API_BASE}/cars/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Törlés sikertelen. Lehet, hogy nincs jogosultságod.");

            setCars(cars.filter(car => car.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = (car) => {
        setFormData(car);
        setShowForm(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        // 2. Fixed the isEditing check to handle 0 as a new car
        const isEditing = formData.id !== 0 && formData.id !== null;
        const url = isEditing ? `${API_BASE}/cars/${formData.id}` : `${API_BASE}/cars`;
        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Mentés sikertelen!");

            fetchCars();
            setShowForm(false);
            setFormData(emptyFormState); // 3. Reset using the empty state
        } catch (err) {
            alert(err.message);
        }
    };

    if (isLoading) return <div className="loading">Betöltés folyamatban...</div>;
    if (error) return <div className="error">Hiba: {error}</div>;

    return (
        <div style={{ position: "relative" }}>

            {isAdmin && !showForm && (
                <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={() => {
                            setFormData(emptyFormState);
                            setShowForm(true);
                        }}
                        style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                    >
                        + Új autó hozzáadása
                    </button>
                </div>
            )}

            {isAdmin && showForm && (
                <form onSubmit={handleSave} style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ marginTop: 0 }}>{formData.id ? "Autó szerkesztése" : "Új autó hozzáadása"}</h3>

                    <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                        <input className="lp-input" type="text" placeholder="Márka (Pl: Toyota)" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} required />

                        {/* NEW FIELD: License Plate */}
                        <input className="lp-input" type="text" placeholder="Rendszám (Pl: ABC-123)" value={formData.licensePlate} onChange={e => setFormData({ ...formData, licensePlate: e.target.value })} required />

                        <input className="lp-input" type="text" placeholder="Üzemanyag (Pl: Benzin)" value={formData.fuelType} onChange={e => setFormData({ ...formData, fuelType: e.target.value })} required />
                        <input className="lp-input" type="text" placeholder="Váltó (Pl: Automata)" value={formData.transmission} onChange={e => setFormData({ ...formData, transmission: e.target.value })} required />
                        <input className="lp-input" type="number" placeholder="Ülések száma" value={formData.passengerCapacity} onChange={e => setFormData({ ...formData, passengerCapacity: parseInt(e.target.value) || 0 })} required />
                        <input className="lp-input" type="number" placeholder="Napi díj (€)" value={formData.dailyRate} onChange={e => setFormData({ ...formData, dailyRate: parseInt(e.target.value) || 0 })} required />
                        <input className="lp-input" type="text" placeholder="Kép URL (https://...)" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />

                        {/* NEW FIELD: Description */}
                        <input className="lp-input" type="text" placeholder="Rövid leírás az autóról..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>

                    {/* NEW FIELD: Is Available Checkbox */}
                    <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                            type="checkbox"
                            id="isAvailable"
                            checked={formData.isAvailable}
                            onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                            style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        />
                        <label htmlFor="isAvailable" style={{ cursor: "pointer", fontWeight: "bold" }}>
                            Jelenleg elérhető bérlésre
                        </label>
                    </div>

                    <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <button type="submit" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Mentés</button>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", background: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Mégse</button>
                    </div>
                </form>
            )}

            <div className="cars-container">
                {cars.map((car) => (
                    <div className="car-card" key={car.id}>
                        <div className="car-image">
                            <img src={car.imageUrl} alt={car.brand} />
                            <span className="badge">
                                {car.dailyRate >= 80 ? "Premium" : "Daily"}
                            </span>
                        </div>

                        <div className="car-content">
                            <h3 className="car-title">
                                {car.brand}
                                {/* Show a visual indicator if the car is NOT available */}
                                {!car.isAvailable && <span style={{ color: "red", fontSize: "14px", marginLeft: "10px" }}>(Nem elérhető)</span>}
                            </h3>

                            <div className="car-specs">
                                <div className="spec-item">⛽ {car.fuelType}</div>
                                <div className="spec-item">⚙️ {car.transmission}</div>
                                <div className="spec-item">👥 {car.passengerCapacity} Ülés</div>
                                <div className="spec-item" style={{ fontWeight: "bold", border: "1px dashed #ccc" }}>🏷️ {car.licensePlate}</div>
                            </div>

                            {/* Show the description if it exists */}
                            {car.description && (
                                <p style={{ fontSize: "13px", color: "#666", marginTop: "10px", marginBottom: "5px" }}>
                                    {car.description}
                                </p>
                            )}

                            <div className="car-footer">
                                <div className="price">
                                    <span className="amount">{car.dailyRate} €</span>
                                    <span className="unit">/ nap</span>
                                </div>
                                <button className="rent-btn" disabled={!car.isAvailable} style={{ opacity: car.isAvailable ? 1 : 0.5 }}>
                                    {car.isAvailable ? "Bérlés" : "Foglalt"}
                                </button>
                            </div>

                            {isAdmin && (
                                <div style={{ display: "flex", gap: "10px", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                                    <button
                                        onClick={() => handleEditClick(car)}
                                        style={{ flex: 1, padding: "8px", background: "#ffc107", color: "#000", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                                    >
                                        Szerkesztés
                                    </button>
                                    <button
                                        onClick={() => handleDelete(car.id)}
                                        style={{ flex: 1, padding: "8px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
                                    >
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