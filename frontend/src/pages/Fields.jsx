// src/pages/Fields.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const SOIL_OPTIONS = [
  { value: "Clay",         emoji: "🟤", desc: "High water retention" },
  { value: "Sandy",        emoji: "🟡", desc: "Fast draining" },
  { value: "Loamy",        emoji: "🌱", desc: "Ideal for most crops" },
  { value: "Silty",        emoji: "💧", desc: "Smooth & fertile" },
  { value: "Peaty",        emoji: "🍂", desc: "Rich in organic matter" },
  { value: "Chalky",       emoji: "⬜", desc: "Alkaline & stony" },
  { value: "Red Laterite", emoji: "🔴", desc: "Tropical & acidic" },
  { value: "Black Cotton", emoji: "⚫", desc: "Regur, retains moisture" },
];

const SOIL_COLORS = {
  "Clay":         { bg: "#92400e22", text: "#92400e", border: "#d97706" },
  "Sandy":        { bg: "#fef3c722", text: "#b45309", border: "#f59e0b" },
  "Loamy":        { bg: "#14532d22", text: "#15803d", border: "#22c55e" },
  "Silty":        { bg: "#1e3a5f22", text: "#1d4ed8", border: "#60a5fa" },
  "Peaty":        { bg: "#451a0322", text: "#9a3412", border: "#ea580c" },
  "Chalky":       { bg: "#f1f5f922", text: "#475569", border: "#94a3b8" },
  "Red Laterite": { bg: "#7f1d1d22", text: "#dc2626", border: "#f87171" },
  "Black Cotton": { bg: "#09090b22", text: "#3f3f46", border: "#71717a" },
};

