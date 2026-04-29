// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { farmer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 24px", borderBottom: "1px solid #e5e7eb",
      background: "#fff", position: "sticky", top: 0, zIndex: 100
    }}>
      <Link to="/dashboard" style={{ fontWeight: 700, fontSize: 20, color: "#15803d", textDecoration: "none" }}>
        ರೈತವರದಿ · Raithavaradhi
      </Link>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link to="/dashboard" style={navLink}>Dashboard</Link>
        <Link to="/fields" style={navLink}>Fields</Link>
        <Link to="/seasons"   style={navLink}>Seasons</Link>
        <Link to="/expenses"  style={navLink}>Expenses</Link>
        <Link to="/income"    style={navLink}>Income</Link>
        <Link to="/insights" style={navLink}>Smart insights</Link>
        <span style={{ fontSize: 14, color: "#6b7280" }}>
          {farmer?.name}
        </span>
        <button onClick={handleLogout} style={{
          padding: "6px 14px", borderRadius: 6, border: "1px solid #d1d5db",
          background: "#fff", cursor: "pointer", fontSize: 13, color: "#374151"
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const navLink = {
  textDecoration: "none", fontSize: 14,
  color: "#374151", fontWeight: 500
};