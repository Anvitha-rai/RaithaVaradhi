// src/pages/Seasons.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Seasons() {
  const [seasons, setSeasons] = useState([]);
  const [fields,  setFields]  = useState([]);
  const [form, setForm] = useState({ field_id:"", crop_name:"", season_type:"kharif", start_date:"" });
  const [msg, setMsg]   = useState("");

  useEffect(() => {
    API.get("/seasons/").then(r => setSeasons(r.data));
    API.get("/fields/").then(r => setFields(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/seasons/", form);
    setMsg("Season added!");
    const res = await API.get("/seasons/");
    setSeasons(res.data);
    setForm({ field_id:"", crop_name:"", season_type:"kharif", start_date:"" });
    setTimeout(() => setMsg(""), 2000);
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
        <h2 style={{ marginBottom: 20 }}>Crop seasons</h2>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: 16, fontSize: 15 }}>Add new season</h3>
          {msg && <p style={{ color:"green", fontSize:13, marginBottom:10 }}>{msg}</p>}
          <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Field</label>
              <select style={inputStyle} value={form.field_id} onChange={e => setForm({...form, field_id: e.target.value})} required>
                <option value="">Select field</option>
                {fields.map(f => <option key={f.id} value={f.id}>{f.field_name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Crop name</label>
              <input style={inputStyle} value={form.crop_name} onChange={e => setForm({...form, crop_name:e.target.value})} placeholder="e.g. Tomato" required />
            </div>
            <div>
              <label style={labelStyle}>Season type</label>
              <select style={inputStyle} value={form.season_type} onChange={e => setForm({...form, season_type:e.target.value})}>
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Start date</label>
              <input style={inputStyle} type="date" value={form.start_date} onChange={e => setForm({...form, start_date:e.target.value})} required />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <button type="submit" style={btnStyle}>Add season</button>
            </div>
          </form>
        </div>

        <div style={{ marginTop: 28 }}>
          <h3 style={{ marginBottom: 12, fontSize: 15 }}>Your seasons</h3>
          {seasons.length === 0
            ? <p style={{ color:"#9ca3af", fontSize:14 }}>No seasons yet.</p>
            : seasons.map(s => (
              <div key={s.id} style={{ ...cardStyle, marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <p style={{ fontWeight:600, marginBottom:2 }}>{s.crop_name}</p>
                  <p style={{ fontSize:13, color:"#6b7280" }}>{s.season_type} · Started {s.start_date}</p>
                </div>
                <span style={{ fontSize:12, padding:"4px 10px", borderRadius:20,
                  background: s.status==="active" ? "#dcfce7" : "#f3f4f6",
                  color: s.status==="active" ? "#15803d" : "#6b7280" }}>
                  {s.status}
                </span>
              </div>
          ))}
        </div>
      </div>
    </>
  );
}

const cardStyle  = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"20px" };
const labelStyle = { display:"block", fontSize:13, fontWeight:500, color:"#374151", marginBottom:4 };
const inputStyle = { width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid #d1d5db", fontSize:14, boxSizing:"border-box" };
const btnStyle   = { width:"100%", padding:10, background:"#15803d", color:"#fff", border:"none", borderRadius:6, fontWeight:600, fontSize:14, cursor:"pointer" };