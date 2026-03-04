import React from "react";
import "./cars.css";

import porsche_img from "./assets/carerra_img.avif";
import corolla_img from "./assets/corolla_img.webp";

function Carspage() {
  return (
    <div className="cars-container">
      {/* Card 1 */}
      <div className="car-card">
        <div className="car-image">
          <img src={porsche_img} alt="Porsche 911" />
          <span className="badge">Premium</span>
        </div>
        <div className="car-content">
          <h3 className="car-title">Porsche 911 Carrera</h3>
          <div className="car-specs">
            <div className="spec-item">⛽ Benzin</div>
            <div className="spec-item">⚙️ Automata</div>
            <div className="spec-item">👥 4 Ülés</div>
          </div>
          <div className="car-footer">
            <div className="price">
              <span className="amount">60.000 Ft</span>
              <span className="unit">/ nap</span>
            </div>
            <button className="rent-btn">Bérlés</button>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="car-card">
        <div className="car-image">
          <img src={corolla_img} alt="Toyota Corolla" />
          <span className="badge">Daily</span>
        </div>
        <div className="car-content">
          <h3 className="car-title">Toyota Corolla</h3>
          <div className="car-specs">
            <div className="spec-item">⛽ Hibrid</div>
            <div className="spec-item">⚙️ Automata</div>
            <div className="spec-item">👥 5 Ülés</div>
          </div>
          <div className="car-footer">
            <div className="price">
              <span className="amount">15.000 Ft</span>
              <span className="unit">/ nap</span>
            </div>
            <button className="rent-btn">Bérlés</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carspage;
