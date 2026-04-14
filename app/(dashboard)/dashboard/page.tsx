"use client";
// app/(dashboard)/dashboard/page.tsx
// MEOUF Main Dashboard — Pet Health Overview

import { useState, useEffect } from "react";
import {
  Heart, Zap, Droplets, Smile, Activity,
  Camera, FileText, AlertTriangle, Bell,
  TrendingUp, TrendingDown, Minus, ChevronRight,
  Plus, Stethoscope, Download, Sparkles, Clock
} from "lucide-react";

// ─── TYPES (simplified for demo) ────────────────────────────────
interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age_years: number;
  weight_kg: number;
  photo_url?: string;
  ai_risk_score: number;
  body_condition_score: number;
}

interface DailyLog {
  log_date: string;
  appetite: number;
  energy: number;
  stool_quality: number;
  mood: number;
  thirst: number;
  ai_health_score: number;
  ai_triage_level: string;
  ai_summary: string;
  ai_suggestions: {
    diet: { portion_adjustment: string; reasoning: string };
    activity: { duration_minutes: number; type: string; specific_activities: string[] };
    grooming: { priority: string; tasks: string[] };
  };
  ai_flags: Array<{ type: string; severity: string; message: string; action: string }>;
}

// ─── METRIC CONFIG ────────────────────────────────────────────
const METRICS = [
  { key: "appetite", label: "Appetite", icon: <Zap size={16} />, color: "#6B8F71" },
  { key: "energy", label: "Energy", icon: <Activity size={16} />, color: "#8FAF95" },
  { key: "mood", label: "Mood", icon: <Smile size={16} />, color: "#C9A84C" },
  { key: "stool_quality", label: "Stool", icon: <Heart size={16} />, color: "#B89070" },
  { key: "thirst", label: "Thirst", icon: <Droplets size={16} />, color: "#7BA3D4" },
];

