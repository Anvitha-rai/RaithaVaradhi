// src/pages/SmartInsights.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import AlertBanner from "../components/AlertBanner";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

export default function SmartInsights() {
  const [seasons,     setSeasons]     = useState([]);
  const [selectedSid, setSelectedSid] = useState("");
  const [overspend,   setOverspend]   = useState(null);
  const [weatherImpact, setWeatherImpact] = useState(null);
  const [ranking,     setRanking]     = useState([]);
  const [cropInput,   setCropInput]   = useState("");
  const [sellTime,    setSellTime]    = useState(null);
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    API.get("/seasons/").then(r => setSeasons(r.data));
    API.get("/analytics/crop-ranking").then(r => setRanking(r.data.ranking || []));
  }, []);

  const loadSeasonInsights = async (sid) => {
    setSelectedSid(sid);
    setOverspend(null);
    setWeatherImpact(null);
    setLoading(true);
    try {
      const [ovRes, wRes] = await Promise.all([
        API.get(`/expenses/overspend-check/${sid}`),
        API.get(`/weather/impact/${sid}`).catch(() => null)
      ]);
      setOverspend(ovRes.data);
      if (wRes) setWeatherImpact(wRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const checkSellTime = async () => {
    if (!cropInput.trim()) return;
    try {
      const res = await API.get(`/analytics/best-sell-time/${cropInput.trim()}`);
      setSellTime(res.data);
    } catch {
      setSellTime({ message: `No sales history found for ${cropInput}` });
    }
  };

  const monthlyChartData = sellTime?.monthly_breakdown
    ? Object.entries(sellTime.monthly_breakdown).map(([month, price]) => ({ month, price }))
    : [];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 20px" }}>
        <h2 style={{ marginBottom:6 }}>Smart insights</h2>
        <p style={{ color:"#6b7280", marginBottom:24, fontSize:14 }}>
          AI-powered alerts and analysis for your farm
        </p>

        {/* ── Crop ranking ── */}
        <div style={cardStyle}>
          <h3 style={headStyle}>Most profitable crops</h3>
          {ranking.length === 0
            ? <p style={mutedStyle}>Add seasons with income and expenses to see ranking.</p>
            : ranking.map((r, i) => (
              <div key={r.season_id} style={{
                display:"flex", justifyContent:"space-between", alignItems:"center",
                padding:"10px 0", borderBottom:"1px solid #f3f4f6"
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{
                    width:28, height:28, borderRadius:"50%", background: i===0 ? "#15803d" : "#f3f4f6",
                    color: i===0 ? "#fff" : "#6b7280",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:700, fontSize:13
                  }}>{i+1}</span>
                  <div>
                    <p style={{ margin:0, fontWeight:600 }}>{r.crop}</p>
                    <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>{r.season_type}</p>
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ margin:0, fontWeight:700, color: r.profit >= 0 ? "#15803d" : "#dc2626" }}>
                    ₹{r.profit.toLocaleString()}
                  </p>
                  <p style={{ margin:0, fontSize:12, color:"#9ca3af" }}>profit</p>
                </div>
              </div>
            ))
          }
        </div>

        {/* ── Season selector ── */}
        <div style={{ ...cardStyle, marginTop:20 }}>
          <h3 style={headStyle}>Season analysis</h3>
          <select style={inputStyle} value={selectedSid}
            onChange={e => loadSeasonInsights(e.target.value)}>
            <option value="">Select a season to analyse</option>
            {seasons.map(s => (
              <option key={s.id} value={s.id}>{s.crop_name} ({s.season_type})</option>
            ))}
          </select>

          {loading && <p style={{ color:"#6b7280", fontSize:14, marginTop:12 }}>Loading insights...</p>}

          {/* Overspend result */}
          {overspend && (
            <div style={{ marginTop:16 }}>
              <AlertBanner message={overspend.alert ? overspend.message : null} />
              {!overspend.alert && overspend.previous !== null && (
                <div style={{ background:"#f0fdf4", borderRadius:8, padding:"12px 16px", fontSize:14, color:"#15803d" }}>
                  Spending is under control. Current: ₹{overspend.current?.toLocaleString()} vs last season: ₹{overspend.previous?.toLocaleString()}
                </div>
              )}
              {overspend.previous === null && (
                <p style={{ fontSize:14, color:"#6b7280", marginTop:8 }}>{overspend.message}</p>
              )}

              <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
                {[
                  ["This season",  `₹${overspend.current?.toLocaleString()}`,  "#d97706"],
                  ["Last season",  overspend.previous !== null ? `₹${overspend.previous?.toLocaleString()}` : "N/A", "#6b7280"],
                  ["Difference",   overspend.difference != null ? `₹${Math.abs(overspend.difference).toLocaleString()}` : "N/A",
                    overspend.alert ? "#dc2626" : "#15803d"],
                ].map(([label, val, color]) => (
                  <div key={label} style={{ background:"#f9fafb", borderRadius:8, padding:"12px 16px", minWidth:140 }}>
                    <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 4px" }}>{label}</p>
                    <p style={{ fontSize:20, fontWeight:700, color, margin:0 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weather impact result */}
          {weatherImpact && (
            <div style={{ marginTop:20, borderTop:"1px solid #f3f4f6", paddingTop:16 }}>
              <h4 style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Weather impact this season</h4>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:14 }}>
                {[
                  ["Avg temp",     `${weatherImpact.weather_summary.avg_temperature_c}°C`],
                  ["Total rain",   `${weatherImpact.weather_summary.total_rainfall_mm} mm`],
                  ["Avg humidity", `${weatherImpact.weather_summary.avg_humidity_pct}%`],
                  ["Days logged",  weatherImpact.weather_summary.days_logged],
                ].map(([label, val]) => (
                  <div key={label} style={{ background:"#eff6ff", borderRadius:8, padding:"10px 14px", minWidth:120 }}>
                    <p style={{ fontSize:12, color:"#6b7280", margin:"0 0 4px" }}>{label}</p>
                    <p style={{ fontSize:18, fontWeight:700, color:"#1d4ed8", margin:0 }}>{val}</p>
                  </div>
                ))}
              </div>
              {weatherImpact.insights.map((insight, i) => (
                <div key={i} style={{
                  background:"#fefce8", border:"1px solid #fde68a",
                  borderRadius:6, padding:"8px 12px", marginBottom:8,
                  fontSize:13, color:"#92400e"
                }}>
                  {insight}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Best sell time ── */}
        <div style={{ ...cardStyle, marginTop:20 }}>
          <h3 style={headStyle}>Best time to sell</h3>
          <p style={{ fontSize:13, color:"#6b7280", marginBottom:12 }}>
            Enter a crop name to find out which month gave you the best price historically.
          </p>
          <div style={{ display:"flex", gap:10 }}>
            <input style={{ ...inputStyle, flex:1 }} placeholder="e.g. Tomato"
              value={cropInput} onChange={e => setCropInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && checkSellTime()} />
            <button onClick={checkSellTime} style={btnStyle}>Check</button>
          </div>

          {sellTime && (
            <div style={{ marginTop:16 }}>
              {sellTime.best_month ? (
                <>
                  <div style={{ background:"#f0fdf4", borderRadius:8, padding:"14px 16px", marginBottom:16 }}>
                    <p style={{ margin:0, fontWeight:600, fontSize:15, color:"#15803d" }}>
                      Best month to sell {sellTime.crop}: <strong>{sellTime.best_month}</strong>
                    </p>
                    <p style={{ margin:"4px 0 0", fontSize:13, color:"#374151" }}>
                      Average price: ₹{sellTime.avg_price_per_kg}/kg
                    </p>
                  </div>
                  {monthlyChartData.length > 0 && (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={monthlyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize:11 }} />
                        <YAxis tick={{ fontSize:11 }} />
                        <Tooltip formatter={v => `₹${v}/kg`} />
                        <Bar dataKey="price" name="Avg price/kg" fill="#15803d" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </>
              ) : (
                <p style={{ fontSize:14, color:"#6b7280", marginTop:8 }}>{sellTime.message}</p>
              )}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

const cardStyle  = { background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"20px" };
const headStyle  = { fontSize:15, fontWeight:600, marginBottom:14, marginTop:0 };
const mutedStyle = { fontSize:14, color:"#9ca3af" };
const inputStyle = { width:"100%", padding:"8px 12px", borderRadius:6, border:"1px solid #d1d5db", fontSize:14, boxSizing:"border-box" };
const btnStyle   = { padding:"8px 20px", background:"#15803d", color:"#fff", border:"none", borderRadius:6, fontWeight:600, fontSize:14, cursor:"pointer" };