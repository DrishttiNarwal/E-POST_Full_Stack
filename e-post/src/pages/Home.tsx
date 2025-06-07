import { useState } from 'react';
// import { Link } from 'react-router-dom';
import React from 'react';
import "../styles/Home.css"
import { Navbar } from '../components/home/Navbar';

export default function Home() {
  
  const [trackingId, setTrackingId] = useState<string>("");


  const handleTrack = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/parcels/track/${trackingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      console.log("Tracking Data:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error fetching tracking info:", error);
      alert("Something went wrong while tracking the parcel.");
    }
  };

  return (
    <div className="main-content">
      {/* Navbar */}
      <Navbar />

    <div className="content-area">
        <h1>Welcome to E-POST</h1>
        {/* Hero */}
        <div className="hero">
          <div className="overlay">
            <h2>Modernizing Postal Tracking with QR Codes</h2>
            <p>Your modern solution for efficient postal tracking and delivery.</p>
          </div>
        </div>

        {/* Tracking Form */}
        <section className="tracking-section">
          <h3>Track Your Parcel</h3>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />
            <button onClick={handleTrack}>Track</button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h3>Why Choose E-POST?</h3>
          <div className="features">
            <div>
              <h4>📦 QR Code Tracking</h4>
              <p>Track parcels in real-time with unique QR codes.</p>
            </div>
            <div>
              <h4>⚡ Automated Sorting</h4>
              <p>AI-powered sorting ensures faster deliveries.</p>
            </div>
            <div>
              <h4>📍 Real-Time Updates</h4>
              <p>Stay informed with instant location updates.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© 2025 E-POST. All rights reserved.</p>
        </footer>
      </div>
    </div>
  
  );
}
