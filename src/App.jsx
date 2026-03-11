import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Charts from "./components/Charts";
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
      {page === "charts" && <Charts />}
    </>
  );
}

export default App;