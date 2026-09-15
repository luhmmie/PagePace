import React, { useState } from 'react'
import LogoImage from "../assets/logo.png";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import "./navbar.css";

const NavBar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const userName = "Faith";

  return (
    <div className="navbar-list">
      <div className="logo">
      <h3>PagePace</h3>
      </div>

      <div className="navbar-right">
        {/* <div className="theme" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <CiDark /> : <CiLight />}
        </div> */}

        <div className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  )
}

export default NavBar