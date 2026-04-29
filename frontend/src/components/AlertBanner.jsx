// src/components/AlertBanner.jsx
export default function AlertBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fef3c7", border: "1px solid #f59e0b",
      borderRadius: 8, padding: "12px 16px",
      color: "#92400e", fontSize: 14, marginBottom: 16
    }}>
      ⚠ {message}
    </div>
  );
}