import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";

const ROLE_CONFIG = {
    USER:       { label: "Student",      icon: "🎓", bg: "#eff6ff",  color: "#1d4ed8" },
    STUDENT:    { label: "Student",      icon: "🎓", bg: "#eff6ff",  color: "#1d4ed8" },
    TECHNICIAN: { label: "Technician",   icon: "🔧", bg: "#f0fdf4",  color: "#15803d" },
    MANAGER:    { label: "Manager",      icon: "📋", bg: "#fdf4ff",  color: "#7e22ce" },
    ADMIN:      { label: "Administrator",icon: "⚡", bg: "#fef3c7",  color: "#92400e" },
};

function getInitials(name = "") {
    return name.trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function getAvatarColor(email = "") {
    const colors = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444","#06b6d4"];
    return colors[email.charCodeAt(0) % colors.length];
}

export default function Profile() {
    const { currentUser, login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm]           = useState({
        name:     currentUser?.name     || "",
        userName: currentUser?.userName || "",
        email:    currentUser?.email    || "",
    });
    const [editMode, setEditMode]   = useState(false);
    const [saving, setSaving]       = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast]         = useState(null);
    const [errors, setErrors]       = useState({});
    const [pwForm, setPwForm]       = useState({ current: "", next: "", confirm: "" });
    const [pwMode, setPwMode]       = useState(false);
    const [pwSaving, setPwSaving]   = useState(false);
    const [pwErrors, setPwErrors]   = useState({});
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileRef = useRef(null);

    const roleInfo = ROLE_CONFIG[currentUser?.role] || ROLE_CONFIG.USER;
    const avatarBg = getAvatarColor(currentUser?.email || "");
    const displayPhoto = previewUrl || currentUser?.profilePhotoUrl;

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }

    function validateForm() {
        const e = {};
        if (!form.name.trim())     e.name = "Name is required";
        if (!form.userName.trim()) e.userName = "Username is required";
        return e;
    }

    async function handleSave() {
        const e = validateForm();
        setErrors(e);
        if (Object.keys(e).length) return;

        setSaving(true);
        try {
            const { data } = await axios.put(`/api/users/${currentUser.id}`, {
                name:     form.name.trim(),
                userName: form.userName.trim(),
            });
            login({ ...currentUser, name: form.name.trim(), userName: form.userName.trim(), token: currentUser.token });
            setEditMode(false);
            showToast("Profile updated successfully ✨");
        } catch {
            showToast("Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setForm({ name: currentUser?.name || "", userName: currentUser?.userName || "", email: currentUser?.email || "" });
        setErrors({});
        setEditMode(false);
    }

    async function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return showToast("Only image files are allowed", "error");
        if (file.size > 5 * 1024 * 1024)     return showToast("File size must be under 5 MB", "error");

        const reader = new FileReader();
        reader.onload = ev => setPreviewUrl(ev.target.result);
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append("file", file);
        setUploading(true);
        try {
            const { data } = await axios.post(`/api/auth/upload-photo/${currentUser.id}`, formData);
            login({ ...currentUser, profilePhotoUrl: data.photoUrl, token: currentUser.token });
            setPreviewUrl(null);
            showToast("Photo updated! 📸");
        } catch {
            setPreviewUrl(null);
            showToast("Photo upload failed", "error");
        } finally {
            setUploading(false);
        }
    }

    function validatePw() {
        const e = {};
        if (!pwForm.current)              e.current = "Required";
        if (pwForm.next.length < 6)       e.next = "Min. 6 characters";
        if (pwForm.next !== pwForm.confirm) e.confirm = "Passwords don't match";
        return e;
    }

    async function handleChangePw() {
        const e = validatePw();
        setPwErrors(e);
        if (Object.keys(e).length) return;
        setPwSaving(true);
        try {
            // POST to your change-password endpoint when you build it
            await axios.post("/api/auth/change-password", {
                userId:          currentUser.id,
                currentPassword: pwForm.current,
                newPassword:     pwForm.next,
            });
            setPwMode(false);
            setPwForm({ current: "", next: "", confirm: "" });
            showToast("Password changed successfully 🔒");
        } catch (err) {
            showToast(err.response?.data?.message || "Failed to change password", "error");
        } finally {
            setPwSaving(false);
        }
    }

    return (
        <div style={S.page}>
            {/* Background decoration */}
            <div style={S.bgDeco} />

            <div style={S.container}>
                {/* Back button */}
                <button onClick={() => navigate(-1)} style={S.backBtn}>← Back</button>

                {/* Profile Hero */}
                <div style={S.heroCard}>
                    {/* Cover gradient */}
                    <div style={S.heroCover} />

                    {/* Avatar */}
                    <div style={S.avatarSection}>
                        <div style={S.avatarWrap}>
                            {displayPhoto ? (
                                <img src={displayPhoto} alt="Profile"
                                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            ) : (
                                <div style={{ ...S.avatarFallback, background: avatarBg }}>
                                    {getInitials(currentUser?.name)}
                                </div>
                            )}
                            {uploading && (
                                <div style={S.uploadingOverlay}>
                                    <div style={S.spinner} />
                                </div>
                            )}
                            <button
                                style={S.cameraBtn}
                                onClick={() => fileRef.current?.click()}
                                title="Change photo"
                            >📷</button>
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />

                        <div style={S.heroInfo}>
                            <h1 style={S.heroName}>{currentUser?.name || currentUser?.userName || "—"}</h1>
                            <p style={S.heroEmail}>{currentUser?.email}</p>
                            <span style={{ ...S.rolePill, background: roleInfo.bg, color: roleInfo.color }}>
                                {roleInfo.icon} {roleInfo.label}
                            </span>
                        </div>

                        {!editMode && (
                            <button onClick={() => setEditMode(true)} style={S.editBtn}>Edit Profile</button>
                        )}
                    </div>
                </div>

                <div style={S.twoCol}>
                    {/* Left — Profile Details */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <h2 style={S.cardTitle}>Profile Details</h2>
                            {editMode && (
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button onClick={handleCancel} style={S.cancelBtn}>Cancel</button>
                                    <button onClick={handleSave} disabled={saving} style={S.saveBtn}>
                                        {saving ? "Saving…" : "Save changes"}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={S.fieldList}>
                            {[
                                { key: "name",     label: "Full Name",  editable: true },
                                { key: "userName", label: "Username",   editable: true },
                                { key: "email",    label: "Email",      editable: false },
                            ].map(({ key, label, editable }) => (
                                <div key={key} style={S.fieldRow}>
                                    <label style={S.fieldLabel}>{label}</label>
                                    {editMode && editable ? (
                                        <div>
                                            <input
                                                style={{ ...S.fieldInput, ...(errors[key] ? S.inputErr : {}) }}
                                                value={form[key]}
                                                onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: null })); }}
                                            />
                                            {errors[key] && <p style={S.errText}>{errors[key]}</p>}
                                        </div>
                                    ) : (
                                        <span style={S.fieldValue}>{form[key] || "—"}</span>
                                    )}
                                </div>
                            ))}

                            {/* Read-only fields */}
                            <div style={S.fieldRow}>
                                <label style={S.fieldLabel}>Role</label>
                                <span style={{ ...S.rolePill, fontSize: 12 }}>{roleInfo.icon} {roleInfo.label}</span>
                            </div>
                            <div style={S.fieldRow}>
                                <label style={S.fieldLabel}>Login Method</label>
                                <span style={{ ...S.fieldValue, display: "flex", alignItems: "center", gap: 6 }}>
                                    {currentUser?.provider === "GOOGLE" ? "🔵" : "🔐"} {currentUser?.provider || "LOCAL"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right — Security */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Change password */}
                        {(!currentUser?.provider || currentUser.provider === "LOCAL") && (
                            <div style={S.card}>
                                <div style={S.cardHeader}>
                                    <h2 style={S.cardTitle}>🔒 Security</h2>
                                    {!pwMode && (
                                        <button onClick={() => setPwMode(true)} style={S.editBtn}>Change Password</button>
                                    )}
                                </div>

                                {!pwMode ? (
                                    <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>
                                        Keep your account secure with a strong password.
                                    </p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", marginTop: "0.75rem" }}>
                                        {[
                                            { key: "current", label: "Current Password",  placeholder: "••••••••" },
                                            { key: "next",    label: "New Password",      placeholder: "••••••••" },
                                            { key: "confirm", label: "Confirm Password",  placeholder: "••••••••" },
                                        ].map(({ key, label, placeholder }) => (
                                            <div key={key}>
                                                <label style={S.fieldLabel}>{label}</label>
                                                <input
                                                    type="password"
                                                    placeholder={placeholder}
                                                    style={{ ...S.fieldInput, ...(pwErrors[key] ? S.inputErr : {}) }}
                                                    value={pwForm[key]}
                                                    onChange={e => { setPwForm(p => ({ ...p, [key]: e.target.value })); setPwErrors(p => ({ ...p, [key]: null })); }}
                                                />
                                                {pwErrors[key] && <p style={S.errText}>{pwErrors[key]}</p>}
                                            </div>
                                        ))}
                                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                            <button onClick={() => { setPwMode(false); setPwErrors({}); }} style={S.cancelBtn}>Cancel</button>
                                            <button onClick={handleChangePw} disabled={pwSaving} style={S.saveBtn}>
                                                {pwSaving ? "Saving…" : "Update password"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Account info */}
                        <div style={S.card}>
                            <h2 style={S.cardTitle}>📋 Account Info</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.75rem" }}>
                                <div style={S.infoRow}>
                                    <span style={S.infoLabel}>Account ID</span>
                                    <span style={{ ...S.infoValue, fontFamily: "monospace", fontSize: 11 }}>
                                        {currentUser?.id?.slice(0, 16)}…
                                    </span>
                                </div>
                                <div style={S.infoRow}>
                                    <span style={S.infoLabel}>Status</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#15803d" }}>● Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Photo hint */}
                        <div style={S.hintCard}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>📸</div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#1d4ed8", marginBottom: 4 }}>Update your photo</p>
                            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                                Click the camera icon on your avatar to upload a new profile photo. Max 5 MB, JPG/PNG.
                            </p>
                            <button onClick={() => fileRef.current?.click()} style={S.uploadBtn}>
                                Choose photo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div style={{
                    ...S.toast,
                    background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
                    borderColor: toast.type === "error" ? "#fecaca" : "#bbf7d0",
                    color: toast.type === "error" ? "#dc2626" : "#15803d",
                }}>
                    {toast.msg}
                </div>
            )}
        </div>
    );
}

