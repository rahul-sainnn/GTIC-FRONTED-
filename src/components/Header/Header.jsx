import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "/logo.png";
import { Icon } from '@iconify/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <>
      <div className="garb">.</div>
      <header className="head-container">
        <div className="head-content">
          <img src={logo} alt="" className="logo" />
          <div className={`head-section ${isMenuOpen ? "open" : ""}`}>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active-header links" : "links"
              }
              to="/speakers"
            >
            Speakers List
            </NavLink>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active-header links" : "links"
              }
              to="/add-speakers"
              >
              Add Speakers
            </NavLink>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active-header links" : "links"
              }
              to="/add-schedule"
            >
              Add Schedule
            </NavLink>
            <NavLink
              className={(navData) =>
                navData.isActive ? "active-header links" : "links"
              }
              to="/schedule"
            >
              Schedule List
            </NavLink>
          </div>
          <div id="b2" className="button-container">
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div
            className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <Icon height={40} icon="ci:hamburger-md" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
