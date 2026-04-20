import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {
  FiCalendar, FiTool, FiFileText, FiBell,
  FiShield, FiZap, FiUsers, FiMapPin,
  FiArrowRight, FiMail, FiPhone, FiGlobe,
  FiGithub, FiTwitter, FiLinkedin,
} from "react-icons/fi";

/* ── Feature cards data ─────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <FiCalendar size={22} />,
    title: "Resource Booking",
    desc: "Reserve labs, halls, and equipment in seconds. Real-time availability across all campus facilities.",
    color: "#3b82f6",
    bg: "#eff6ff",
    link: "/facilities",
  },
  {
    icon: <FiTool size={22} />,
    title: "Maintenance Tickets",
    desc: "Report and track facility issues. Get notified when your ticket is resolved by the technical team.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    link: "/tickets",
  },
  {
    icon: <FiFileText size={22} />,
    title: "My Bookings",
    desc: "View your complete booking history, upcoming reservations, and cancel with one click.",
    color: "#10b981",
    bg: "#ecfdf5",
    link: "/bookings",
  },
  {
    icon: <FiBell size={22} />,
    title: "Smart Notifications",
    desc: "Stay updated with real-time alerts for bookings, tickets, and campus announcements.",
    color: "#f59e0b",
    bg: "#fffbeb",
    link: "/notifications",
  },
  {
    icon: <FiShield size={22} />,
    title: "Secure Access",
    desc: "Role-based access control for students, technicians, managers, and admins.",
    color: "#ef4444",
    bg: "#fef2f2",
    link: "/profile",
  },
  {
    icon: <FiZap size={22} />,
    title: "Admin Dashboard",
    desc: "Full campus oversight — analytics, user management, and facility configuration.",
    color: "#06b6d4",
    bg: "#ecfeff",
    link: "/admin/dashboard",
  },
];

const STATS = [
  { value: "50+",  label: "Facilities",   icon: <FiMapPin size={18} /> },
  { value: "500+", label: "Active Users", icon: <FiUsers size={18} /> },
  { value: "99%",  label: "Uptime",       icon: <FiZap size={18} /> },
  { value: "24/7", label: "Support",      icon: <FiShield size={18} /> },
];

const FOOTER_LINKS = {
  Platform: [
    { label: "Resources",     to: "/facilities" },
    { label: "Bookings",      to: "/bookings" },
    { label: "Tickets",       to: "/tickets" },
    { label: "Notifications", to: "/notifications" },
  ],
  Account: [
    { label: "Sign In",    to: "/login" },
    { label: "Register",   to: "/register" },
    { label: "My Profile", to: "/profile" },
  ],
  Admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
  ],
};

/* ── Component ──────────────────────────────────────────────────────────── */
export default function Home() {
  const heroRef = useRef(null);

  /* subtle parallax on hero blobs */
  useEffect(() => {
    const onMove = e => {
      if (!heroRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      heroRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={S.page}>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section style={S.hero}>
        {/* animated background blobs */}
        <div style={S.blobWrap} ref={heroRef}>
          <div style={{ ...S.blob, ...S.blob1 }} />
          <div style={{ ...S.blob, ...S.blob2 }} />
          <div style={{ ...S.blob, ...S.blob3 }} />
        </div>
        <div style={S.heroGrid} />

        <div style={S.heroContent}>
          <div style={S.heroBadge}>
            <FiZap size={11} color="#e84545" />
            <span>Smart Campus Management System</span>
          </div>

          <h1 style={S.heroTitle}>
            Your Campus,<br />
            <span style={S.heroAccent}>Fully Connected</span>
          </h1>

          <p style={S.heroSub}>
            Book resources, raise tickets, track facilities — all in one unified
            platform designed for modern universities.
          </p>

          <div style={S.heroCTA}>
            <Link to="/facilities" style={S.ctaPrimary}>
              Explore Resources <FiArrowRight size={15} />
            </Link>
            <Link to="/bookings" style={S.ctaSecondary}>
              My Bookings
            </Link>
          </div>
        </div>

        {/* Hero visual card */}
        <div style={S.heroCard}>
          <div style={S.heroCardHeader}>
            <div style={S.hcDotGreen} />
            <div style={S.hcDotYellow} />
            <div style={S.hcDotRed} />
            <span style={S.hcTitle}>Campus Overview</span>
          </div>
          {[
            { label: "Lab A101",      status: "Available",   color: "#10b981" },
            { label: "Seminar Hall",  status: "Booked",      color: "#f59e0b" },
            { label: "IT Lab B",      status: "Available",   color: "#10b981" },
            { label: "Board Room",    status: "Maintenance", color: "#ef4444" },
            { label: "Gymnasium",     status: "Available",   color: "#10b981" },
          ].map(r => (
            <div key={r.label} style={S.hcRow}>
              <span style={S.hcLabel}>{r.label}</span>
              <span style={{ ...S.hcStatus, color: r.color, background: r.color + "18" }}>{r.status}</span>
            </div>
          ))}
          <div style={S.hcFooter}>
            <FiCalendar size={12} color="#94a3b8" />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>Live availability · Just now</span>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section style={S.stats}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ ...S.statItem, borderRight: i < STATS.length - 1 ? "1px solid #e8edf2" : "none" }}>
            <div style={S.statIcon}>{s.icon}</div>
            <span style={S.statValue}>{s.value}</span>
            <span style={S.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section style={S.features}>
        <div style={S.sectionHead}>
          <p style={S.sectionEyebrow}>Everything you need</p>
          <h2 style={S.sectionTitle}>Built for campus life</h2>
          <p style={S.sectionSub}>
            A unified platform that brings together resource booking, maintenance
            management, and real-time notifications.
          </p>
        </div>

        <div style={S.featureGrid}>
          {FEATURES.map(f => (
            <Link to={f.link} key={f.title} style={{ textDecoration: "none" }}>
              <div style={S.featureCard}>
                <div style={{ ...S.featureIcon, background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3 style={S.featureTitle}>{f.title}</h3>
                <p style={S.featureDesc}>{f.desc}</p>
                <div style={{ ...S.featureArrow, color: f.color }}>
                  Learn more <FiArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section style={S.ctaBanner}>
        <div style={S.ctaBannerInner}>
          <h2 style={S.ctaBannerTitle}>Ready to get started?</h2>
          <p style={S.ctaBannerSub}>
            Join hundreds of students and staff already using Smart Campus.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={S.bannerPrimary}>Create an account</Link>
            <Link to="/facilities" style={S.bannerSecondary}>Browse facilities</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.footerTop}>
            {/* Brand */}
            <div style={S.footerBrand}>
              <div style={S.footerLogo}>
                <div style={S.footerLogoIcon}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>SC</span>
                </div>
                <span style={S.footerLogoText}>Smart Campus</span>
              </div>
              <p style={S.footerTagline}>
                A modern campus resource management platform for universities
                and educational institutions.
              </p>
              <div style={S.socialRow}>
                {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                  <a key={i} href="#" style={S.socialLink}><Icon size={15} /></a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} style={S.footerCol}>
                <p style={S.footerColTitle}>{group}</p>
                {links.map(l => (
                  <Link key={l.label} to={l.to} style={S.footerLink}>{l.label}</Link>
                ))}
              </div>
            ))}

            {/* Contact */}
            <div style={S.footerCol}>
              <p style={S.footerColTitle}>Contact</p>
              {[
                { icon: <FiMail size={13} />,  text: "support@smartcampus.edu" },
                { icon: <FiPhone size={13} />, text: "+94 11 234 5678" },
                { icon: <FiGlobe size={13} />, text: "www.smartcampus.edu" },
              ].map(c => (
                <div key={c.text} style={S.footerContact}>
                  <span style={{ color: "#64748b", flexShrink: 0 }}>{c.icon}</span>
                  <span style={S.footerLink}>{c.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={S.footerBottom}>
            <p style={S.footerCopy}>
              ©️ {new Date().getFullYear()} Smart Campus · IT3030 PAF 2026 · Group 39
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(t => (
                <a key={t} href="#" style={S.footerBottomLink}>{t}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────────────────── */
const S = {
  page: { fontFamily: "'DM Sans','Segoe UI',sans-serif", background: "#fff", minHeight: "100vh" },

  /* Hero */
  hero: {
    position: "relative", overflow: "hidden",
    background: "#0f172a",
    padding: "80px 5% 80px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 40, flexWrap: "wrap",
    minHeight: 520,
  },
  blobWrap: { position: "absolute", inset: 0, pointerEvents: "none", transition: "transform 0.15s ease-out" },
  blob: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.25 },
  blob1: { width: 400, height: 400, background: "#e84545", top: -100, left: -100 },
  blob2: { width: 300, height: 300, background: "#c0392b", bottom: -80, right: 200 },
  blob3: { width: 250, height: 250, background: "#f08040", top: 50, right: -50 },
  heroGrid: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
    backgroundSize: "40px 40px",
  },
  heroContent: { position: "relative", zIndex: 2, maxWidth: 520 },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(232,69,69,0.15)", border: "1px solid rgba(232,69,69,0.35)",
    color: "#fca5a5", fontSize: 11, fontWeight: 600,
    padding: "5px 12px", borderRadius: 20, marginBottom: 20,
    letterSpacing: "0.03em",
  },
  heroTitle: {
    fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800,
    color: "#f1f5f9", lineHeight: 1.15, margin: "0 0 18px",
  },
  heroAccent: {
    background: "linear-gradient(135deg,#ef4444,#f08040)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: { color: "#94a3b8", fontSize: 15, lineHeight: 1.7, marginBottom: 32 },
  heroCTA: { display: "flex", gap: 12, flexWrap: "wrap" },
  ctaPrimary: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "linear-gradient(135deg,#e84545,#c0392b)",
    color: "#fff",
    padding: "11px 22px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, textDecoration: "none",
    boxShadow: "0 4px 14px rgba(232,69,69,0.45)",
  },
  ctaSecondary: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.08)", color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "11px 22px", borderRadius: 10,
    fontSize: 14, fontWeight: 500, textDecoration: "none",
  },

  /* Hero card */
  heroCard: {
    position: "relative", zIndex: 2,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    backdropFilter: "blur(16px)",
    borderRadius: 16, padding: "16px 20px",
    minWidth: 260, maxWidth: 320, width: "100%",
    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
  },
  heroCardHeader: {
    display: "flex", alignItems: "center", gap: 6,
    marginBottom: 14, paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  hcDotGreen:  { width: 8, height: 8, borderRadius: "50%", background: "#22c55e" },
  hcDotYellow: { width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" },
  hcDotRed:    { width: 8, height: 8, borderRadius: "50%", background: "#ef4444" },
  hcTitle: { fontSize: 11, color: "#94a3b8", fontWeight: 600, marginLeft: 4 },
  hcRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  hcLabel:  { fontSize: 12, color: "#e2e8f0", fontWeight: 500 },
  hcStatus: { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6 },
  hcFooter: {
    display: "flex", alignItems: "center", gap: 6,
    marginTop: 12, paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  /* Stats */
  stats: {
    display: "flex", justifyContent: "center", flexWrap: "wrap",
    background: "#f8fafc", borderBottom: "1px solid #e8edf2",
  },
  statItem: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "28px 48px", gap: 4, flex: "1 1 140px",
  },
  statIcon:  { color: "#e84545", marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: 800, color: "#0f172a" },
  statLabel: { fontSize: 12, color: "#64748b", fontWeight: 500 },

  /* Features */
  features: { padding: "80px 5%", background: "#fff" },
  sectionHead: { textAlign: "center", maxWidth: 560, margin: "0 auto 52px" },
  sectionEyebrow: {
    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
    color: "#e84545", textTransform: "uppercase", marginBottom: 8,
  },
  sectionTitle: { fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "#0f172a", marginBottom: 14 },
  sectionSub:   { color: "#64748b", fontSize: 15, lineHeight: 1.7 },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20, maxWidth: 1100, margin: "0 auto",
  },
  featureCard: {
    background: "#fff", border: "1px solid #e8edf2",
    borderRadius: 16, padding: "28px 24px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  featureIcon: {
    width: 48, height: 48, borderRadius: 12,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: { fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 8 },
  featureDesc:  { fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16 },
  featureArrow: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600 },

  /* CTA Banner */
  ctaBanner: {
    background: "linear-gradient(145deg,#e84545 0%,#c0392b 40%,#e05c32 80%,#f08040 100%)",
    padding: "64px 5%",
  },
  ctaBannerInner: { maxWidth: 560, margin: "0 auto", textAlign: "center" },
  ctaBannerTitle: { fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, color: "#fff", marginBottom: 12 },
  ctaBannerSub:   { color: "rgba(255,255,255,0.8)", fontSize: 15, marginBottom: 28, lineHeight: 1.6 },
  bannerPrimary: {
    display: "inline-flex", alignItems: "center",
    background: "#fff", color: "#c0392b",
    padding: "11px 24px", borderRadius: 10,
    fontSize: 14, fontWeight: 700, textDecoration: "none",
    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
  },
  bannerSecondary: {
    display: "inline-flex", alignItems: "center",
    background: "rgba(255,255,255,0.15)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.35)",
    padding: "11px 24px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, textDecoration: "none",
  },

  /* Footer */
  footer: { background: "#0f172a" },
  footerInner: { maxWidth: 1200, margin: "0 auto" },
  footerTop: {
    display: "flex", flexWrap: "wrap", gap: 40,
    padding: "52px 5% 40px",
    borderBottom: "1px solid #1e293b",
  },
  footerBrand:   { flex: "2 1 240px", minWidth: 220 },
  footerLogo:    { display: "flex", alignItems: "center", gap: 9, marginBottom: 14 },
  footerLogoIcon: {
    width: 30, height: 30, borderRadius: 8,
    background: "linear-gradient(135deg,#e84545,#c0392b)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 6px rgba(232,69,69,0.4)",
  },
  footerLogoText: { color: "#f1f5f9", fontWeight: 700, fontSize: 15 },
  footerTagline:  { color: "#64748b", fontSize: 13, lineHeight: 1.7, marginBottom: 18, maxWidth: 280 },
  socialRow:      { display: "flex", gap: 8 },
  socialLink: {
    width: 32, height: 32, borderRadius: 8,
    background: "#1e293b", border: "1px solid #334155",
    color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center",
    textDecoration: "none",
  },
  footerCol: { flex: "1 1 120px", minWidth: 120, display: "flex", flexDirection: "column", gap: 8 },
  footerColTitle: {
    fontSize: 11, fontWeight: 700, color: "#f1f5f9",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4,
  },
  footerLink:    { fontSize: 13, color: "#64748b", textDecoration: "none" },
  footerContact: { display: "flex", alignItems: "center", gap: 8 },
  footerBottom: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: 12,
    padding: "18px 5%",
    borderTop: "1px solid #1e293b",
    
  },
  footerCopy:       { fontSize: 12, color: "#475569" },
  footerBottomLink: { fontSize: 12, color: "#475569", textDecoration: "none" },
};