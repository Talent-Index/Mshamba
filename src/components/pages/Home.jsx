// src/pages/LandingPage.jsx
import React from "react";
import "../components/styles/home.css";
import farm from "../../assets/teken.jpeg";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="homebox">
      {/* Left side - text */}
      <div className="left">
        <div className="ID">
          <h1>
          Welcome to <span>Mshamba</span>
        </h1>
        </div>
        
        <p className="tagline">
        🌱We bring together communities, technology, and opportunities to grow
          agriculture for a better tomorrow.
        </p>
        <div className="CTAs">
        <button className="cta-btn">
          <Link to="/farm-register">
          Create Farm 👨‍🌾
          </Link>
          </button>
        <button>
          <Link to="/invest">Invest🪙
          </Link>
          </button>
        </div>
      </div>

      {/* Right side - image */}
      <div className="right">
        <img src={farm} alt="Farm" />
      </div>
    </div>
  );
};

export default Home;
