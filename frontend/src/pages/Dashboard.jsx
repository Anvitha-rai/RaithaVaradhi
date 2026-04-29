// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import AlertBanner from "../components/AlertBanner";
import ProfitChart from "../components/ProfitChart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";

export default function Dashboard() {
  const { farmer } = useAuth();
  const [seasons, setSeasons] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ income: 0, expenses: 0, profit: 0 });
  const [alert, setAlert] = useState("");

  const [expandedSeason, setExpandedSeason] = useState(null);
  const [selectedChartSeason, setSelectedChartSeason] = useState(null);
  const [seasonDetails, setSeasonDetails] = useState({});

  useEffect(() => {
    API.get("/seasons/").then(async res => {
      const s = res.data;
      setSeasons(s);
      let totalIncome = 0, totalExpenses = 0;
      const chart = [];
      const details = {};

      for (const season of s) {
        const [incRes, expRes] = await Promise.all([
          API.get(`/income/summary/${season.id}`),
          API.get(`/expenses/summary/${season.id}`)
        ]);
        const inc = incRes.data.total_income || 0;
        const exp = expRes.data.total_expenses || 0;
        const profit = inc - exp;
        totalIncome += inc;
        totalExpenses += exp;

        chart.push({
          crop: season.crop_name,
          income: inc,
          expenses: exp,
          profit,
          seasonId: season.id,
        });

        details[season.id] = {
          income: inc,
          expenses: exp,
          profit,
          season,
        };
      }

      setTotals({ income: totalIncome, expenses: totalExpenses, profit: totalIncome - totalExpenses });
      setChartData(chart);
      setSeasonDetails(details);

      if (chart.length >= 2) {
        const last = chart[chart.length - 1];
        const prev = chart[chart.length - 2];
        if (last.expenses > prev.expenses) {
          setAlert(`Spending on ${last.crop} (₹${last.expenses.toLocaleString()}) is higher than last season (₹${prev.expenses.toLocaleString()}). Review your expenses!`);
        }
      }
    });
  }, []);

  const toggleSeason = (id) => {
    setExpandedSeason(prev => (prev === id ? null : id));
    setSelectedChartSeason(null);
  };

  return (
    <>
      <Navbar />
      <div style={page}>

        {/* HEADER */}
        <div style={header}>
          <div style={headerContent}>
            <div>
              <h1 style={title}>Welcome, {farmer?.name}</h1>
              <p style={subtitle}>Your farm dashboard overview</p>
            </div>
            <div style={headerIcon}>🌾</div>
          </div>
        </div>

        {/* ALERT */}
        {alert && <AlertBanner message={alert} />}

        {/* STATS */}
        <div style={statsSection}>
          <StatCard label="Total Income" value={`₹${totals.income.toLocaleString()}`} color="#10b981" />
          <StatCard label="Total Expenses" value={`₹${totals.expenses.toLocaleString()}`} color="#f59e0b" />
          <StatCard label="Net Profit" value={`₹${totals.profit.toLocaleString()}`} color={totals.profit >= 0 ? "#059669" : "#dc2626"} />
          <div style={seasonsCard}>
            <div style={seasonsIcon}>📅</div>
            <div>
              <div style={seasonsValue}>{seasons.length}</div>
              <div style={seasonsLabel}>Seasons</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={mainGrid}>
          <div style={chartCard}>
            <div style={cardHeader}>
              <h3 style={cardTitle}>Profit by Season</h3>
              <div style={viewToggle}>
                <span style={activeView}>Chart</span>
                <span style={inactiveView}>Table</span>
              </div>
            </div>
            {chartData.length > 0 ? (
              <ProfitChart data={chartData} />
            ) : (
              <div style={noData}>
                <div style={noDataIcon}>🌱</div>
                <p>No seasons data available</p>
              </div>
            )}
          </div>

          <div style={insightsCard}>
            <h3 style={cardTitle}>Farm Insights</h3>
            <div style={insightsList}>
              <div style={insight}>
                <span style={insightIcon}>💰</span>
                <span>Total Income: ₹{totals.income.toLocaleString()}</span>
              </div>
              <div style={insight}>
                <span style={insightIcon}>📉</span>
                <span>Total Expenses: ₹{totals.expenses.toLocaleString()}</span>
              </div>
              <div style={insight}>
                <span style={insightIcon}>📊</span>
                <span>Active Seasons: {seasons.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════ */}
        {/*         SEASON-WISE ANALYSIS              */}
        {/* ══════════════════════════════════════════ */}
        <div style={analysisSectionWrap}>

          <div style={sectionHeader}>
            <h2 style={sectionTitle}>🌿 Season-wise Analysis</h2>
            <p style={sectionSubtitle}>Expand a season to view its income, expenses & profit breakdown</p>
          </div>

          {chartData.length === 0 && (
            <div style={noData}>
              <div style={noDataIcon}>🌱</div>
              <p>No seasons data available</p>
            </div>
          )}

          {chartData.map((s, idx) => {
            const isOpen = expandedSeason === s.seasonId;
            const detail = seasonDetails[s.seasonId];
            const isProfit = s.profit >= 0;

            return (
              <div key={s.seasonId} style={seasonCard(isOpen)}>

                {/* Card Header */}
                <div style={seasonCardHeader} onClick={() => toggleSeason(s.seasonId)}>
                  <div style={seasonLeft}>
                    <div style={seasonBadge(idx)}>{idx + 1}</div>
                    <div>
                      <div style={seasonName}>{s.crop}</div>
                      <div style={seasonMeta}>Season #{idx + 1}</div>
                    </div>
                  </div>

                  <div style={seasonQuickStats}>
                    <div style={qStat}>
                      <span style={qLabel}>Income</span>
                      <span style={qValue("#059669")}>₹{s.income.toLocaleString()}</span>
                    </div>
                    <div style={qStat}>
                      <span style={qLabel}>Expenses</span>
                      <span style={qValue("#f59e0b")}>₹{s.expenses.toLocaleString()}</span>
                    </div>
                    <div style={qStat}>
                      <span style={qLabel}>P&L</span>
                      <span style={{ ...qValue(isProfit ? "#059669" : "#dc2626"), fontWeight: 800 }}>
                        {isProfit ? "▲" : "▼"} ₹{Math.abs(s.profit).toLocaleString()}
                      </span>
                    </div>
                    <div style={plBadge(isProfit)}>{isProfit ? "PROFIT" : "LOSS"}</div>
                  </div>

                  <div style={chevron(isOpen)}>▼</div>
                </div>

                {/* Expanded Body */}
                {isOpen && detail && (
                  <div style={expandedBody}>

                    {/* Summary Boxes */}
                    <div style={summaryRow}>
                      <div style={summaryBox("#d1fae5")}>
                        <div style={sumIcon}>💵</div>
                        <div>
                          <div style={sumLabel}>Total Income</div>
                          <div style={sumValue}>₹{detail.income.toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={summaryBox("#fef3c7")}>
                        <div style={sumIcon}>🧾</div>
                        <div>
                          <div style={sumLabel}>Total Expenses</div>
                          <div style={sumValue}>₹{detail.expenses.toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={summaryBox(isProfit ? "#d1fae5" : "#fee2e2")}>
                        <div style={sumIcon}>{isProfit ? "📈" : "📉"}</div>
                        <div>
                          <div style={sumLabel}>Net {isProfit ? "Profit" : "Loss"}</div>
                          <div style={{ ...sumValue, color: isProfit ? "#059669" : "#dc2626" }}>
                            ₹{Math.abs(detail.profit).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div style={summaryBox(isProfit ? "#dcfce7" : "#fee2e2")}>
                        <div style={sumIcon}>{isProfit ? "✅" : "❌"}</div>
                        <div>
                          <div style={sumLabel}>Status</div>
                          <div style={{ ...sumValue, color: isProfit ? "#059669" : "#dc2626" }}>
                            {isProfit ? "Profitable" : "In Loss"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chart Toggle */}
                    <div style={chartSelectorRow}>
                      <span style={chartSelectorLabel}>📊 View chart for this season:</span>
                      <button
                        style={chartBtn(selectedChartSeason === s.seasonId)}
                        onClick={() =>
                          setSelectedChartSeason(
                            selectedChartSeason === s.seasonId ? null : s.seasonId
                          )
                        }
                      >
                        {selectedChartSeason === s.seasonId ? "Hide Chart ▲" : "Show Chart ▼"}
                      </button>
                    </div>

                    {/* Income vs Expenses Bar Chart — only for selected season */}
                    {selectedChartSeason === s.seasonId && (
                      <div style={chartBox}>
                        <h5 style={chartBoxTitle}>Income vs Expenses — {s.crop}</h5>
                        <ResponsiveContainer width="100%" height={240}>
                          <BarChart
                            data={[
                              { name: "Income", value: detail.income, color: "#10b981" },
                              { name: "Expenses", value: detail.expenses, color: "#f59e0b" },
                              { name: isProfit ? "Profit" : "Loss", value: Math.abs(detail.profit), color: isProfit ? "#059669" : "#dc2626" },
                            ]}
                            margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 13, fill: "#374151" }} />
                            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                            <Tooltip
                              formatter={(v) => `₹${v.toLocaleString()}`}
                              contentStyle={{ borderRadius: "10px", border: "1px solid #d1fae5" }}
                            />
                            <Bar dataKey="value" radius={[8, 8, 0, 0]} name="Amount">
                              {[
                                { name: "Income", color: "#10b981" },
                                { name: "Expenses", color: "#f59e0b" },
                                { name: isProfit ? "Profit" : "Loss", color: isProfit ? "#059669" : "#dc2626" },
                              ].map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* P&L Statement */}
                    <div style={plStatement(isProfit)}>
                      <span style={plStatIcon}>{isProfit ? "🎉" : "⚠️"}</span>
                      <span>
                        {isProfit
                          ? `This season earned a net profit of ₹${detail.profit.toLocaleString()}. Great work!`
                          : `This season recorded a net loss of ₹${Math.abs(detail.profit).toLocaleString()}. Consider reviewing your expenses.`}
                      </span>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </>
  );
}

/* ─── Existing Styles ─── */

const page = {
  width: "100%",
  minHeight: "100vh",
  padding: "30px",
  background: "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)",
  fontFamily: "Inter, sans-serif"
};

const header = {
  background: "linear-gradient(135deg, #166534, #22c55e)",
  borderRadius: "20px",
  padding: "28px 32px",
  marginBottom: "40px",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(34,197,94,0.35)"
};

const headerContent = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const title = { fontSize: "28px", fontWeight: 700 };
const subtitle = { fontSize: "15px", opacity: 0.9, marginTop: "6px" };
const headerIcon = { fontSize: "42px" };

const statsSection = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginTop: "-30px",
  marginBottom: "30px"
};

const seasonsCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb"
};

const seasonsIcon = {
  width: "42px", height: "42px", borderRadius: "12px",
  background: "linear-gradient(135deg, #bbf7d0, #86efac)",
  display: "flex", alignItems: "center", justifyContent: "center"
};

const seasonsValue = { fontSize: "22px", fontWeight: 700, color: "#166534" };
const seasonsLabel = { fontSize: "13px", color: "#6b7280" };
const mainGrid = { display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "24px" };

const chartCard = {
  background: "#ffffff", borderRadius: "18px",
  padding: "20px", boxShadow: "0 12px 35px rgba(0,0,0,0.08)"
};

const cardHeader = {
  display: "flex", justifyContent: "space-between",
  alignItems: "center", marginBottom: "16px"
};

const cardTitle = { fontSize: "18px", fontWeight: 600, color: "#1f2937" };
const viewToggle = { display: "flex", gap: "8px" };

const activeView = {
  background: "#166534", color: "#fff",
  padding: "5px 12px", borderRadius: "8px", fontSize: "13px"
};

const inactiveView = { color: "#9ca3af", fontSize: "13px" };

const insightsCard = {
  background: "linear-gradient(180deg, #ffffff, #f0fdf4)",
  borderRadius: "18px", padding: "20px",
  boxShadow: "0 12px 35px rgba(0,0,0,0.06)"
};

const insightsList = { display: "flex", flexDirection: "column", gap: "14px", marginTop: "14px" };

const insight = {
  display: "flex", alignItems: "center", gap: "12px",
  padding: "12px", borderRadius: "12px", background: "#ecfdf5",
  fontSize: "14px", fontWeight: 500, color: "#065f46"
};

const insightIcon = {
  width: "34px", height: "34px", borderRadius: "10px",
  background: "#bbf7d0", display: "flex",
  alignItems: "center", justifyContent: "center"
};

const noData = { padding: "50px", textAlign: "center", color: "#6b7280" };
const noDataIcon = { fontSize: "36px", marginBottom: "10px" };

/* ─── Season Analysis Styles ─── */

const analysisSectionWrap = { marginTop: "40px" };

const sectionHeader = { marginBottom: "20px" };
const sectionTitle = { fontSize: "22px", fontWeight: 700, color: "#166534", margin: 0 };
const sectionSubtitle = { fontSize: "13px", color: "#6b7280", marginTop: "4px" };

const seasonCard = (isOpen) => ({
  background: "#ffffff",
  borderRadius: "16px",
  marginBottom: "14px",
  boxShadow: isOpen ? "0 12px 32px rgba(22,101,52,0.13)" : "0 4px 16px rgba(0,0,0,0.06)",
  border: isOpen ? "1.5px solid #86efac" : "1px solid #e5e7eb",
  overflow: "hidden",
  transition: "box-shadow 0.2s, border 0.2s"
});

const seasonCardHeader = {
  display: "flex", alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 22px",
  cursor: "pointer",
  userSelect: "none"
};

const seasonLeft = { display: "flex", alignItems: "center", gap: "14px" };

const BADGE_COLORS = ["#166534", "#0369a1", "#7c3aed", "#b45309", "#0f766e"];
const seasonBadge = (idx) => ({
  width: "36px", height: "36px", borderRadius: "10px",
  background: BADGE_COLORS[idx % BADGE_COLORS.length],
  color: "#fff", fontWeight: 700, fontSize: "15px",
  display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0
});

const seasonName = { fontSize: "16px", fontWeight: 700, color: "#1f2937" };
const seasonMeta = { fontSize: "12px", color: "#9ca3af", marginTop: "2px" };

const seasonQuickStats = {
  display: "flex", alignItems: "center",
  gap: "28px", flexWrap: "wrap"
};

const qStat = { display: "flex", flexDirection: "column", alignItems: "flex-end" };
const qLabel = { fontSize: "11px", color: "#9ca3af", fontWeight: 500 };
const qValue = (color) => ({ fontSize: "15px", fontWeight: 700, color });

const plBadge = (isProfit) => ({
  padding: "4px 10px", borderRadius: "8px",
  fontSize: "11px", fontWeight: 700,
  background: isProfit ? "#d1fae5" : "#fee2e2",
  color: isProfit ? "#065f46" : "#991b1b",
  letterSpacing: "0.05em"
});

const chevron = (isOpen) => ({
  fontSize: "12px", color: "#9ca3af",
  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  transition: "transform 0.2s"
});

const expandedBody = {
  padding: "0 22px 22px 22px",
  borderTop: "1px solid #f0fdf4"
};

const summaryRow = {
  display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
  gap: "14px", marginTop: "18px", marginBottom: "18px"
};

const summaryBox = (bg) => ({
  background: bg, borderRadius: "12px",
  padding: "14px 16px", display: "flex",
  alignItems: "center", gap: "12px"
});

const sumIcon = { fontSize: "22px" };
const sumLabel = { fontSize: "11px", color: "#6b7280", fontWeight: 500 };
const sumValue = { fontSize: "17px", fontWeight: 800, color: "#1f2937", marginTop: "2px" };

const chartSelectorRow = {
  display: "flex", alignItems: "center",
  gap: "14px", marginBottom: "16px"
};

const chartSelectorLabel = { fontSize: "13px", color: "#374151", fontWeight: 500 };

const chartBtn = (active) => ({
  padding: "8px 18px", borderRadius: "10px",
  border: "none", cursor: "pointer",
  fontSize: "13px", fontWeight: 600,
  background: active ? "#166534" : "#f0fdf4",
  color: active ? "#ffffff" : "#166534",
  transition: "all 0.15s"
});

const chartBox = {
  background: "#f9fafb", borderRadius: "14px",
  padding: "16px", border: "1px solid #e5e7eb",
  marginBottom: "18px"
};

const chartBoxTitle = {
  fontSize: "13px", fontWeight: 600,
  color: "#374151", marginBottom: "10px"
};

const plStatement = (isProfit) => ({
  display: "flex", alignItems: "center", gap: "10px",
  padding: "14px 16px", borderRadius: "12px",
  background: isProfit ? "#ecfdf5" : "#fef2f2",
  color: isProfit ? "#065f46" : "#991b1b",
  fontSize: "13px", fontWeight: 500,
  border: `1px solid ${isProfit ? "#bbf7d0" : "#fecaca"}`
});

const plStatIcon = { fontSize: "18px" };