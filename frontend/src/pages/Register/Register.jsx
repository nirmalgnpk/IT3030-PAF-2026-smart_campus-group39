// src/pages/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import {
    HiOutlineMail, HiOutlineLockClosed, HiOutlineUser,
    HiOutlineAtSymbol, HiOutlineEye, HiOutlineEyeOff,
    HiExclamationCircle, HiCheckCircle,
} from "react-icons/hi";
import { RiGraduationCapLine } from "react-icons/ri";
import OtpInput from "../../components/auth/OtpInput";

const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
* { font-family: 'DM Sans', 'Segoe UI', sans-serif; box-sizing: border-box; }
input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12) !important; outline: none; }
button:hover:not(:disabled) { opacity: 0.88; }
`;

const SLIIT_DOMAIN = "@my.sliit.lk";
const API = "http://localhost:8082/api/auth";

function validateEmail(email) {
    const lower = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower))
        return "Enter a valid email address.";
    if (!lower.endsWith(SLIIT_DOMAIN))
        return "Only SLIIT student emails (@my.sliit.lk) are allowed to register.";
    const studentId = lower.split("@")[0];
    if (!/^[a-z]{2}\d{8}$/.test(studentId))
        return "SLIIT student email must be like IT23816718@my.sliit.lk";
    return null;
}

const STUDENT_ROLE = {
    value: "STUDENT",
    label: "Student",
    desc: "Detected from SLIIT email",
    Icon: RiGraduationCapLine,
    bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
    border: "#93c5fd",
    color: "#1d4ed8",
};

export default function Register() {
    const { login }  = useAuth();
    const navigate   = useNavigate();

    const [step, setStep] = useState("form");
    const [form, setForm] = useState({ name: "", userName: "", email: "", password: "", confirmPassword: "" });
    const [errors, setErrors]           = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading]         = useState(false);
    const [pwVisible, setPwVisible]     = useState(false);
    const [cpwVisible, setCpwVisible]   = useState(false);

    // OTP step
    const [otp, setOtp]               = useState("");
    const [otpError, setOtpError]     = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend]   = useState(false);

    const emailLower = form.email.trim().toLowerCase();
    const isValidSliit = emailLower.endsWith(SLIIT_DOMAIN) && emailLower.length > SLIIT_DOMAIN.length;

    // Resend countdown
    useEffect(() => {
        if (step !== "otp") return;
        setResendTimer(60);
        setCanResend(false);
        const id = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(id); setCanResend(true); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [step]);

    function set(key) {
        return (e) => {
            setForm(p => ({ ...p, [key]: e.target.value }));
            setErrors(p => ({ ...p, [key]: null }));
        };
    }

    function validate() {
        const e = {};
        if (!form.name.trim())     e.name     = "Full name is required.";
        if (!form.userName.trim()) e.userName = "Username is required.";
        if (!form.email.trim())    e.email    = "Email is required.";
        else { const err = validateEmail(form.email); if (err) e.email = err; }
        if (!form.password)        e.password = "Password is required.";
        else if (form.password.length < 8) e.password = "Minimum 8 characters.";
        if (form.password !== form.confirmPassword)
            e.confirmPassword = "Passwords do not match.";
        return e;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setServerError("");
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);
        try {
            await axios.post(`${API}/send-register-otp`, {
                name:     form.name.trim(),
                userName: form.userName.trim(),
                email:    form.email.trim().toLowerCase(),
                password: form.password,
                role:     "STUDENT",
            });
            setStep("otp");
        } catch (err) {
            setServerError(err.response?.data?.message || "Could not send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleOtpSubmit() {
        if (otp.length < 6) { setOtpError("Please enter the complete 6-digit OTP."); return; }
        setOtpError("");
        setOtpLoading(true);
        try {
            const { data } = await axios.post(`${API}/verify-register-otp`, {
                email: form.email.trim().toLowerCase(),
                otp,
            });
            login(data);
            navigate("/dashboard");
        } catch (err) {
            setOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setOtpLoading(false);
        }
    }

    async function handleResend() {
        if (!canResend) return;
        setOtpError("");
        try {
            await axios.post(`${API}/send-register-otp`, {
                name: form.name.trim(), userName: form.userName.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password, role: "STUDENT",
            });
            setResendTimer(60);
            setCanResend(false);
        } catch {
            setOtpError("Could not resend OTP. Please try again.");
        }
    }

    const inp = (key) => ({ ...css.input, ...(errors[key] ? css.inputErr : {}) });

    return (
        <>
            <style>{fontStyle}</style>
            <div style={css.page}>
                {/* Left Panel */}
                <div style={css.leftPanel}>
                    <div style={css.leftInner}>
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
                            <h2 style={css.leftHeading}>
                                {step === "otp" ? "Check your inbox" : "Join Smart Campus"}
                            </h2>
                            <p style={css.leftSubtext}>
                                {step === "otp"
                                    ? `We sent a 6-digit code to ${form.email}. Enter it to verify your email and complete registration.`
                                    : "Create your student account to submit maintenance requests, access campus resources, and collaborate with your community."}
                            </p>
                            <div style={css.leftBadge}>
                                <HiCheckCircle size={16} color="#fff" />
                                <span>{step === "otp" ? "OTP valid for 10 minutes" : "SLIIT students only (@my.sliit.lk)"}</span>
                            </div>
                            {step === "form" && (
                                <div style={css.featureList}>
                                    {[
                                        "Submit & track maintenance requests",
                                        "Access campus facilities online",
                                        "Real-time notifications & updates",
                                    ].map((f, i) => (
                                        <div key={i} style={css.featureItem}>
                                            <HiCheckCircle size={15} color="rgba(255,255,255,0.9)" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={css.rightPanel}>
                    <div style={css.formCard}>
                        <div style={css.logoRow}>
                            <div style={css.logoMark}>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>SC</span>
                            </div>
                            <span style={css.logoText}>Smart Campus</span>
                        </div>

                        {/* ── OTP Step ── */}
                        {step === "otp" ? (
                            <>
                                <div style={{ ...css.iconCircle }}>📬</div>
                                <h1 style={css.title}>Verify your email</h1>
                                <p style={css.subtitle}>
                                    Enter the 6-digit code sent to{" "}
                                    <strong style={{ color: "#0f172a" }}>{form.email}</strong>
                                </p>

                                {otpError && (
                                    <div style={css.serverError}>
                                        <HiExclamationCircle size={16} color="#dc2626" />
                                        <span>{otpError}</span>
                                    </div>
                                )}

                                <div style={{ marginBottom: "1.5rem" }}>
                                    <OtpInput length={6} onChange={setOtp} hasError={!!otpError} />
                                </div>

                                <button
                                    onClick={handleOtpSubmit}
                                    style={{ ...css.submitBtn, ...(otpLoading ? css.submitDisabled : {}) }}
                                    disabled={otpLoading}
                                >
                                    {otpLoading ? "Verifying…" : "Verify & Create Account →"}
                                </button>

                                <p style={{ textAlign: "center", marginTop: "1rem", fontSize: 13, color: "#64748b" }}>
                                    Didn't receive it?{" "}
                                    {canResend
                                        ? <button onClick={handleResend} style={css.linkBtn}>Resend OTP</button>
                                        : <span style={{ color: "#94a3b8" }}>Resend in {resendTimer}s</span>
                                    }
                                </p>
                                <button
                                    onClick={() => setStep("form")}
                                    style={{ ...css.linkBtn, display: "block", margin: "0.5rem auto 0", fontSize: 13 }}
                                >
                                    ← Change email or details
                                </button>
                            </>
                        ) : (
                            /* ── Form Step ── */
                            <>
                                <h1 style={css.title}>Create an account</h1>
                                <p style={css.subtitle}>SLIIT students only — use your @my.sliit.lk email</p>

                                {serverError && (
                                    <div style={css.serverError}>
                                        <HiExclamationCircle size={16} color="#dc2626" />
                                        <span>{serverError}</span>
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit} noValidate>
                                    <div style={css.row}>
                                        <div style={css.fieldGroup}>
                                            <label style={css.label}>Full name</label>
                                            <div style={css.inputWrap}>
                                                <span style={css.inputIcon}><HiOutlineUser size={15} color="#94a3b8" /></span>
                                                <input style={inp("name")} placeholder="John Doe" onChange={set("name")} />
                                            </div>
                                            {errors.name && <p style={css.errText}>{errors.name}</p>}
                                        </div>
                                        <div style={css.fieldGroup}>
                                            <label style={css.label}>Username</label>
                                            <div style={css.inputWrap}>
                                                <span style={css.inputIcon}><HiOutlineAtSymbol size={15} color="#94a3b8" /></span>
                                                <input style={inp("userName")} placeholder="johndoe" onChange={set("userName")} />
                                            </div>
                                            {errors.userName && <p style={css.errText}>{errors.userName}</p>}
                                        </div>
                                    </div>

                                    {/* Email — shows student badge when valid SLIIT email */}
                                    <div style={css.fieldGroup}>
                                        <label style={css.label}>SLIIT Email address</label>
                                        <div style={css.inputWrap}>
                                            <span style={css.inputIcon}><HiOutlineMail size={15} color="#94a3b8" /></span>
                                            <input
                                                style={{ ...inp("email"), paddingLeft: 36 }}
                                                placeholder="IT23xxxxxx@my.sliit.lk"
                                                onChange={set("email")}
                                                autoComplete="email"
                                            />
                                        </div>
                                        {errors.email && <p style={css.errText}>{errors.email}</p>}

                                        {/* Auto-detected student badge */}
                                        {isValidSliit && (
                                            <div style={{ ...css.roleChip, background: STUDENT_ROLE.bg, borderColor: STUDENT_ROLE.border }}>
                                                <STUDENT_ROLE.Icon size={16} color={STUDENT_ROLE.color} />
                                                <div>
                                                    <span style={{ fontWeight: 600, color: STUDENT_ROLE.color, fontSize: 13 }}>
                                                        {STUDENT_ROLE.label}
                                                    </span>
                                                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: 6 }}>
                                                        {STUDENT_ROLE.desc}
                                                    </span>
                                                </div>
                                                <span style={css.checkBadge}>
                                                    <HiCheckCircle size={12} color="#16a34a" /> Auto-detected
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={css.fieldGroup}>
                                        <label style={css.label}>Password</label>
                                        <div style={css.inputWrap}>
                                            <span style={css.inputIcon}><HiOutlineLockClosed size={15} color="#94a3b8" /></span>
                                            <input
                                                type={pwVisible ? "text" : "password"}
                                                style={{ ...inp("password"), paddingLeft: 36 }}
                                                placeholder="Min. 8 characters"
                                                onChange={set("password")}
                                                autoComplete="new-password"
                                            />
                                            <button type="button" onClick={() => setPwVisible(v => !v)} style={css.eyeBtn}>
                                                {pwVisible ? <HiOutlineEyeOff size={15} color="#94a3b8" /> : <HiOutlineEye size={15} color="#94a3b8" />}
                                            </button>
                                        </div>
                                        {errors.password && <p style={css.errText}>{errors.password}</p>}
                                    </div>

                                    <div style={css.fieldGroup}>
                                        <label style={css.label}>Confirm password</label>
                                        <div style={css.inputWrap}>
                                            <span style={css.inputIcon}><HiOutlineLockClosed size={15} color="#94a3b8" /></span>
                                            <input
                                                type={cpwVisible ? "text" : "password"}
                                                style={{ ...inp("confirmPassword"), paddingLeft: 36 }}
                                                placeholder="Repeat your password"
                                                onChange={set("confirmPassword")}
                                                autoComplete="new-password"
                                            />
                                            <button type="button" onClick={() => setCpwVisible(v => !v)} style={css.eyeBtn}>
                                                {cpwVisible ? <HiOutlineEyeOff size={15} color="#94a3b8" /> : <HiOutlineEye size={15} color="#94a3b8" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && <p style={css.errText}>{errors.confirmPassword}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        style={{ ...css.submitBtn, ...(loading ? css.submitDisabled : {}) }}
                                        disabled={loading}
                                    >
                                        {loading ? "Sending OTP…" : "Continue →"}
                                    </button>
                                </form>

                                <p style={css.loginRow}>
                                    Already have an account?{" "}
                                    <Link to="/login" style={css.loginLink}>Sign in</Link>
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const css = {
    page:          { minHeight: "100vh", display: "flex", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" },
    leftPanel:     { width: "42%", minHeight: "100vh", background: "linear-gradient(145deg, #e84545 0%, #c0392b 40%, #e05c32 80%, #f08040 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
    leftInner:     { position: "relative", zIndex: 2, padding: "3rem 2.5rem", width: "100%" },
    circleTopRight:    { position: "absolute", top: "-80px",    right: "-80px", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
    circleMidLeft:     { position: "absolute", top: "38%",      left: "-60px",  width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" },
    circleBottomRight: { position: "absolute", bottom: "-60px", right: "10%",   width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" },
    circleSmall:       { position: "absolute", top: "22%",      right: "15%",   width: 90,  height: 90,  borderRadius: "50%", background: "rgba(255,255,255,0.1)",  pointerEvents: "none" },
    leftContent:   { position: "relative", zIndex: 3 },
    leftLogo:      { display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" },
    leftLogoMark:  { width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" },
    leftHeading:   { fontSize: 34, fontWeight: 700, color: "#fff", marginBottom: 14, lineHeight: 1.2, letterSpacing: "-0.5px" },
    leftSubtext:   { fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 24, maxWidth: 300 },
    leftBadge:     { display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", borderRadius: 30, padding: "7px 14px", fontSize: 13, color: "#fff", fontWeight: 500, border: "1px solid rgba(255,255,255,0.2)", marginBottom: 28 },
    featureList:   { display: "flex", flexDirection: "column", gap: 10 },
    featureItem:   { display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "rgba(255,255,255,0.85)" },
    rightPanel:    { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem 1.5rem", overflowY: "auto" },
    formCard:      { background: "#fff", borderRadius: 20, border: "1px solid #e8edf2", padding: "2.25rem 2.25rem", width: "100%", maxWidth: 440, boxShadow: "0 4px 40px rgba(0,0,0,0.06)" },
    logoRow:       { display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" },
    logoMark:      { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1e293b, #334155)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(30,41,59,0.3)" },
    logoText:      { fontSize: 15, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" },
    iconCircle:    { width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#eff6ff,#dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: "1.25rem", border: "1px solid #93c5fd" },
    title:         { fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4, letterSpacing: "-0.5px" },
    subtitle:      { fontSize: 14, color: "#64748b", marginBottom: "1.5rem" },
    row:           { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    fieldGroup:    { marginBottom: "1rem" },
    label:         { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
    inputWrap:     { position: "relative", display: "flex", alignItems: "center" },
    inputIcon:     { position: "absolute", left: 11, pointerEvents: "none", display: "flex", alignItems: "center" },
    input:         { width: "100%", padding: "9px 38px 9px 36px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box", background: "#f8fafc", transition: "border-color 0.2s, box-shadow 0.2s" },
    inputErr:      { borderColor: "#f87171", background: "#fff5f5" },
    eyeBtn:        { position: "absolute", right: 10, background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" },
    errText:       { fontSize: 12, color: "#dc2626", marginTop: 4 },
    roleChip:      { display: "flex", alignItems: "center", gap: 8, marginTop: 8, padding: "8px 12px", borderRadius: 10, border: "1.5px solid", fontSize: 13, flexWrap: "wrap" },
    checkBadge:    { marginLeft: "auto", fontSize: 11, fontWeight: 600, background: "#dcfce7", color: "#16a34a", padding: "2px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 },
    submitBtn:     { width: "100%", padding: "11px", background: "linear-gradient(135deg, #1e293b, #0f172a)", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4, boxShadow: "0 2px 12px rgba(15,23,42,0.3)", transition: "opacity 0.2s" },
    submitDisabled:{ opacity: 0.65, cursor: "not-allowed" },
    serverError:   { background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 },
    loginRow:      { textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "#64748b" },
    loginLink:     { color: "#3b82f6", textDecoration: "none", fontWeight: 600 },
    linkBtn:       { background: "none", border: "none", color: "#3b82f6", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 13 },
};