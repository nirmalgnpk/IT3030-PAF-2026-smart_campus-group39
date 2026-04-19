import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import {
    HiOutlineMail,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeOff,
    HiExclamationCircle,
    HiCheckCircle,
} from "react-icons/hi";
import { MdOutlineEngineering } from "react-icons/md";
import { RiAdminLine, RiGraduationCapLine } from "react-icons/ri";

/* ─── Google font loaded via @import so it works without index.html changes ─── */
const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
* { font-family: 'DM Sans', 'Segoe UI', sans-serif; box-sizing: border-box; }
input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; outline: none; }
button:hover:not(:disabled) { opacity: 0.88; }
`;

const SLIIT_DOMAIN = "@my.sliit.lk";

function validateEmail(email) {
    const lower = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return "Enter a valid email address.";
    if (lower.endsWith(SLIIT_DOMAIN)) {
        const studentId = lower.split("@")[0];
        if (!/^[a-z]{2}\d{8}$/.test(studentId))
            return "SLIIT student email must be like IT23816718@my.sliit.lk";
    }
    return null;
}

const ROLE_OPTIONS = [
    {
        value: "TECHNICIAN",
        label: "Technician",
        desc: "Maintenance & repairs",
        Icon: MdOutlineEngineering,
        bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border: "#86efac",
        color: "#15803d",
        activeBg: "#15803d",
        activeColor: "#fff",
    },
    {
        value: "ADMIN",
        label: "Administrator",
        desc: "Full system access",
        Icon: RiAdminLine,
        bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
        border: "#fcd34d",
        color: "#92400e",
        activeBg: "#92400e",
        activeColor: "#fff",
    },
];

const STUDENT_ROLE = {
    value: "STUDENT",
    label: "Student",
    desc: "Detected from SLIIT email",
    Icon: RiGraduationCapLine,
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "#93c5fd",
    color: "#1d4ed8",
};

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail]             = useState("");
    const [password, setPassword]       = useState("");
    const [loading, setLoading]         = useState(false);
    const [errors, setErrors]           = useState({});
    const [serverError, setServerError] = useState("");
    const [selectedRole, setSelectedRole] = useState(null);
    const [showRolePicker, setShowRolePicker] = useState(false);
    const [pwVisible, setPwVisible]     = useState(false);

    const emailLower = email.trim().toLowerCase();
    const isStudent  = emailLower.endsWith(SLIIT_DOMAIN) && emailLower.length > SLIIT_DOMAIN.length;
    const hasEmail   = emailLower.length > 3 && emailLower.includes("@");

    useEffect(() => {
        if (isStudent) {
            setSelectedRole("STUDENT");
            setShowRolePicker(false);
        } else if (hasEmail && !isStudent) {
            setShowRolePicker(true);
            if (selectedRole === "STUDENT") setSelectedRole(null);
        } else {
            setShowRolePicker(false);
        }
    }, [email, hasEmail, isStudent, selectedRole]);

    function validate() {
        const e = {};
        const emailErr = validateEmail(email);
        if (emailErr) e.email = emailErr;
        if (!password) e.password = "Password is required.";
        return e;
    }

    async function handleLogin(evt) {
        evt.preventDefault();
        setServerError("");
        const e = validate();
        setErrors(e);
        if (Object.keys(e).length) return;
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:8080/api/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });
            login(data);
            navigate("/");
        } catch (err) {
            setServerError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <style>{fontStyle}</style>
            <div style={css.page}>
                {/* ── Left Panel ── */}
                <div style={css.leftPanel}>
                    <div style={css.leftInner}>
                        {/* Decorative circles */}
                        <div style={css.circleTopRight} />
                        <div style={css.circleMidLeft} />
                        <div style={css.circleBottomRight} />
                        <div style={css.circleSmall} />

                        <div style={css.leftContent}>
                            <div style={css.leftLogo}>
                                <div style={css.leftLogoMark}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>SC</span>
                                </div>
                                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>Smart Campus</span>
                            </div>
                            <h2 style={css.leftHeading}>Welcome Back!</h2>
                            <p style={css.leftSubtext}>
                                Sign in to manage your campus resources, track maintenance requests, and stay connected with your community.
                            </p>
                            <div style={css.leftBadge}>
                                <HiCheckCircle size={16} color="#fff" />
                                <span>Secure SLIIT campus portal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right Panel ── */}
                <div style={css.rightPanel}>
                    <div style={css.formCard}>
                        <div style={css.logoRow}>
                            <div style={css.logoMark}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>SC</span>
                            </div>
                            <span style={css.logoText}>Smart Campus</span>
                        </div>

                        <h1 style={css.title}>Sign in</h1>
                        <p style={css.subtitle}>Enter your credentials to continue</p>

                        {serverError && (
                            <div style={css.serverError}>
                                <HiExclamationCircle size={16} color="#dc2626" />
                                <span>{serverError}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} noValidate>
                            {/* Email */}
                            <div style={css.fieldGroup}>
                                <label style={css.label}>Email address</label>
                                <div style={css.inputWrap}>
                                    <span style={css.inputIcon}><HiOutlineMail size={16} color="#94a3b8" /></span>
                                    <input
                                        style={{ ...css.input, ...(errors.email ? css.inputErr : {}) }}
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: null })); }}
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p style={css.errText}>{errors.email}</p>}

                                {isStudent && (
                                    <div style={{ ...css.roleChip, background: STUDENT_ROLE.bg, borderColor: STUDENT_ROLE.border }}>
                                        <STUDENT_ROLE.Icon size={16} color={STUDENT_ROLE.color} />
                                        <div>
                                            <span style={{ fontWeight: 600, color: STUDENT_ROLE.color, fontSize: 13 }}>{STUDENT_ROLE.label}</span>
                                            <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>{STUDENT_ROLE.desc}</span>
                                        </div>
                                        <span style={css.checkBadge}>
                                            <HiCheckCircle size={12} color="#16a34a" />
                                            Auto-detected
                                        </span>
                                    </div>
                                )}

                                {showRolePicker && !isStudent && (
                                    <div style={css.rolePicker}>
                                        <p style={css.rolePickerLabel}>Select your role</p>
                                        <div style={css.roleGrid}>
                                            {ROLE_OPTIONS.map(r => (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() => setSelectedRole(r.value)}
                                                    style={{
                                                        ...css.roleCard,
                                                        background: selectedRole === r.value ? r.activeBg : r.bg,
                                                        borderColor: selectedRole === r.value ? r.activeBg : r.border,
                                                        color: selectedRole === r.value ? r.activeColor : r.color,
                                                        transform: selectedRole === r.value ? "scale(1.02)" : "scale(1)",
                                                        boxShadow: selectedRole === r.value ? `0 4px 16px ${r.border}99` : "none",
                                                    }}
                                                >
                                                    <r.Icon size={20} />
                                                    <span style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</span>
                                                    <span style={{ fontSize: 11, opacity: 0.75 }}>{r.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Password */}
                            <div style={css.fieldGroup}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <label style={css.label}>Password</label>
                                    <Link to="/forgot-password" style={css.forgotLink}>Forgot password?</Link>
                                </div>
                                <div style={css.inputWrap}>
                                    <span style={css.inputIcon}><HiOutlineLockClosed size={16} color="#94a3b8" /></span>
                                    <input
                                        style={{ ...css.input, ...(errors.password ? css.inputErr : {}) }}
                                        type={pwVisible ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({ ...p, password: null })); }}
                                        autoComplete="current-password"
                                    />
                                    <button type="button" onClick={() => setPwVisible(v => !v)} style={css.eyeBtn}>
                                        {pwVisible
                                            ? <HiOutlineEyeOff size={16} color="#94a3b8" />
                                            : <HiOutlineEye size={16} color="#94a3b8" />}
                                    </button>
                                </div>
                                {errors.password && <p style={css.errText}>{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                style={{ ...css.submitBtn, ...(loading ? css.submitDisabled : {}) }}
                                disabled={loading}
                            >
                                {loading ? "Signing in…" : "Sign in →"}
                            </button>
                        </form>

                        <div style={css.divider}>
                            <span style={css.divLine} />
                            <span style={css.divText}>OR</span>
                            <span style={css.divLine} />
                        </div>

                        <button
                            type="button"
                            style={css.googleBtn}
                            onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                        >
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Continue with Google
                        </button>

                        <p style={css.registerRow}>
                            Don't have an account?{" "}
                            <Link to="/register" style={css.registerLink}>Create one</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

const css = {
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
    /* Decorative circles */
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
    title: { fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.5px" },
    subtitle: { fontSize: 14, color: "#64748b", marginBottom: "1.75rem" },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
    fieldGroup: { marginBottom: "1.1rem" },
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
    eyeBtn: {
        position: "absolute", right: 10, background: "none", border: "none",
        cursor: "pointer", padding: 2, lineHeight: 1, display: "flex", alignItems: "center",
    },
    errText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
    roleChip: {
        display: "flex", alignItems: "center", gap: 8,
        marginTop: 8, padding: "8px 12px", borderRadius: 10,
        border: "1.5px solid", fontSize: 13, flexWrap: "wrap",
    },
    checkBadge: {
        marginLeft: "auto", fontSize: 11, fontWeight: 600,
        background: "#dcfce7", color: "#16a34a",
        padding: "2px 8px", borderRadius: 20,
        display: "flex", alignItems: "center", gap: 4,
    },
    rolePicker: {
        marginTop: 10, padding: "12px 14px",
        background: "#f8fafc", borderRadius: 12,
        border: "1.5px solid #e2e8f0",
    },
    rolePickerLabel: {
        fontSize: 12, fontWeight: 600, color: "#64748b",
        marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em",
    },
    roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
    roleCard: {
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 3, padding: "10px 12px", borderRadius: 10,
        border: "1.5px solid", cursor: "pointer",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        textAlign: "left", transition: "all 0.18s ease",
    },
    forgotLink: { fontSize: 13, color: "#3b82f6", textDecoration: "none", fontWeight: 500 },
    submitBtn: {
        width: "100%", padding: "11px",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "#fff", border: "none", borderRadius: 10,
        fontSize: 14, fontWeight: 600, cursor: "pointer",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        marginTop: 4, letterSpacing: "0.01em",
        boxShadow: "0 2px 12px rgba(15,23,42,0.3)",
        transition: "opacity 0.2s, transform 0.1s",
    },
    submitDisabled: { opacity: 0.65, cursor: "not-allowed" },
    divider: { display: "flex", alignItems: "center", gap: 10, margin: "1.25rem 0" },
    divLine: { flex: 1, height: 1, background: "#e2e8f0" },
    divText: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
    googleBtn: {
        width: "100%", padding: "10px",
        background: "#fff", color: "#374151",
        border: "1.5px solid #e2e8f0", borderRadius: 10,
        fontSize: 14, fontWeight: 500, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    serverError: {
        background: "#fef2f2", border: "1.5px solid #fecaca",
        borderRadius: 10, padding: "10px 14px",
        fontSize: 13, color: "#dc2626", marginBottom: "1.1rem",
        display: "flex", alignItems: "center", gap: 8,
    },
    registerRow: { textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "#64748b" },
    registerLink: { color: "#3b82f6", textDecoration: "none", fontWeight: 600 },
};