const TRIAGE_CONFIG = {
  normal: { label: "All Clear", color: "#6B8F71", bg: "rgba(107,143,113,0.1)", icon: "✓" },
  watch: { label: "Watch Closely", color: "#C9A84C", bg: "rgba(201,168,76,0.1)", icon: "◎" },
  vet_soon: { label: "See Vet Soon", color: "#E07B54", bg: "rgba(224,123,84,0.1)", icon: "!" },
  emergency: { label: "EMERGENCY", color: "#D94F4F", bg: "rgba(217,79,79,0.1)", icon: "⚠" },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "trends" | "suggestions">("overview");

  // Mock data — replace with Supabase queries
  const pet: Pet = {
    id: "1",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    age_years: 4,
    weight_kg: 28.5,
    ai_risk_score: 2.1,
    body_condition_score: 5,
  };

  const todayLog: DailyLog = {
    log_date: new Date().toISOString().split("T")[0],
    appetite: 3,
    energy: 4,
    stool_quality: 3,
    mood: 4,
    thirst: 4,
    ai_health_score: 8.2,
    ai_triage_level: "watch",
    ai_summary:
      "Max is in good overall health today. Energy and mood are strong, but thirst is slightly elevated compared to his 30-day baseline (3.1 avg → 4 today). This may warrant monitoring over the next 48 hours.",
    ai_suggestions: {
      diet: {
        portion_adjustment: "maintain",
        reasoning: "Weight is stable and within target range. Maintain current portions.",
      },
      activity: {
        duration_minutes: 45,
        type: "walk",
        specific_activities: ["Morning park walk", "Evening fetch session", "Mental enrichment puzzle"],
      },
      grooming: {
        priority: "medium",
        tasks: ["Brush coat (3x/week for Golden)", "Check ears for moisture", "Trim nails if needed"],
      },
    },
    ai_flags: [
      {
        type: "thirst_elevated",
        severity: "warning",
        message: "Thirst is 30% above Max's typical baseline",
        action: "Monitor water intake for 48hrs. If persists, schedule vet visit.",
      },
    ],
  };

  const weekData = [
    { day: "Mon", score: 7.8 },
    { day: "Tue", score: 8.1 },
    { day: "Wed", score: 8.4 },
    { day: "Thu", score: 7.9 },
    { day: "Fri", score: 8.2 },
    { day: "Sat", score: 8.0 },
    { day: "Sun", score: 8.2 },
  ];

  const triage = TRIAGE_CONFIG[todayLog.ai_triage_level as keyof typeof TRIAGE_CONFIG];
  const maxScore = Math.max(...weekData.map((d) => d.score));
  const didCheckIn = true; // Replace with actual check

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sage: #6B8F71;
          --sage-light: #8FAF95;
          --sage-pale: #C5D8C8;
          --cream: #FAF6EF;
          --cream-dark: #F0E8D8;
          --bark: #3D2B1F;
          --bark-light: #6B5244;
          --gold: #C9A84C;
          --white: #FFFFFF;
          --text-primary: #2C1F1A;
          --text-muted: #8B7B72;
          --radius: 20px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          min-height: 100vh;
          color: var(--text-primary);
        }

        /* ─── TOP BAR ─── */
        .topbar {
          background: white;
          border-bottom: 1px solid rgba(61,43,31,0.07);
          padding: 0 32px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .topbar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          color: var(--bark);
          font-weight: 500;
        }

        .topbar-actions { display: flex; align-items: center; gap: 12px; }

        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid rgba(61,43,31,0.1);
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .icon-btn:hover { background: var(--cream); color: var(--sage); }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--sage), var(--sage-light));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          cursor: pointer;
        }

        /* ─── LAYOUT ─── */
        .dash-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          min-height: calc(100vh - 64px);
        }

        /* ─── SIDEBAR ─── */
        .sidebar {
          background: white;
          border-right: 1px solid rgba(61,43,31,0.07);
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sidebar-section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          padding: 12px 12px 6px;
          font-weight: 500;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 14px;
          font-weight: 400;
          transition: all 0.2s;
          text-decoration: none;
        }

        .nav-item:hover { background: var(--cream); color: var(--bark); }
        .nav-item.active { background: rgba(107,143,113,0.1); color: var(--sage); font-weight: 500; }

        .nav-badge {
          margin-left: auto;
          background: var(--sage);
          color: white;
          font-size: 10px;
          padding: 2px 7px;
          border-radius: 100px;
          font-weight: 600;
        }

        .emergency-btn {
          margin-top: auto;
          background: rgba(217, 79, 79, 0.08);
          border: 1px solid rgba(217,79,79,0.2);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          color: #D94F4F;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .emergency-btn:hover { background: rgba(217,79,79,0.12); }

        /* ─── MAIN CONTENT ─── */
        .main-content {
          padding: 32px;
          overflow-y: auto;
        }

        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .greeting {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--bark);
          line-height: 1.2;
        }

        .greeting-sub {
          font-size: 14px;
          color: var(--text-muted);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .checkin-cta {
          background: var(--sage);
          color: white;
          border: none;
          padding: 12px 22px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(107,143,113,0.3);
        }

        .checkin-cta:hover { background: var(--sage-light); transform: translateY(-1px); }

        /* ─── TRIAGE BANNER ─── */
        .triage-banner {
          border-radius: var(--radius);
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          border: 1px solid;
        }

        /* ─── GRID ─── */
        .dash-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .dash-grid-2 {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        /* ─── CARDS ─── */
        .card {
          background: white;
          border-radius: var(--radius);
          padding: 24px;
          border: 1px solid rgba(61,43,31,0.06);
        }

        .card-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ─── PET HERO CARD ─── */
        .pet-card {
          grid-column: span 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .pet-avatar-lg {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--sage-pale), var(--sage));
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          margin-bottom: 14px;
          box-shadow: 0 8px 20px rgba(107,143,113,0.25);
        }

        .pet-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 500;
          color: var(--bark);
          margin-bottom: 4px;
        }

        .pet-meta {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .pet-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          width: 100%;
        }

        .pet-stat {
          background: var(--cream);
          border-radius: 12px;
          padding: 10px;
          text-align: center;
        }

        .pet-stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: var(--bark);
        }

        .pet-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ─── SCORE CARD ─── */
        .score-display {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          margin-bottom: 8px;
        }

        .score-big {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          font-weight: 400;
          line-height: 1;
          color: var(--bark);
        }

        .score-denom {
          font-size: 20px;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .score-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: var(--sage);
          margin-bottom: 14px;
        }

        /* Circle progress */
        .score-ring-wrap {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
        }

        /* ─── METRICS CARD ─── */
        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .metric-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .metric-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(107,143,113,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sage);
          flex-shrink: 0;
        }

        .metric-info { flex: 1; }

        .metric-row-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--bark);
          display: flex;
          justify-content: space-between;
        }

        .metric-row-score {
          font-size: 12px;
          color: var(--text-muted);
        }

        .bar-track {
          height: 6px;
          background: var(--cream-dark);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease;
        }

        /* ─── WEEK CHART ─── */
        .week-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 80px;
          margin-top: 12px;
        }

        .chart-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          height: 100%;
          justify-content: flex-end;
        }

        .chart-bar {
          width: 100%;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(180deg, var(--sage), var(--sage-pale));
          transition: height 0.6s ease;
          position: relative;
        }

        .chart-bar.today {
          background: linear-gradient(180deg, var(--bark), var(--bark-light));
        }

        .chart-day {
          font-size: 10px;
          color: var(--text-muted);
          text-align: center;
        }

        /* ─── AI INSIGHT CARD ─── */
        .insight-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .insight-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(107,143,113,0.1);
          color: var(--sage);
          padding: 4px 10px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .insight-text {
          font-size: 15px;
          line-height: 1.7;
          color: var(--bark-light);
          margin-bottom: 14px;
        }

        /* ─── FLAGS ─── */
        .flag-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 8px;
        }

        .flag-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .flag-message { font-size: 13px; color: var(--bark); line-height: 1.5; }
        .flag-action { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

        /* ─── SUGGESTIONS ─── */
        .suggestion-tabs {
          display: flex;
          gap: 4px;
          background: var(--cream);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 16px;
        }

        .sug-tab {
          flex: 1;
          padding: 8px;
          border-radius: 9px;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .sug-tab.active {
          background: white;
          color: var(--sage);
          box-shadow: 0 1px 4px rgba(61,43,31,0.08);
        }

        .sug-content {
          font-size: 14px;
          color: var(--bark-light);
          line-height: 1.7;
        }

        .sug-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
        }

        .sug-list li {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: var(--bark-light);
        }

        .sug-list li::before {
          content: '→';
          color: var(--sage);
          flex-shrink: 0;
          font-weight: 600;
        }

        /* ─── ACTION BUTTONS ─── */
        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: auto;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid rgba(61,43,31,0.08);
          background: var(--cream);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: var(--bark-light);
          transition: all 0.2s;
        }

        .action-btn:hover { background: var(--cream-dark); color: var(--bark); }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1200px) {
          .dash-grid { grid-template-columns: 1fr 1fr; }
          .dash-grid-2 { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .dash-layout { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .main-content { padding: 20px; }
          .dash-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="dash-root">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="topbar-logo">meouf</div>
          <div className="topbar-actions">
            <button className="icon-btn" title="Notifications">
              <Bell size={16} />
            </button>
            <div className="user-avatar">J</div>
          </div>
        </header>

        <div className="dash-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="sidebar-section-label">Navigation</div>
            {[
              { icon: <Heart size={16} />, label: "Dashboard", href: "/dashboard", active: true },
              { icon: <Activity size={16} />, label: "Daily Check-in", href: "/checkin", badge: !didCheckIn ? "Today" : undefined },
              { icon: <TrendingUp size={16} />, label: "Trends", href: "/trends" },
              { icon: <Camera size={16} />, label: "Photo Scan", href: "/vision" },
              { icon: <FileText size={16} />, label: "Reports", href: "/report" },
              { icon: <Stethoscope size={16} />, label: "Vet Export", href: "/vet-export" },
            ].map((item) => (
              <a key={item.label} href={item.href} className={`nav-item ${item.active ? "active" : ""}`}>
                {item.icon}
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </a>
            ))}

            <div style={{ marginTop: "12px" }}>
              <div className="sidebar-section-label">My Pets</div>
              <div className="nav-item active">
                <span style={{ fontSize: "16px" }}>🐕</span>
                Max
                <span style={{ marginLeft: "auto", width: "8px", height: "8px", borderRadius: "50%", background: "var(--sage)", display: "block" }} />
              </div>
              <a href="/onboarding" className="nav-item">
                <Plus size={16} />
                Add pet
              </a>
            </div>

            <button className="emergency-btn" onClick={() => window.location.href = "/triage"}>
              <AlertTriangle size={16} />
              Emergency Triage
            </button>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            {/* PAGE HEADER */}
            <div className="page-header">
              <div>
                <h1 className="greeting serif">Good morning, Jamie 🌿</h1>
                <div className="greeting-sub">
                  <Clock size={13} />
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </div>
              </div>
              {!didCheckIn && (
                <button className="checkin-cta" onClick={() => window.location.href = "/checkin"}>
                  <Zap size={15} />
                  Today's Check-in
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "2px 7px", fontSize: "11px" }}>30s</span>
                </button>
              )}
            </div>

            {/* TRIAGE BANNER */}
            {todayLog.ai_triage_level !== "normal" && (
              <div
                className="triage-banner"
                style={{
                  background: triage.bg,
                  borderColor: triage.color + "33",
                  color: triage.color,
                }}
              >
                <span style={{ fontSize: "22px" }}>{triage.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>{triage.label}</div>
                  <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "2px" }}>
                    {todayLog.ai_flags[0]?.message}
                  </div>
                </div>
                <button
                  style={{
                    background: "transparent",
                    border: `1px solid ${triage.color}44`,
                    color: triage.color,
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "12px",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 500,
                  }}
                >
                  View Details
                </button>
              </div>
            )}

            {/* ROW 1: Pet · Score · Metrics */}
            <div className="dash-grid">
              {/* Pet Card */}
              <div className="card pet-card">
                <div className="pet-avatar-lg">🐕</div>
                <div className="pet-name serif">{pet.name}</div>
                <div className="pet-meta">{pet.breed} · {pet.age_years} yrs</div>
                <div className="pet-stats">
                  <div className="pet-stat">
                    <div className="pet-stat-value serif">{pet.weight_kg}kg</div>
                    <div className="pet-stat-label">Weight</div>
                  </div>
                  <div className="pet-stat">
                    <div className="pet-stat-value serif">{pet.body_condition_score}/9</div>
                    <div className="pet-stat-label">BCS</div>
                  </div>
                </div>
                <div style={{ marginTop: "16px", width: "100%" }}>
                  <div className="action-grid">
                    <button className="action-btn" onClick={() => window.location.href = "/vision"}>
                      <Camera size={13} /> Photo Scan
                    </button>
                    <button className="action-btn" onClick={() => window.location.href = "/vet-export"}>
                      <Download size={13} /> Vet Export
                    </button>
                  </div>
                </div>
              </div>

              {/* Health Score Card */}
              <div className="card">
                <div className="card-label">
                  <Sparkles size={12} />
                  Today's Health Score
                </div>
                <div className="score-display">
                  <div className="score-big serif">{todayLog.ai_health_score}</div>
                  <div className="score-denom">/10</div>
                </div>
                <div className="score-trend">
                  <TrendingUp size={14} />
                  +0.4 from yesterday
                </div>

                {/* Week sparkline */}
                <div className="card-label" style={{ marginTop: "16px" }}>7-Day Trend</div>
                <div className="week-chart">
                  {weekData.map((d, i) => (
                    <div className="chart-col" key={d.day}>
                      <div
                        className={`chart-bar ${i === weekData.length - 1 ? "today" : ""}`}
                        style={{
                          height: `${(d.score / 10) * 64}px`,
                        }}
                        title={`${d.day}: ${d.score}`}
                      />
                      <div className="chart-day">{d.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Card */}
              <div className="card">
                <div className="card-label">Today's Metrics</div>
                <div className="metrics-list">
                  {METRICS.map((m) => {
                    const score = todayLog[m.key as keyof DailyLog] as number;
                    return (
                      <div className="metric-row" key={m.key}>
                        <div className="metric-icon-wrap" style={{ color: m.color, background: m.color + "15" }}>
                          {m.icon}
                        </div>
                        <div className="metric-info">
                          <div className="metric-row-label">
                            {m.label}
                            <span>{score}/5</span>
                          </div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{
                                width: `${(score / 5) * 100}%`,
                                background: `linear-gradient(90deg, ${m.color}, ${m.color}99)`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ROW 2: AI Insight · Suggestions */}
            <div className="dash-grid-2">
              {/* AI Insight */}
              <div className="card">
                <div className="insight-header">
                  <div className="insight-badge">
                    <Sparkles size={10} />
                    AI Analysis
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
                    GPT-4o · just now
                  </span>
                </div>
                <p className="insight-text">{todayLog.ai_summary}</p>

                {/* Flags */}
                {todayLog.ai_flags.map((flag, i) => (
                  <div
                    key={i}
                    className="flag-item"
                    style={{
                      background:
                        flag.severity === "warning"
                          ? "rgba(201,168,76,0.08)"
                          : flag.severity === "urgent"
                          ? "rgba(224,123,84,0.08)"
                          : "rgba(107,143,113,0.06)",
                    }}
                  >
                    <div
                      className="flag-dot"
                      style={{
                        background:
                          flag.severity === "warning"
                            ? "#C9A84C"
                            : flag.severity === "urgent"
                            ? "#E07B54"
                            : "#6B8F71",
                      }}
                    />
                    <div>
                      <div className="flag-message">{flag.message}</div>
                      <div className="flag-action">{flag.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div className="card-label">Today's Recommendations</div>
                <div className="suggestion-tabs">
                  {(["diet", "activity", "grooming"] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`sug-tab ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab as any)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="sug-content">
                  {activeTab === "diet" && (
                    <>
                      <div style={{ fontWeight: 500, color: "var(--bark)", marginBottom: "6px", fontSize: "13px" }}>
                        Portions: <span style={{ color: "var(--sage)" }}>Maintain</span>
                      </div>
                      <p style={{ fontSize: "13px", marginBottom: "10px" }}>
                        {todayLog.ai_suggestions.diet.reasoning}
                      </p>
                      <ul className="sug-list">
                        {todayLog.ai_suggestions.diet.specific_foods?.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {activeTab === "activity" && (
                    <>
                      <div style={{ fontWeight: 500, color: "var(--bark)", marginBottom: "6px", fontSize: "13px" }}>
                        {todayLog.ai_suggestions.activity.duration_minutes} min ·{" "}
                        <span style={{ color: "var(--sage)", textTransform: "capitalize" }}>
                          {todayLog.ai_suggestions.activity.type}
                        </span>
                      </div>
                      <ul className="sug-list">
                        {todayLog.ai_suggestions.activity.specific_activities?.map((a) => (
                          <li key={a}>{a}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {activeTab === "grooming" && (
                    <>
                      <div style={{ fontWeight: 500, color: "var(--bark)", marginBottom: "6px", fontSize: "13px" }}>
                        Priority:{" "}
                        <span
                          style={{
                            color:
                              todayLog.ai_suggestions.grooming.priority === "high"
                                ? "#E07B54"
                                : "var(--sage)",
                            textTransform: "capitalize",
                          }}
                        >
                          {todayLog.ai_suggestions.grooming.priority}
                        </span>
                      </div>
                      <ul className="sug-list">
                        {todayLog.ai_suggestions.grooming.tasks?.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
