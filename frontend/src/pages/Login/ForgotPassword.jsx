import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
* { font-family: 'DM Sans', 'Segoe UI', sans-serif; box-sizing: border-box; }
input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; outline: none; }
button:hover:not(:disabled) { opacity: 0.88; }
`;

const S = {
    page: {
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        overflow: "hidden",
    },

    /* ── Left Panel ── */
    leftPanel: {
        width: "42%",
        minHeight: "100vh",
        background: "linear-gradient(145deg, #e84545 0%, #c0392b 40%, #e05c32 80%, #f08040 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    leftInner: { position: "relative", zIndex: 2, padding: "3rem 2.5rem", width: "100%" },
    circleTopRight: {
        position: "absolute", top: "-80px", right: "-80px",
        width: 300, height: 300, borderRadius: "50%",
        background: "rgba(255,255,255,0.08)", pointerEvents: "none",
    },
    circleMidLeft: {
        position: "absolute", top: "38%", left: "-60px",
        width: 220, height: 220, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", pointerEvents: "none",
    },
    circleBottomRight: {
        position: "absolute", bottom: "-60px", right: "10%",
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(255,255,255,0.07)", pointerEvents: "none",
    },
    circleSmall: {
        position: "absolute", top: "22%", right: "15%",
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(255,255,255,0.1)", pointerEvents: "none",
    },
    leftContent: { position: "relative", zIndex: 3 },
    leftLogo: {
        display: "flex", alignItems: "center", gap: 10,
        marginBottom: "3rem",
    },
    leftLogoMark: {
        width: 34, height: 34, borderRadius: 9,
        background: "rgba(255,255,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(4px)",
    },
    leftHeading: {
        fontSize: 34, fontWeight: 700, color: "#fff",
        marginBottom: 14, lineHeight: 1.2, letterSpacing: "-0.5px",
    },
    leftSubtext: {
        fontSize: 14, color: "rgba(255,255,255,0.8)",
        lineHeight: 1.65, marginBottom: 32, maxWidth: 300,
    },
    leftBadge: {
        display: "inline-flex", alignItems: "center", gap: 7,
        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
        borderRadius: 30, padding: "7px 14px",
        fontSize: 13, color: "#fff", fontWeight: 500,
        border: "1px solid rgba(255,255,255,0.2)",
    },

    /* ── Right Panel ── */
    rightPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        padding: "2rem 1.5rem",
        overflowY: "auto",
    },
    formCard: {
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #e8edf2",
        padding: "2.5rem 2.25rem",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
    },
    logoRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" },
    logoMark: {
        width: 36, height: 36, borderRadius: 10,
        background: "linear-gradient(135deg, #1e293b, #334155)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(30,41,59,0.3)",
    },
    logoText: { fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },

    iconCircle: {
        width: 56, height: 56, borderRadius: "50%",
        background: "linear-gradient(135deg, #fef3c7, #fde68a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginBottom: "1.25rem",
        border: "1px solid #fcd34d",
    },
    title: {
        fontSize: 26, fontWeight: 700, color: "#0f172a",
        marginBottom: 6, letterSpacing: "-0.5px",
    },
    subtitle: {
        fontSize: 14, color: "#64748b",
        marginBottom: "1.75rem", lineHeight: 1.6,
    },
    label: {
        display: "block", fontSize: 13, fontWeight: 600,
        color: "#374151", marginBottom: 6,
    },
    fieldGroup: { marginBottom: "1.25rem" },
    inputWrap: { position: "relative", display: "flex", alignItems: "center" },
    inputIcon: {
        position: "absolute", left: 11, pointerEvents: "none",
        display: "flex", alignItems: "center",
    },
    input: {
        width: "100%", padding: "10px 40px 10px 36px",
        borderRadius: 10, border: "1.5px solid #e2e8f0",
        fontSize: 14, color: "#0f172a", outline: "none",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        boxSizing: "border-box", background: "#f8fafc",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    inputErr: { borderColor: "#f87171", background: "#fff5f5" },
    errText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
    submitBtn: {
        width: "100%", padding: "11px",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#fff", border: "none", borderRadius: 10,
        fontSize: 14, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        letterSpacing: "0.01em",
        boxShadow: "0 2px 12px rgba(15,23,42,0.3)",
        transition: "opacity 0.2s",
    },
    submitDisabled: { opacity: 0.65, cursor: "not-allowed" },
    successBox: {
        background: "#f0fdf4",
        border: "1.5px solid #bbf7d0",
        borderRadius: 12, padding: "16px 18px",
        marginBottom: "1.5rem",
        display: "flex", alignItems: "flex-start", gap: 10,
    },
    successText: {
        fontSize: 13, color: "#15803d", lineHeight: 1.55, fontWeight: 500,
    },
    backLink: {
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, marginTop: "1.25rem",
        fontSize: 13, color: "#3b82f6",
        textDecoration: "none", fontWeight: 600,
    },
    divider: { display: "flex", alignItems: "center", gap: 10, margin: "1.25rem 0" },
    divLine: { flex: 1, height: 1, background: "#e2e8f0" },
};

export default function ForgotPassword() {
    const [email, setEmail]     = useState("");
    const [sent, setSent]       = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim()) { setError("Please enter your email address."); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await axios.post("/api/auth/forgot-password", { email: email.trim().toLowerCase() });
            setSent(true);
        } catch {
            setError("Could not send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{fontStyle}</style>
            <div style={S.page}>

                {/* ── Left Panel ── */}
                <div style={S.leftPanel}>
                    <div style={S.leftInner}>
                        <div style={S.circleTopRight} />
                        <div style={S.circleMidLeft} />
                        <div style={S.circleBottomRight} />
                        <div style={S.circleSmall} />

                        <div style={S.leftContent}>
                            <div style={S.leftLogo}>
                                <div style={S.leftLogoMark}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>SC</span>
                                </div>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Smart Campus</span>
                            </div>
                            <h2 style={S.leftHeading}>Forgot your password?</h2>
                            <p style={S.leftSubtext}>
                                No worries — it happens to everyone. Enter your email and we'll send you a secure link to reset your password right away.
                            </p>
                            <div style={S.leftBadge}>
                                <span>🔒</span>
                                <span>Secure password reset</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div style={S.rightPanel}>
                    <div style={S.formCard}>

                        {/* Logo */}
                        <div style={S.logoRow}>
                            <div style={S.logoMark}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>SC</span>
                            </div>
                            <span style={S.logoText}>Smart Campus</span>
                        </div>

                        {/* Icon */}
                        <div style={S.iconCircle}>🔑</div>

                        <h1 style={S.title}>Reset password</h1>
                        <p style={S.subtitle}>
                            Enter the email address linked to your account and we'll send you a password reset link.
                        </p>

                        {sent ? (
                            <>
                                <div style={S.successBox}>
                                    <span style={{ fontSize: 18 }}>✅</span>
                                    <p style={S.successText}>
                                        Reset link sent! Check your inbox at <strong>{email}</strong>. Don't forget to check your spam folder too.
                                    </p>
                                </div>
                                <button
                                    style={S.submitBtn}
                                    onClick={() => { setSent(false); setEmail(""); }}
                                >
                                    Send to a different email
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate>
                                <div style={S.fieldGroup}>
                                    <label style={S.label}>Email address</label>
                                    <div style={S.inputWrap}>
                                        <span style={S.inputIcon}>
                                            {/* Mail icon inline SVG to avoid extra imports */}
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#94a3b8" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <input
                                            style={{ ...S.input, ...(error ? S.inputErr : {}) }}
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                            autoComplete="email"
                                            autoFocus
                                        />
                                    </div>
                                    {error && <p style={S.errText}>{error}</p>}
                                </div>

                                <button
                                    type="submit"
                                    style={{ ...S.submitBtn, ...(loading ? S.submitDisabled : {}) }}
                                    disabled={loading}
                                >
                                    {loading ? "Sending…" : "Send reset link →"}
                                </button>
                            </form>
                        )}

                        <div style={S.divider}>
                            <span style={S.divLine} />
                        </div>

                        <Link to="/login" style={S.backLink}>
                            ← Back to sign in
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
}