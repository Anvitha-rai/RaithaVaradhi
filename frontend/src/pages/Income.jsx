// src/pages/Income.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Income() {
  const [seasons, setSeasons] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [form, setForm] = useState({ season_id:"", crop_sold:"", quantity_kg:"", price_per_kg:"", mandi_name:"", sold_date:"" });
  const [selectedSeason, setSelectedSeason] = useState("");

  useEffect(() => { API.get("/seasons/").then(r => setSeasons(r.data)); }, []);

  const loadIncome = async (sid) => {
    setSelectedSeason(sid);
    const [incRes, sumRes] = await Promise.all([
      API.get(`/income/${sid}`),
      API.get(`/income/summary/${sid}`)
    ]);
    setIncomes(incRes.data);
    setTotal(sumRes.data.total_income || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/income/", {
      ...form,
      season_id:    parseInt(form.season_id),
      quantity_kg:  parseFloat(form.quantity_kg),
      price_per_kg: parseFloat(form.price_per_kg),
    });
    if (selectedSeason) loadIncome(selectedSeason);
    setForm({ ...form, crop_sold:"", quantity_kg:"", price_per_kg:"", mandi_name:"", sold_date:"" });
  };

  const computed = form.quantity_kg && form.price_per_kg
    ? (parseFloat(form.quantity_kg) * parseFloat(form.price_per_kg)).toFixed(2)
    : null;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth:800, margin:"0 auto", padding:"28px 20px" }}>
        <h2 style={{ marginBottom:20 }}>Income</h2>

        <div style={cardStyle}>
          <h3 style={{ fontSize:15, marginBottom:14 }}>Log a sale</h3>
          <form onSubmit={handleSubmit} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={labelStyle}>Season</label>
              <select style={inputStyle} value={form.season_id}
                onChange={e => { setForm({...form, season_id:e.target.value}); loadIncome(e.target.value); }} required>
                <option value="">Select season</option>
                {seasons.map(s => <option key={s.id} value={s.id}>{s.crop_name} ({s.season_type})</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Crop sold</label>
              <input style={inputStyle} placeholder="e.g. Tomato" value={form.crop_sold}
                onChange={e => setForm({...form, crop_sold:e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Quantity (kg)</label>
              <input style={inputStyle} type="number" placeholder="100" value={form.quantity_kg}
                onChange={e => setForm({...form, quantity_kg:e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Price per kg (₹)</label>
              <input style={inputStyle} type="number" placeholder="20" value={form.price_per_kg}
                onChange={e => setForm({...form, price_per_kg:e.target.value})} required />
            </div>
            <div>
              <label style={labelStyle}>Mandi name</label>
              <input style={inputStyle} placeholder="e.g. APMC Dharwad" value={form.mandi_name}
                onChange={e => setForm({...form, mandi_name:e.target.value})} />
            </div>
            <div>
              <label style={labelStyle}>Date sold</label>
              <input style={inputStyle} type="date" value={form.sold_date}
                onChange={e => setForm({...form, sold_date:e.target.value})} required />
            </div>
            {computed && (
              <div style={{ gridColumn:"1/-1", background:"#f0fdf4", padding:"10px 14px", borderRadius:6, fontSize:14 }}>
                Estimated total: <strong>₹{parseFloat(computed).toLocaleString()}</strong>
              </div>
            )}
            <div style={{ gridColumn:"1/-1" }}>
              <button type="submit" style={btnStyle}>Log sale</button>
            </div>
          </form>
        </div>

        {selectedSeason && (
          <div style={{ marginTop:24, ...cardStyle }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
              <h3 style={{ fontSize:15, margin:0 }}>Sales this season</h3>
              <span style={{ fontWeight:700, color:"#15803d" }}>Total: ₹{total?.toLocaleString()}</span>
            </div>
            {incomes.map(i => (
              <div key={i.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f3f4f6" }}>
                <div>
                  <span style={{ fontWeight:500, fontSize:14 }}>{i.crop_sold}</span>
                  <span style={{ fontSize:13, color:"#6b7280", marginLeft:8 }}>{i.quantity_kg}kg @ ₹{i.price_per_kg}/kg</span>
                  {i.mandi_name && <span style={{ fontSize:13, color:"#9ca3af", marginLeft:8 }}>· {i.mandi_name}</span>}
                </div>
                <span style={{ fontWeight:600, fontSize:14, color:"#15803d" }}>₹{i.total_amount?.toLocaleString()}</span>
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