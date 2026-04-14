"use client";
// app/(auth)/login/LandingClient.tsx
// Full landing page with Google Auth — Meouf Brand

import { useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import {
  Heart, Zap, Shield, Camera, FileText, Bell,
  Star, ArrowRight, Stethoscope, Sparkles, ChevronRight
} from "lucide-react";

export default function LandingClient() {
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserClient();

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --sage: #6B8F71;
          --sage-light: #8FAF95;
          --sage-pale: #C5D8C8;
          --cream: #FAF6EF;
          --cream-dark: #F0E8D8;
          --bark: #3D2B1F;
          --bark-light: #6B5244;
          --gold: #C9A84C;
          --gold-light: #E5C87A;
          --white: #FFFFFF;
          --text-primary: #2C1F1A;
          --text-muted: #8B7B72;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text-primary);
          overflow-x: hidden;
        }

        .serif { font-family: 'Cormorant Garamond', serif; }

        /* ─── NOISE TEXTURE OVERLAY ─── */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1000;
        }

        /* ─── NAVIGATION ─── */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 20px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(250, 246, 239, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(107, 143, 113, 0.12);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-mark {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--sage), var(--sage-light));
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.5px;
        }

        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--bark);
          letter-spacing: 0.5px;
        }

        .nav-cta {
          background: var(--bark);
          color: var(--cream);
          border: none;
          padding: 10px 24px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }

        .nav-cta:hover { background: var(--bark-light); transform: translateY(-1px); }

        /* ─── HERO SECTION ─── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 0 48px;
          padding-top: 80px;
          gap: 80px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(107, 143, 113, 0.12);
          border: 1px solid rgba(107, 143, 113, 0.3);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 500;
          color: var(--sage);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(52px, 6vw, 80px);
          font-weight: 400;
          line-height: 1.05;
          color: var(--bark);
          margin-bottom: 24px;
          letter-spacing: -1px;
        }

        .hero-title em {
          font-style: italic;
          color: var(--sage);
        }

        .hero-subtitle {
          font-size: 17px;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 480px;
          margin-bottom: 44px;
          font-weight: 300;
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .btn-google {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--white);
          border: 1.5px solid rgba(61, 43, 31, 0.15);
          padding: 14px 28px;
          border-radius: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: var(--bark);
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 2px 12px rgba(61, 43, 31, 0.08);
          position: relative;
          overflow: hidden;
        }

        .btn-google::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(107,143,113,0.06), rgba(201,168,76,0.06));
          opacity: 0;
          transition: opacity 0.25s;
        }

        .btn-google:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(61, 43, 31, 0.14);
          border-color: var(--sage-pale);
        }

        .btn-google:hover::before { opacity: 1; }

        .btn-google:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .google-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(107,143,113,0.3);
          border-top-color: var(--sage);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .hero-trust {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--text-muted);
        }

        /* ─── HERO VISUAL (right column) ─── */
        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .phone-mockup {
          width: 320px;
          background: white;
          border-radius: 40px;
          padding: 24px;
          box-shadow: 
            0 40px 80px rgba(61, 43, 31, 0.15),
            0 0 0 1px rgba(61,43,31,0.05);
          position: relative;
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-12px) rotate(-2deg); }
        }

        .mockup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .mockup-pet-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mockup-avatar {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, var(--sage-pale), var(--sage));
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .mockup-score {
          background: linear-gradient(135deg, var(--sage), #4A7A52);
          color: white;
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 22px;
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
        }

        .mockup-score small {
          font-size: 11px;
          font-family: 'DM Sans', sans-serif;
          opacity: 0.8;
          display: block;
        }

        .metric-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 16px 0;
        }

        .metric-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .metric-label {
          font-size: 11px;
          color: var(--text-muted);
          width: 52px;
          flex-shrink: 0;
        }

        .metric-track {
          flex: 1;
          height: 6px;
          background: var(--cream-dark);
          border-radius: 3px;
          overflow: hidden;
        }

        .metric-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, var(--sage), var(--sage-light));
        }

        .ai-insight-bubble {
          background: linear-gradient(135deg, rgba(107,143,113,0.1), rgba(201,168,76,0.08));
          border: 1px solid rgba(107,143,113,0.2);
          border-radius: 14px;
          padding: 12px 14px;
          margin-top: 12px;
        }

        .insight-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--sage);
          font-weight: 600;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .insight-text {
          font-size: 12px;
          color: var(--bark);
          line-height: 1.5;
        }

        /* Floating badges around phone */
        .floating-badge {
          position: absolute;
          background: white;
          border-radius: 14px;
          padding: 10px 14px;
          box-shadow: 0 8px 24px rgba(61,43,31,0.12);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--bark);
          animation: floatBadge 4s ease-in-out infinite;
          white-space: nowrap;
        }

        .badge-1 { top: 10%; right: -60px; animation-delay: 0s; }
        .badge-2 { bottom: 20%; left: -70px; animation-delay: 1.5s; }
        .badge-3 { top: 45%; right: -55px; animation-delay: 0.8s; }

        @keyframes floatBadge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* ─── FEATURES SECTION ─── */
        .section {
          padding: 120px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-eyebrow {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .section-divider {
          width: 40px;
          height: 1px;
          background: var(--sage-pale);
        }

        .section-eyebrow span {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--sage);
          font-weight: 500;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 400;
          text-align: center;
          color: var(--bark);
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .section-subtitle {
          text-align: center;
          font-size: 16px;
          color: var(--text-muted);
          max-width: 560px;
          margin: 0 auto 64px;
          line-height: 1.7;
          font-weight: 300;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          background: white;
          border-radius: 24px;
          padding: 36px 32px;
          border: 1px solid rgba(61,43,31,0.06);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--sage), var(--sage-light));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(61,43,31,0.1);
        }

        .feature-card:hover::before { opacity: 1; }

        .feature-icon {
          width: 52px;
          height: 52px;
          background: rgba(107,143,113,0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--sage);
          margin-bottom: 20px;
        }

        .feature-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--bark);
          margin-bottom: 10px;
        }

        .feature-desc {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-muted);
          font-weight: 300;
        }

        /* ─── HOW IT WORKS ─── */
        .steps-section {
          background: var(--bark);
          padding: 120px 48px;
          position: relative;
          overflow: hidden;
        }

        .steps-section::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(107,143,113,0.2) 0%, transparent 70%);
        }

        .steps-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .steps-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 400;
          text-align: center;
          color: var(--cream);
          margin-bottom: 72px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          position: relative;
        }

        .step-card {
          position: relative;
          text-align: center;
        }

        .step-number {
          width: 56px;
          height: 56px;
          background: rgba(107,143,113,0.2);
          border: 1px solid rgba(107,143,113,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: var(--sage-light);
          margin: 0 auto 20px;
        }

        .step-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          color: var(--cream);
          margin-bottom: 10px;
        }

        .step-desc {
          font-size: 13px;
          color: rgba(250,246,239,0.5);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ─── SOCIAL PROOF ─── */
        .testimonials {
          padding: 120px 48px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial-card {
          background: white;
          border-radius: 20px;
          padding: 28px;
          border: 1px solid rgba(61,43,31,0.06);
        }

        .stars {
          color: var(--gold);
          font-size: 14px;
          margin-bottom: 14px;
        }

        .testimonial-text {
          font-size: 15px;
          line-height: 1.7;
          color: var(--bark-light);
          margin-bottom: 18px;
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .author-avatar {
          width: 36px;
          height: 36px;
          background: var(--cream-dark);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .author-name { font-size: 13px; font-weight: 500; color: var(--bark); }
        .author-pet { font-size: 12px; color: var(--text-muted); }

        /* ─── FINAL CTA ─── */
        .final-cta {
          padding: 120px 48px;
          text-align: center;
          background: linear-gradient(180deg, var(--cream) 0%, var(--cream-dark) 100%);
        }

        .cta-box {
          max-width: 640px;
          margin: 0 auto;
          background: white;
          border-radius: 32px;
          padding: 64px;
          box-shadow: 0 24px 80px rgba(61,43,31,0.1);
          border: 1px solid rgba(107,143,113,0.15);
        }

        .cta-paw {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;
        }

        .cta-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          font-weight: 400;
          color: var(--bark);
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .cta-subtitle {
          font-size: 15px;
          color: var(--text-muted);
          margin-bottom: 36px;
          line-height: 1.7;
          font-weight: 300;
        }

        .cta-features {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .cta-feature {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--sage);
          font-weight: 500;
        }

        /* ─── FOOTER ─── */
        footer {
          background: var(--bark);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: var(--cream);
          font-weight: 400;
        }

        .footer-links {
          display: flex;
          gap: 24px;
        }

        .footer-links a {
          font-size: 13px;
          color: rgba(250,246,239,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-links a:hover { color: var(--cream); }

        .footer-copy {
          font-size: 12px;
          color: rgba(250,246,239,0.35);
        }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .hero { grid-template-columns: 1fr; padding-top: 120px; text-align: center; }
          .hero-subtitle { margin: 0 auto 44px; }
          .hero-cta-group { justify-content: center; }
          .hero-visual { display: none; }
          .features-grid { grid-template-columns: repeat(2, 1fr); }
          .steps-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .badge-1, .badge-2, .badge-3 { display: none; }
        }

        @media (max-width: 640px) {
          nav { padding: 16px 24px; }
          .section { padding: 80px 24px; }
          .steps-section { padding: 80px 24px; }
          .testimonials { padding: 80px 24px; }
          .final-cta { padding: 60px 24px; }
          .cta-box { padding: 40px 24px; }
          footer { flex-direction: column; gap: 16px; text-align: center; }
          .features-grid { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAVIGATION */}
      <nav>
        <div className="nav-logo">
          <div className="logo-mark">M</div>
          <span className="logo-text">meouf</span>
        </div>
        <button className="nav-cta" onClick={handleGoogleLogin} disabled={loading}>
          Get Started Free
        </button>
      </nav>

      {/* HERO */}
      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <Sparkles size={12} />
              <span>AI-Powered Pet Health Intelligence</span>
            </div>
            <h1 className="hero-title serif">
              Know your pet's<br />
              health <em>before</em><br />
              they do.
            </h1>
            <p className="hero-subtitle">
              Meouf detects micro-shifts in your pet's daily wellbeing with
              a 30-second check-in. Powered by veterinary AI that learns
              your pet's unique baseline.
            </p>
            <div className="hero-cta-group">
              <button
                className="btn-google"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <div className="btn-loading">
                    <div className="spinner" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    <svg className="google-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
              <div className="hero-trust">
                <Shield size={13} style={{ color: "var(--sage)" }} />
                <span style={{ fontSize: "13px" }}>Free forever • No credit card</span>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="hero-visual">
            <div style={{ position: "relative" }}>
              <div className="phone-mockup">
                <div className="mockup-header">
                  <div className="mockup-pet-info">
                    <div className="mockup-avatar">🐕</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--bark)" }}>Max</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Golden Retriever · 4yr</div>
                    </div>
                  </div>
                  <div className="mockup-score">
                    8.4
                    <small>/ 10</small>
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Today's Metrics
                </div>
                <div className="metric-bars">
                  {[
                    { label: "Appetite", val: 80 },
                    { label: "Energy", val: 90 },
                    { label: "Mood", val: 85 },
                    { label: "Stool", val: 70 },
                    { label: "Thirst", val: 75 },
                  ].map((m) => (
                    <div className="metric-bar-row" key={m.label}>
                      <span className="metric-label">{m.label}</span>
                      <div className="metric-track">
                        <div className="metric-fill" style={{ width: `${m.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ai-insight-bubble">
                  <div className="insight-label">
                    <Sparkles size={8} />
                    AI Insight
                  </div>
                  <div className="insight-text">
                    Max's appetite is slightly below his 30-day average. Monitor over the next 24hrs.
                  </div>
                </div>
              </div>

              <div className="floating-badge badge-1" style={{ color: "var(--sage)", fontSize: "13px" }}>
                <Heart size={14} style={{ color: "var(--sage)" }} />
                Score: 8.4/10
              </div>
              <div className="floating-badge badge-2">
                <Bell size={14} style={{ color: "var(--gold)" }} />
                Reminder sent ✓
              </div>
              <div className="floating-badge badge-3">
                <FileText size={14} style={{ color: "var(--sage)" }} />
                Weekly PDF ready
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section">
          <div className="section-eyebrow">
            <div className="section-divider" />
            <span>What Meouf Does</span>
            <div className="section-divider" />
          </div>
          <h2 className="section-title serif">
            Veterinary intelligence,<br /><em>simplified</em>
          </h2>
          <p className="section-subtitle">
            Everything you need to stay ahead of your pet's health — from daily micro-shifts
            to vet-ready reports.
          </p>

          <div className="features-grid">
            {[
              {
                icon: <Zap size={24} />,
                title: "30-Second Daily Check-in",
                desc: "Five simple questions about appetite, energy, stool, mood, and thirst. Takes less time than filling their bowl.",
              },
              {
                icon: <Sparkles size={24} />,
                title: "Micro-Shift Detection",
                desc: "Our AI builds your pet's unique health baseline and flags subtle deviations days before symptoms become visible.",
              },
              {
                icon: <Camera size={24} />,
                title: "Vision Body Score",
                desc: "Weekly photo upload analyzed by GPT-4o Vision to assess body condition score and coat health automatically.",
              },
              {
                icon: <Heart size={24} />,
                title: "Personalized Suggestions",
                desc: "Specific portion sizes, walk durations, and grooming reminders tailored to your pet's breed, age, and today's data.",
              },
              {
                icon: <FileText size={24} />,
                title: "Weekly PDF Reports",
                desc: "Beautiful health reports emailed every Monday. Formatted for easy sharing with your veterinarian.",
              },
              {
                icon: <Stethoscope size={24} />,
                title: "Emergency Triage Mode",
                desc: "Instant AI assessment of any symptom. Know within seconds if it's an ER emergency or safe to monitor at home.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title serif">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <div className="steps-section">
          <div className="steps-inner">
            <h2 className="steps-title serif">
              Your pet. <em style={{ color: "var(--sage-light)" }}>Understood.</em>
            </h2>
            <div className="steps-grid">
              {[
                {
                  n: "01",
                  title: "Add Your Pet",
                  desc: "2-minute onboarding: species, breed, age, weight, and health history.",
                },
                {
                  n: "02",
                  title: "Daily 30s Check-in",
                  desc: "Answer 5 quick questions. We build your pet's baseline over the first week.",
                },
                {
                  n: "03",
                  title: "AI Analysis",
                  desc: "GPT-4o compares today's data against baseline, detects micro-shifts.",
                },
                {
                  n: "04",
                  title: "Act on Insights",
                  desc: "Get tailored diet, activity, and grooming suggestions. Share with your vet.",
                },
              ].map((s) => (
                <div className="step-card" key={s.n}>
                  <div className="step-number serif">{s.n}</div>
                  <div className="step-title serif">{s.title}</div>
                  <p className="step-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <div className="section-eyebrow">
            <div className="section-divider" />
            <span>From Pet Parents</span>
            <div className="section-divider" />
          </div>
          <h2 className="section-title serif" style={{ marginBottom: "48px" }}>
            Trusted by <em>10,000+</em> pet families
          </h2>
          <div className="testimonials-grid">
            {[
              {
                emoji: "🐱",
                text: "Meouf flagged that my cat Luna's thirst was trending up over 4 days. I wouldn't have noticed. Turns out she had early kidney issues — caught it so early, her vet was amazed.",
                name: "Sarah M.",
                pet: "Luna, Siamese Cat, 7yr",
              },
              {
                emoji: "🐶",
                text: "The weekly PDF report is incredible. I just hand my phone to the vet and say 'here's the last 3 months'. Saves so much time and they actually love how detailed it is.",
                name: "James R.",
                pet: "Bruno, Labrador, 3yr",
              },
              {
                emoji: "🐈",
                text: "Emergency triage mode is worth the app alone. At 2am when my cat was acting weird, it told me 'this can wait until morning, here's what to watch for'. I didn't panic, I slept.",
                name: "Priya K.",
                pet: "Mochi, British Shorthair, 5yr",
              },
            ].map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="stars">★★★★★</div>
                <p className="testimonial-text serif">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.emoji}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-pet">{t.pet}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <div className="final-cta">
          <div className="cta-box">
            <span className="cta-paw">🐾</span>
            <h2 className="cta-title serif">
              Start tracking<br /><em>today, for free</em>
            </h2>
            <p className="cta-subtitle">
              Set up your pet's profile in 2 minutes. No credit card required.
              Your first week of AI insights is completely free.
            </p>
            <div className="cta-features">
              {["Unlimited check-ins", "AI analysis", "Weekly PDF", "Emergency triage"].map((f) => (
                <div className="cta-feature" key={f}>
                  <Star size={12} fill="currentColor" />
                  {f}
                </div>
              ))}
            </div>
            <button
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{ margin: "0 auto", display: "flex" }}
            >
              {loading ? (
                <div className="btn-loading">
                  <div className="spinner" />
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google — it's free
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">meouf</div>
        <nav className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/blog">Blog</a>
          <a href="mailto:hello@meouf.com">Contact</a>
        </nav>
        <div className="footer-copy">© 2025 Meouf · Made with 🐾</div>
      </footer>
    </>
  );
}
