// src/components/StatCard.jsx
export default function StatCard({ label, value, color = "#15803d" }) {
  return (
    <div style={{
      background: "#f9fafb", borderRadius: 10, padding: "16px 20px",
      border: "1px solid #e5e7eb", minWidth: 160
    }}>
      <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 6px" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 700, color, margin: 0 }}>{value}</p>
    </div>
  );
}