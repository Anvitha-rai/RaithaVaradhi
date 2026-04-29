// src/pages/Expenses.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const CATEGORIES = ["Seeds", "Fertilizer", "Labor", "Water", "Equipment", "Transport", "Other"];

export default function Expenses() {
  const [seasons,  setSeasons]  = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary,  setSummary]  = useState({ total: 0, by_category: {} });
  const [form, setForm] = useState({ season_id:"", category:"Seeds", description:"", amount:"", expense_date:"" });
  const [selectedSeason, setSelectedSeason] = useState("");

  useEffect(() => { API.get("/seasons/").then(r => setSeasons(r.data)); }, []);

  const loadExpenses = async (sid) => {
    setSelectedSeason(sid);
    const [expRes, sumRes] = await Promise.all([
      API.get(`/expenses/${sid}`),
      API.get(`/expenses/summary/${sid}`)
    ]);
    setExpenses(expRes.data);
    setSummary({ total: sumRes.data.total_expenses, by_category: sumRes.data.by_category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/expenses/", form);
    if (selectedSeason) loadExpenses(selectedSeason);
    setForm({ ...form, description:"", amount:"", expense_date:"" });
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 20px" }}>
        <h2 style={{ marginBottom:20 }}>Expenses</h2>

        <div style={cardStyle}>
          <h3 style={{ fontSize:15, marginBottom:14 }}>Log an expense</h3>
          <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Season</label>
              <select style={inputStyle} value={form.season_id}
                onChange={e => { setForm({...form, season_id:e.target.value}); loadExpenses(e.target.value); }} required>
                <option value="">Select season</option>
                {seasons.map(s => <option key={s.id} value={s.id}>{s.crop_name} ({s.season_type})</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category:e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount (₹)</label>
              <input style={inputStyle} type="number" placeholder="500" value={form.amount}
                onChange={e => setForm({...form, amount:e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={form.expense_date}
                onChange={e => setForm({...form, expense_date:e.target.value})} required />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Description (optional)</label>
              <input style={inputStyle} placeholder="e.g. Urea 50kg bag" value={form.description}
                onChange={e => setForm({...form, description:e.target.value})} />
            </div>
            <div style={{ gridColumn:"1/-1" }}>
              <button type="submit" style={btnStyle}>Add expense</button>
            </div>
          </form>
        </div>

        {selectedSeason && (
          <div style={{ marginTop:24, ...cardStyle }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ fontSize:15, margin:0 }}>Season expenses</h3>
              <span style={{ fontWeight:700, color:"#d97706" }}>Total: ₹{summary.total?.toLocaleString()}</span>
            </div>
            {expenses.map(e => (
              <div key={e.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                <div>
                  <span style={{ fontWeight:500, fontSize:14 }}>{e.category}</span>
                  {e.description && <span style={{ fontSize:13, color:"#6b7280", marginLeft:8 }}>{e.description}</span>}
                </div>
                <span style={{ fontWeight:600, fontSize:14 }}>₹{e.amount?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const cardStyle  = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"20px" };
const labelStyle = { display:"block", fontSize:13, fontWeight:500, color:"#374151", marginBottom:4 };
const inputStyle = { width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid #d1d5db", fontSize:14, boxSizing:"border-box" };
const btnStyle   = { width:"100%", padding:10, background:"#15803d", color:"#fff", border:"none", borderRadius:6, fontWeight:600, fontSize:14, cursor:"pointer" };