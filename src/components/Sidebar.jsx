import { useState } from "react";
import Header from "./Header";

export default function Sidebar({ currentPage, setPage }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(prev => !prev);

  return (
    <>
      {/* Header / Top Bar */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <h3>Menu</h3>
        <button
          onClick={() => {
            setPage("dashboard");
            setOpen(false);
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            setPage("charts");
            setOpen(false);
          }}
        >
          Charts
        </button>
        <button
          onClick={() => {
            window.location.reload();
            setOpen(false);
          }}
        >
          Update
        </button>
      </div>
    </>
  );
}