export default function Fields() {
  const [fields, setFields]   = useState([]);
  const [form, setForm]       = useState({ field_name: "", area_acres: "", soil_type: "", location_notes: "" });
  const [msg, setMsg]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hovered, setHovered] = useState(null);

  const fetchFields = async () => {
    try {
      const res = await API.get("/fields/");
      setFields(res.data);
    } catch {
      setError("Failed to load fields.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFields(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await API.post("/fields/", { ...form, area_acres: parseFloat(form.area_acres) });
      setMsg("Field added successfully!");
      setForm({ field_name: "", area_acres: "", soil_type: "", location_notes: "" });
      fetchFields();
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setError("Failed to add field. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalAcres = fields.reduce((sum, f) => sum + (f.area_acres || 0), 0);
  const soilTypes  = [...new Set(fields.map(f => f.soil_type).filter(Boolean))];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rv-wrap {
          min-height: 100vh;
          background: #f5f0e8;
          background-image:
            radial-gradient(ellipse at 10% 0%, #d4e9c8 0%, transparent 50%),
            radial-gradient(ellipse at 90% 100%, #e2d4b8 0%, transparent 50%);
          font-family: 'DM Sans', sans-serif;
          color: #1a1a12;
        }

        .rv-page {
          max-width: 920px;
          margin: 0 auto;
          padding: 40px 24px 60px;
        }

        /* ── Header ── */
        .rv-hero {
          position: relative;
          margin-bottom: 40px;
          padding: 36px 40px;
          background: linear-gradient(135deg, #1a3d1f 0%, #2d6a35 60%, #4a8c50 100%);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px #1a3d1f40;
        }
        .rv-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .rv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff18;
          border: 1px solid #ffffff28;
          color: #a8e6b0;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 16px;
        }
        .rv-hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 38px;
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin-bottom: 10px;
        }
        .rv-hero p {
          font-size: 14px;
          color: #a8d5b0;
          font-weight: 300;
          letter-spacing: .01em;
        }
        .rv-hero-art {
          position: absolute;
          right: 36px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 96px;
          opacity: .18;
          filter: grayscale(20%);
          pointer-events: none;
          line-height: 1;
        }

        /* ── Stats ── */
        .rv-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 32px;
        }
        .rv-stat {
          background: #fff;
          border: 1px solid #e2ddd4;
          border-radius: 16px;
          padding: 20px 22px;
          position: relative;
          overflow: hidden;
          transition: transform .2s, box-shadow .2s;
        }
        .rv-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px #0000000d;
        }
        .rv-stat::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2d6a35, #7cb87f);
          border-radius: 0 0 16px 16px;
          opacity: 0;
          transition: opacity .2s;
        }
        .rv-stat:hover::after { opacity: 1; }
        .rv-stat-icon {
          font-size: 22px;
          margin-bottom: 10px;
        }
        .rv-stat-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .1em;
          color: #9b9282;
          margin-bottom: 6px;
        }
        .rv-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #1a3d1f;
          line-height: 1;
        }
        .rv-stat-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: #9b9282;
          margin-left: 4px;
        }

        /* ── Card ── */
        .rv-card {
          background: #fff;
          border: 1px solid #e2ddd4;
          border-radius: 20px;
          padding: 28px 28px 24px;
          margin-bottom: 28px;
          box-shadow: 0 2px 12px #0000000a;
        }

        .rv-section-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: #9b9282;
          margin-bottom: 20px;
        }
        .rv-section-label::before {
          content: '';
          display: block;
          width: 3px;
          height: 14px;
          background: linear-gradient(180deg, #2d6a35, #7cb87f);
          border-radius: 2px;
        }

        /* ── Alerts ── */
        .rv-success {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          font-size: 13px;
          font-weight: 500;
          padding: 10px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          animation: slideIn .3s ease;
        }
        .rv-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Form ── */
        .rv-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .rv-field-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .rv-field-label {
          font-size: 12px;
          font-weight: 600;
          color: #3d3a32;
          letter-spacing: .01em;
        }
        .rv-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #ddd8cf;
          background: #faf9f6;
          color: #1a1a12;
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }
        .rv-input:focus {
          border-color: #2d6a35;
          background: #fff;
          box-shadow: 0 0 0 3px #2d6a3520;
        }
        .rv-input::placeholder { color: #bfbab2; }
        .rv-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23888' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
        }

        /* ── Submit Btn ── */
        .rv-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #1a3d1f, #2d6a35);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          letter-spacing: .02em;
          transition: opacity .2s, transform .15s, box-shadow .2s;
          box-shadow: 0 4px 14px #1a3d1f40;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .rv-btn:hover:not(:disabled) {
          opacity: .92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px #1a3d1f50;
        }
        .rv-btn:active:not(:disabled) { transform: translateY(0); }
        .rv-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── Fields Grid ── */
        .rv-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .rv-field-card {
          background: #fff;
          border: 1.5px solid #e2ddd4;
          border-radius: 18px;
          padding: 20px;
          transition: transform .2s, box-shadow .2s, border-color .2s;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .rv-field-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px #0000001a;
          border-color: #c5d9c7;
        }
        .rv-field-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .rv-field-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d4e9c8, #b6d9a8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .rv-field-acres-badge {
          background: #f5f0e8;
          border: 1px solid #ddd8cf;
          color: #6b6455;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .rv-field-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a12;
          margin-bottom: 5px;
          line-height: 1.3;
        }
        .rv-field-loc {
          font-size: 12px;
          color: #9b9282;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .rv-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid;
        }

        /* ── Empty State ── */
        .rv-empty {
          text-align: center;
          padding: 60px 40px;
          background: #fff;
          border: 1.5px dashed #d5cfc5;
          border-radius: 20px;
        }
        .rv-empty-icon {
          font-size: 52px;
          margin-bottom: 14px;
          display: block;
          filter: grayscale(20%);
        }
        .rv-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #3d3a32;
          margin-bottom: 6px;
        }
        .rv-empty-sub {
          font-size: 13px;
          color: #b5afa6;
        }

        /* ── Loading ── */
        .rv-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px;
          color: #9b9282;
          font-size: 13px;
        }
        .rv-spinner {
          width: 18px; height: 18px;
          border: 2px solid #e2ddd4;
          border-top-color: #2d6a35;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Divider ── */
        .rv-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 28px 0;
          color: #c5c0b8;
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .rv-divider::before, .rv-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2ddd4;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .rv-form-grid { grid-template-columns: 1fr; }
          .rv-stats { grid-template-columns: 1fr; }
          .rv-fields-grid { grid-template-columns: 1fr; }
          .rv-hero h1 { font-size: 28px; }
          .rv-hero-art { display: none; }
        }
      `}</style>

      <Navbar />

      <div className="rv-wrap">
        <div className="rv-page">

          {/* ── Hero Header ── */}
          <div className="rv-hero">
            <div className="rv-hero-art">🌾</div>
            <div className="rv-hero-badge">
              <span>🌿</span> Raithavaradhi
            </div>
            <h1>My Fields</h1>
            <p>Register, organise, and track all your farm plots in one place</p>
          </div>

          {/* ── Stats ── */}
          <div className="rv-stats">
            <div className="rv-stat">
              <div className="rv-stat-icon">🗺️</div>
              <div className="rv-stat-label">Total Fields</div>
              <div className="rv-stat-val">
                {fields.length}
                <span className="rv-stat-sub">registered</span>
              </div>
            </div>
            <div className="rv-stat">
              <div className="rv-stat-icon">📐</div>
              <div className="rv-stat-label">Total Area</div>
              <div className="rv-stat-val">
                {totalAcres.toFixed(1)}
                <span className="rv-stat-sub">acres</span>
              </div>
            </div>
            <div className="rv-stat">
              <div className="rv-stat-icon">🌍</div>
              <div className="rv-stat-label">Soil Types</div>
              <div className="rv-stat-val">
                {soilTypes.length}
                <span className="rv-stat-sub">varieties</span>
              </div>
            </div>
          </div>

          {/* ── Add Field Form ── */}
          <div className="rv-card">
            <div className="rv-section-label">Add new field</div>

            {msg   && <div className="rv-success"><span>✅</span>{msg}</div>}
            {error && <div className="rv-error"><span>⚠️</span>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="rv-form-grid">
                <div className="rv-field-group">
                  <label className="rv-field-label">Field Name *</label>
                  <input
                    className="rv-input"
                    value={form.field_name}
                    onChange={e => setForm({ ...form, field_name: e.target.value })}
                    placeholder="e.g. North Plot – Block A"
                    required
                  />
                </div>

                <div className="rv-field-group">
                  <label className="rv-field-label">Area (Acres) *</label>
                  <input
                    className="rv-input"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.area_acres}
                    onChange={e => setForm({ ...form, area_acres: e.target.value })}
                    placeholder="e.g. 2.5"
                    required
                  />
                </div>

                <div className="rv-field-group">
                  <label className="rv-field-label">Soil Type</label>
                  <select
                    className="rv-input rv-select"
                    value={form.soil_type}
                    onChange={e => setForm({ ...form, soil_type: e.target.value })}
                  >
                    <option value="">Select soil type…</option>
                    {SOIL_OPTIONS.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.emoji} {s.value} — {s.desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rv-field-group">
                  <label className="rv-field-label">Location Notes</label>
                  <input
                    className="rv-input"
                    value={form.location_notes}
                    onChange={e => setForm({ ...form, location_notes: e.target.value })}
                    placeholder="e.g. Near the river, east side"
                  />
                </div>
              </div>

              <button type="submit" className="rv-btn" disabled={submitting}>
                {submitting ? (
                  <><div className="rv-spinner" style={{ borderTopColor: "#fff" }}></div> Adding…</>
                ) : (
                  <><span>＋</span> Add Field</>
                )}
              </button>
            </form>
          </div>

          {/* ── Fields List ── */}
          <div className="rv-section-label">Your fields</div>

          {loading ? (
            <div className="rv-loading">
              <div className="rv-spinner"></div>
              Loading your fields…
            </div>
          ) : fields.length === 0 ? (
            <div className="rv-empty">
              <span className="rv-empty-icon">🌾</span>
              <div className="rv-empty-title">No fields registered yet</div>
              <div className="rv-empty-sub">Add your first field above to get started</div>
            </div>
          ) : (
            <div className="rv-fields-grid">
              {fields.map(f => {
                const soil = SOIL_COLORS[f.soil_type] || { bg: "#f5f0e8", text: "#6b6455", border: "#ddd8cf" };
                const soilEmoji = SOIL_OPTIONS.find(s => s.value === f.soil_type)?.emoji || "🌱";
                return (
                  <div key={f.id} className="rv-field-card">
                    <div className="rv-field-card-top">
                      <div className="rv-field-icon">🗺️</div>
                      <span className="rv-field-acres-badge">{f.area_acres} ac</span>
                    </div>
                    <div className="rv-field-name">{f.field_name}</div>
                    {f.location_notes && (
                      <div className="rv-field-loc">
                        <span>📍</span>{f.location_notes}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {f.soil_type && (
                        <span
                          className="rv-tag"
                          style={{ background: soil.bg, color: soil.text, borderColor: soil.border }}
                        >
                          {soilEmoji} {f.soil_type}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}