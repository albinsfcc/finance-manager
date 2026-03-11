import React from "react";
import logo from "../assets/logo.svg";

export default function Header({ onToggleSidebar }) {
  return (
    <div className="topbar">
      <button className="hamburger" onClick={onToggleSidebar}>
        ☰
      </button>
      <h2 className="topbar-logo">
        <img
          src={logo}
          alt="Personal Finance Manager"
        />
      </h2>
    </div>
  );
}

