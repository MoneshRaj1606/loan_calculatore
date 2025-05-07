import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";
import './Header.css';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <header className="navbar">
        <div className="logo">Loan Calculator</div>
        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>HOME</Link>
          <Link to="/exchange" className={location.pathname === "/exchange" ? "active" : ""}>EXCHANGE RATES (LIVE)</Link>
          <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>ABOUT</Link>
          <Link to="/error" className={location.pathname === "/error" ? "active" : ""}>ERROR PAGE</Link>
        </nav>
        <label className="switch">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={() => setIsDarkMode(!isDarkMode)}
          />
          <span className="slider"></span>
        </label>
      </header>
      <Outlet />
    </>
  );
};

export default Header;