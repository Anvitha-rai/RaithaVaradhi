// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm]   = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow]   = useState(false);
  const { login }         = useAuth();
  const navigate          = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.farmer);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={page}>
      {/* Background overlay */}
      <div style={overlay}></div>

      <div style={card}>
        {/* Branding */}
        <div style={header}>
          <h1 style={logo}>ರೈತವರದಿ</h1>
          <p style={tagline}>Farm Finance Management</p>
        </div>

        {/* Error */}
        {error && <div style={errorBox}>{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div style={field}>
            <label style={label}>Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              style={input}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div style={field}>
            <label style={label}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                style={input}
                placeholder="Enter password"
                required
              />
              <span style={eye} onClick={() => setShow(!show)}>
                {show ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <button type="submit" style={button}>
            Login
          </button>
        </form>

        <p style={footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

/* 🌾 BACKGROUND */
const page = {
  minHeight: "100vh",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Inter, sans-serif",
  position: "relative"
};

/* 🌑 DARK OVERLAY */
const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(15, 23, 42, 0.55)"
};

/* 🧾 CARD */
const card = {
  position: "relative",
  width: 380,
  padding: "36px 32px",
  borderRadius: 12,
  background: "#ffffff",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  zIndex: 2
};

/* 🏷 HEADER */
const header = {
  textAlign: "center",
  marginBottom: 24
};

const logo = {
  fontSize: 26,
  fontWeight: 700,
  color: "#166534",
  marginBottom: 4
};

const tagline = {
  fontSize: 13,
  color: "#6b7280"
};

/* ❌ ERROR */
const errorBox = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "8px 10px",
  borderRadius: 6,
  fontSize: 13,
  marginBottom: 14,
  textAlign: "center"
};

/* 📦 FIELD */
const field = {
  marginBottom: 18
};

const label = {
  fontSize: 13,
  color: "#374151",
  marginBottom: 6,
  display: "block",
  fontWeight: 500
};

/* ✍ INPUT */
const input = {
  width: "100%",
  padding: "11px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box"
};

/* 👁 */
const eye = {
  position: "absolute",
  right: 12,
  top: 10,
  cursor: "pointer"
};

/* 🔥 BUTTON */
const button = {
  width: "100%",
  padding: "12px",
  background: "#166534",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  marginTop: 10
};

/* 🔗 */
const footer = {
  textAlign: "center",
  marginTop: 18,
  fontSize: 13,
  color: "#6b7280"
};

const link = {
  color: "#166534",
  fontWeight: 600,
  textDecoration: "none"
};