const S = {
    page: {
        minHeight: "100vh", background: "#f1f5f9",
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        position: "relative", overflow: "hidden",
    },
    bgDeco: {
        position: "fixed", top: -200, right: -200,
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, #dbeafe55, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
    },
    container: { maxWidth: 900, margin: "0 auto", padding: "1.5rem 1.5rem 3rem", position: "relative", zIndex: 1 },
    backBtn: {
        background: "none", border: "none", fontSize: 14, fontWeight: 500,
        color: "#64748b", cursor: "pointer", padding: "4px 0",
        fontFamily: "inherit", marginBottom: "1.25rem", display: "block",
    },
    heroCard: {
        background: "#fff", borderRadius: 20, overflow: "hidden",
        border: "1px solid #e8edf2", boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        marginBottom: "1.25rem",
    },
    heroCover: {
        height: 100,
        background: "linear-gradient(135deg, #1e293b 0%, #3b4f6e 50%, #1d4ed8 100%)",
    },
    avatarSection: {
        display: "flex", alignItems: "flex-end", gap: "1.25rem",
        padding: "0 1.75rem 1.5rem", marginTop: -44, flexWrap: "wrap",
    },
    avatarWrap: {
        width: 88, height: 88, borderRadius: "50%",
        border: "4px solid #fff", background: "#f1f5f9",
        overflow: "hidden", flexShrink: 0, position: "relative",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    },
    avatarFallback: {
        width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, fontWeight: 700, color: "#fff",
    },
    uploadingOverlay: {
        position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "50%",
    },
    spinner: {
        width: 22, height: 22, borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.3)",
        borderTopColor: "#fff",
        animation: "spin 0.7s linear infinite",
    },
    cameraBtn: {
        position: "absolute", bottom: 0, right: 0,
        width: 26, height: 26, borderRadius: "50%",
        background: "#1e293b", border: "2px solid #fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, cursor: "pointer", lineHeight: 1,
    },
    heroInfo: { flex: 1, paddingBottom: 4, paddingTop: 44 },
    heroName: { fontSize: 22, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.4px", marginBottom: 2 },
    heroEmail: { fontSize: 14, color: "#64748b", marginBottom: 8 },
    rolePill: { display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 },
    editBtn: {
        padding: "8px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0",
        background: "#fff", color: "#374151", fontSize: 13,
        fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        marginTop: "auto", alignSelf: "flex-end", marginBottom: 4,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    },
    twoCol: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.25rem", alignItems: "start" },
    card: {
        background: "#fff", borderRadius: 16, padding: "1.5rem",
        border: "1px solid #e8edf2", boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
    },
    cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" },
    cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a" },
    fieldList: { display: "flex", flexDirection: "column", gap: "1rem" },
    fieldRow: { display: "flex", flexDirection: "column", gap: 5 },
    fieldLabel: { fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" },
    fieldValue: { fontSize: 15, color: "#0f172a", fontWeight: 500 },
    fieldInput: {
        width: "100%", padding: "9px 12px", borderRadius: 8,
        border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a",
        outline: "none", fontFamily: "inherit", boxSizing: "border-box",
        background: "#f8fafc", transition: "border-color 0.2s",
    },
    inputErr: { borderColor: "#f87171", background: "#fff5f5" },
    errText: { fontSize: 12, color: "#dc2626", marginTop: 3 },
    saveBtn: {
        padding: "7px 16px", borderRadius: 8, border: "none",
        background: "#1e293b", color: "#fff", fontSize: 13,
        fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
    },
    cancelBtn: {
        padding: "7px 16px", borderRadius: 8, border: "1.5px solid #e2e8f0",
        background: "#fff", color: "#64748b", fontSize: 13,
        fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
    },
    infoRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #f1f5f9" },
    infoLabel: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
    infoValue: { fontSize: 13, color: "#374151", fontWeight: 500 },
    hintCard: {
        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
        borderRadius: 16, padding: "1.25rem",
        border: "1px solid #bfdbfe", textAlign: "center",
    },
    uploadBtn: {
        marginTop: 12, padding: "7px 18px", borderRadius: 8,
        background: "#1d4ed8", color: "#fff", border: "none",
        fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
    },
    toast: {
        position: "fixed", bottom: 24, right: 24,
        padding: "12px 18px", borderRadius: 10,
        border: "1.5px solid", fontSize: 13, fontWeight: 500,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 600,
    },
};