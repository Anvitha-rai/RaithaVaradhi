// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const [form, setForm]   = useState({ name:"", phone:"", password:"", village:"", district:"", state:"Karnataka" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await API.post("/auth/register", form);
      setSuccess("Registered! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const f = (field) => ({
    value: form[field],
    onChange: e => setForm({...form, [field]: e.target.value})
  });

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "#15803d", marginBottom: 20 }}>Create your account</h2>
        {error   && <p style={{ color:"red",   fontSize:13, marginBottom:10 }}>{error}</p>}
        {success && <p style={{ color:"green", fontSize:13, marginBottom:10 }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          {[
            ["name",     "Full name",    "text",     "Raju Patil"],
            ["phone",    "Phone",        "text",     "9999999999"],
            ["password", "Password",     "password", "••••••••"],
            ["village",  "Village",      "text",     "Dharwad"],
            ["district", "District",     "text",     "Dharwad"],
            ["state",    "State",        "text",     "Karnataka"],
          ].map(([field, label, type, ph]) => (
            <div key={field}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle} type={type} placeholder={ph} {...f(field)} required={["name","phone","password"].includes(field)} />
            </div>
          ))}
          <button type="submit" style={btnStyle}>Register</button>
        </form>
        <p style={{ textAlign:"center", fontSize:13, marginTop:14, color:"#6b7280" }}>
          Already have an account? <Link to="/login" style={{ color:"#15803d" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}

const pageStyle  = { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f0fdf4" };
const cardStyle  = { background:"#fff", padding:32, borderRadius:12, border:"1px solid #d1fae5", width:380, boxShadow:"0 2px 12px rgba(0,0,0,0.06)" };
const labelStyle = { display:"block", fontSize:13, fontWeight:500, color:"#374151", marginBottom:4 };
const inputStyle = { width:"100%", padding:"9px 12px", borderRadius:6, border:"1px solid #d1d5db", fontSize:14, marginBottom:12, boxSizing:"border-box" };
const btnStyle   = { width:"100%", padding:10, background:"#15803d", color:"#fff", border:"none", borderRadius:6, fontWeight:600, fontSize:15, cursor:"pointer" };