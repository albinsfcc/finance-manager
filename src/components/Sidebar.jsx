import { useState } from "react";

export default function Sidebar({ currentPage, setPage }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <button className="hamburger" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <h2><img src="/logo.svg" alt="Albin Finance" style={{ height: "28px" }} /></h2>
      </div>

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h3>Menu</h3>
        <button onClick={() => { setPage("dashboard"); setOpen(false); }}>
          Dashboard
        </button>
        <button onClick={() => { setPage("charts"); setOpen(false); }}>
          Charts
        </button>
      </div>
    </>
  );
}