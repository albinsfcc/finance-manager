import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import "./styles.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <>
      <Sidebar currentPage={page} setPage={setPage} />
      {page === "dashboard" && <Dashboard />}
      {page === "charts" && (
        <div className="container main">
          <div className="card">
            <h2>Charts Coming Soon 📊</h2>
          </div>
        </div>
      )}
    </>
  );
}

export default App;