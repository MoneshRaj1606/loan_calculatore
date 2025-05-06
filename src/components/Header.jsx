import React from 'react';
import { Link, Outlet } from "react-router-dom";
import './Header.css';

const Header = () => {
  return (
    <>
    <header className="navbar">
      <div className="logo">Loan Calculator</div>
      <nav className="nav-links">
        <Link to="/">HOME</Link>
        <Link to="/exchange">EXCHANGE RATES (LIVE)</Link>
        <Link to="/about">ABOUT</Link>
        <Link to="/error">ERROR PAGE</Link>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </nav>
  

    </header>
        <Outlet/>
        </>

  );
};

export default Header;