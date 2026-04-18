import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import axios from "axios";

const ROLE_COLORS = {
    STUDENT:    { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
    USER:       { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
    TECHNICIAN: { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
    MANAGER:    { bg: "#fdf4ff", color: "#7e22ce", dot: "#a855f7" },
    ADMIN:      { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
};

function RoleBadge({ role }) {
    const cfg = ROLE_COLORS[role] || ROLE_COLORS.USER;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            background: cfg.bg, color: cfg.color,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
            {role}
        </span>
    );
}

function StatusBadge({ enabled }) {
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 20,
            fontSize: 12, fontWeight: 600,
            background: enabled ? "#f0fdf4" : "#fef2f2",
            color: enabled ? "#15803d" : "#dc2626",
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: enabled ? "#22c55e" : "#ef4444",
                display: "inline-block",
            }} />
            {enabled ? "Active" : "Disabled"}
        </span>
    );
}

function Avatar({ user, size = 36 }) {
    const initials = (user.name || user.userName || "?")
        .trim().split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
    const colors = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444"];
    const color  = colors[(user.email || "").charCodeAt(0) % colors.length];

    return user.profilePhotoUrl ? (
        <img src={user.profilePhotoUrl} alt={user.name}
             style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }} />
    ) : (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: color, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: size * 0.35,
            fontWeight: 700, color: "#fff",
        }}>{initials}</div>
    );
}

export default function AdminDashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers]               = useState([]);
    const [loading, setLoading]           = useState(true);
    const [search, setSearch]             = useState("");
    const [roleFilter, setRoleFilter]     = useState("ALL");
    const [editUser, setEditUser]         = useState(null);
    const [editForm, setEditForm]         = useState({});
    const [saving, setSaving]             = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast]               = useState(null);
    const [activeTab, setActiveTab]       = useState("users");

    // ── Build auth header from token stored in localStorage / sessionStorage ──
    function authHeader() {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    useEffect(() => {
        // Guard: only admins can access this page
        if (currentUser && currentUser.role !== "ADMIN") {
            navigate("/");
            return;
        }
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        try {
            const { data } = await axios.get("/api/users", { headers: authHeader() });
            setUsers(data);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                showToast("Session expired — please log in again", "error");
                logout();
                navigate("/login");
            } else {
                showToast("Failed to load users", "error");
            }
        } finally {
            setLoading(false);
        }
    }

    function showToast(msg, type = "success") {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    }

    function openEdit(user) {
        setEditUser(user);
        setEditForm({ name: user.name, userName: user.userName, email: user.email, role: user.role });
    }

    async function saveEdit() {
        setSaving(true);
        try {
            await axios.put(`/api/users/${editUser.id}`, editForm, { headers: authHeader() });
            setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editForm } : u));
            setEditUser(null);
            showToast("User updated successfully");
        } catch {
            showToast("Failed to update user", "error");
        } finally {
            setSaving(false);
        }
    }

    async function toggleStatus(user) {
        try {
            await axios.put(`/api/users/${user.id}`, { enabled: !user.enabled }, { headers: authHeader() });
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, enabled: !u.enabled } : u));
            showToast(`User ${!user.enabled ? "enabled" : "disabled"}`);
        } catch {
            showToast("Failed to update status", "error");
        }
    }

    async function confirmDelete() {
        try {
            await axios.delete(`/api/users/${deleteTarget.id}`, { headers: authHeader() });
            setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
            setDeleteTarget(null);
            showToast("User deleted");
        } catch {
            showToast("Failed to delete user", "error");
        }
    }

    const filtered = users.filter(u => {
        const q = search.toLowerCase();
        const matchSearch = !q || u.name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) || u.userName?.toLowerCase().includes(q);
        const matchRole = roleFilter === "ALL" || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const stats = {
        total:       users.length,
        students:    users.filter(u => u.role === "STUDENT" || u.role === "USER").length,
        technicians: users.filter(u => u.role === "TECHNICIAN").length,
        admins:      users.filter(u => u.role === "ADMIN").length,
        active:      users.filter(u => u.enabled).length,
    };

    return (
        <div style={S.page}>
            {/* Sidebar */}
            <aside style={S.sidebar}>
                <div style={S.sidebarTop}>
                    <div style={S.sideLogoRow}>
                        <div style={S.sideLogo}>SC</div>
                        <div>
                            <div style={S.sideLogoText}>Smart Campus</div>
                            <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>Admin Panel</div>
                        </div>
                    </div>

                    <nav style={{ marginTop: "2rem" }}>
                        {[
                            { id: "users", icon: "👥", label: "Users" },
                            { id: "stats", icon: "📊", label: "Overview" },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={{ ...S.navItem, ...(activeTab === item.id ? S.navItemActive : {}) }}
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}

                        <div style={{ borderTop: "1px solid #1e293b", margin: "1rem 0" }} />

                        <Link to="/" style={{ ...S.navItem, textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                            <span>🏠</span><span>Main App</span>
                        </Link>

                        <button onClick={() => { logout(); navigate("/login"); }} style={{ ...S.navItem, color: "#f87171" }}>
                            <span>🚪</span><span>Sign out</span>
                        </button>
                    </nav>
                </div>

                <div style={S.sideAdminCard}>
                    <Avatar user={currentUser || {}} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {currentUser?.name || "Admin"}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>Administrator</div>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={S.main}>
                <header style={S.header}>
                    <div>
                        <h1 style={S.pageTitle}>{activeTab === "users" ? "User Management" : "Overview"}</h1>
                        <p style={S.pageSubtitle}>
                            {activeTab === "users" ? `${filtered.length} of ${users.length} users` : "Platform statistics"}
                        </p>
                    </div>
                </header>

                {/* Stats */}
                <div style={S.statsGrid}>
                    {[
                        { label: "Total Users",  value: stats.total,       icon: "👥", color: "#3b82f6", bg: "#eff6ff" },
                        { label: "Students",      value: stats.students,    icon: "🎓", color: "#1d4ed8", bg: "#dbeafe" },
                        { label: "Technicians",   value: stats.technicians, icon: "🔧", color: "#15803d", bg: "#dcfce7" },
                        { label: "Admins",        value: stats.admins,      icon: "⚡", color: "#92400e", bg: "#fef3c7" },
                        { label: "Active",        value: stats.active,      icon: "✅", color: "#059669", bg: "#d1fae5" },
                    ].map(s => (
                        <div key={s.label} style={S.statCard}>
                            <div style={{ ...S.statIcon, background: s.bg, color: s.color }}>{s.icon}</div>
                            <div style={S.statVal}>{s.value}</div>
                            <div style={S.statLabel}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {activeTab === "users" && (
                    <>
                        {/* Filters */}
                        <div style={S.filterBar}>
                            <div style={S.searchWrap}>
                                <span style={{ position: "absolute", left: 11, fontSize: 14, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
                                <input
                                    style={S.searchInput}
                                    placeholder="Search by name, email, username…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <div style={S.roleFilters}>
                                {["ALL", "STUDENT", "USER", "TECHNICIAN", "MANAGER", "ADMIN"].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setRoleFilter(r)}
                                        style={{ ...S.filterChip, ...(roleFilter === r ? S.filterChipActive : {}) }}
                                    >
                                        {r === "ALL" ? "All Roles" : r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Table */}
                        <div style={S.tableWrap}>
                            {loading ? (
                                <div style={S.emptyState}>Loading users…</div>
                            ) : filtered.length === 0 ? (
                                <div style={S.emptyState}>No users found</div>
                            ) : (
                                <table style={S.table}>
                                    <thead>
                                    <tr>
                                        {["User", "Email", "Role", "Provider", "Status", "Joined", "Actions"].map(h => (
                                            <th key={h} style={S.th}>{h}</th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((user, i) => (
                                        <tr key={user.id} style={{ ...S.tr, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                            <td style={S.td}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <Avatar user={user} size={34} />
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{user.name || "—"}</div>
                                                        <div style={{ fontSize: 11, color: "#94a3b8" }}>@{user.userName || "—"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={S.td}><span style={{ fontSize: 13, color: "#475569" }}>{user.email}</span></td>
                                            <td style={S.td}><RoleBadge role={user.role} /></td>
                                            <td style={S.td}><span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{user.provider || "LOCAL"}</span></td>
                                            <td style={S.td}><StatusBadge enabled={user.enabled} /></td>
                                            <td style={S.td}>
                                                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                                                    {user.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                                                        : "—"}
                                                </span>
                                            </td>
                                            <td style={S.td}>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button onClick={() => openEdit(user)} style={S.actionBtn} title="Edit">✏️</button>
                                                    <button onClick={() => toggleStatus(user)} style={S.actionBtn} title={user.enabled ? "Disable" : "Enable"}>
                                                        {user.enabled ? "🔒" : "🔓"}
                                                    </button>
                                                    {user.id !== currentUser?.id && (
                                                        <button onClick={() => setDeleteTarget(user)} style={{ ...S.actionBtn, color: "#ef4444" }} title="Delete">🗑️</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </>
                )}

                {activeTab === "stats" && (
                    <div style={{ padding: "2rem", color: "#64748b", fontSize: 14 }}>
                        Platform statistics overview coming soon. All user data is shown in the Users tab.
                    </div>
                )}
            </main>

            {/* Edit Modal */}
            {editUser && (
                <div style={S.overlay} onClick={() => setEditUser(null)}>
                    <div style={S.modal} onClick={e => e.stopPropagation()}>
                        <h2 style={S.modalTitle}>Edit User</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.25rem" }}>
                            {[
                                { key: "name",     label: "Full Name" },
                                { key: "userName", label: "Username" },
                                { key: "email",    label: "Email" },
                            ].map(({ key, label }) => (
                                <div key={key}>
                                    <label style={S.modalLabel}>{label}</label>
                                    <input
                                        style={S.modalInput}
                                        value={editForm[key] || ""}
                                        onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={S.modalLabel}>Role</label>
                                <select
                                    style={S.modalInput}
                                    value={editForm.role || "USER"}
                                    onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}
                                >
                                    {["USER", "STUDENT", "TECHNICIAN", "MANAGER", "ADMIN"].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, marginTop: "1.5rem", justifyContent: "flex-end" }}>
                            <button onClick={() => setEditUser(null)} style={S.modalCancelBtn}>Cancel</button>
                            <button onClick={saveEdit} disabled={saving} style={S.modalSaveBtn}>
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteTarget && (
                <div style={S.overlay} onClick={() => setDeleteTarget(null)}>
                    <div style={{ ...S.modal, maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                        <h2 style={{ ...S.modalTitle, fontSize: 18 }}>Delete User?</h2>
                        <p style={{ fontSize: 14, color: "#64748b", margin: "8px 0 20px" }}>
                            This will permanently delete <strong>{deleteTarget.name || deleteTarget.email}</strong>. This cannot be undone.
                        </p>
                        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                            <button onClick={() => setDeleteTarget(null)} style={S.modalCancelBtn}>Cancel</button>
                            <button onClick={confirmDelete} style={{ ...S.modalSaveBtn, background: "#ef4444" }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div style={{
                    ...S.toast,
                    background:  toast.type === "error" ? "#fef2f2" : "#f0fdf4",
                    borderColor: toast.type === "error" ? "#fecaca" : "#bbf7d0",
                    color:       toast.type === "error" ? "#dc2626" : "#15803d",
                }}>
                    {toast.type === "error" ? "❌" : "✅"} {toast.msg}
                </div>
            )}
        </div>
    );
}

const S = {
    page: { display: "flex", minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
    sidebar: {
        width: 220, background: "#0f172a", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "1.5rem 1rem",
        position: "sticky", top: 0, height: "100vh", flexShrink: 0,
    },
    sidebarTop: { flex: 1 },
    sideLogoRow: { display: "flex", alignItems: "center", gap: 10 },
    sideLogo: {
        width: 36, height: 36, borderRadius: 9,
        background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 700, color: "#fff",
    },
    sideLogoText: { fontSize: 14, fontWeight: 700, color: "#f1f5f9" },
    navItem: {
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "9px 12px", borderRadius: 8, border: "none",
        background: "transparent", color: "#94a3b8", fontSize: 14,
        fontWeight: 500, cursor: "pointer", textAlign: "left",
        fontFamily: "inherit", marginBottom: 2, transition: "all 0.15s",
    },
    navItemActive: { background: "#1e293b", color: "#f1f5f9" },
    sideAdminCard: {
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px", background: "#1e293b", borderRadius: 10,
    },
    main: { flex: 1, padding: "2rem", overflow: "auto" },
    header: { marginBottom: "1.75rem" },
    pageTitle: { fontSize: 24, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.5px" },
    pageSubtitle: { fontSize: 14, color: "#64748b", marginTop: 3 },
    statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 12, marginBottom: "1.75rem" },
    statCard: {
        background: "#fff", borderRadius: 14, padding: "1rem 1.25rem",
        boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex",
        flexDirection: "column", gap: 4, border: "1px solid #e8edf2",
    },
    statIcon: { width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginBottom: 4 },
    statVal: { fontSize: 26, fontWeight: 700, color: "#0f172a", letterSpacing: "-1px" },
    statLabel: { fontSize: 12, color: "#64748b", fontWeight: 500 },
    filterBar: { display: "flex", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" },
    searchWrap: { position: "relative", flex: "1 1 240px", minWidth: 200 },
    searchInput: {
        width: "100%", padding: "9px 12px 9px 34px",
        borderRadius: 10, border: "1.5px solid #e2e8f0",
        fontSize: 14, color: "#0f172a", outline: "none",
        fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
    },
    roleFilters: { display: "flex", gap: 6, flexWrap: "wrap" },
    filterChip: {
        padding: "5px 12px", borderRadius: 20, border: "1.5px solid #e2e8f0",
        background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
        color: "#64748b", fontFamily: "inherit",
    },
    filterChipActive: { background: "#1e293b", color: "#fff", borderColor: "#1e293b" },
    tableWrap: { background: "#fff", borderRadius: 14, border: "1px solid #e8edf2", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "12px 16px", textAlign: "left", fontSize: 11,
        fontWeight: 700, color: "#94a3b8", textTransform: "uppercase",
        letterSpacing: "0.06em", borderBottom: "1.5px solid #f1f5f9", background: "#f8fafc",
    },
    tr: { transition: "background 0.1s" },
    td: { padding: "12px 16px", borderBottom: "1px solid #f1f5f9" },
    actionBtn: { padding: "5px 8px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1 },
    emptyState: { padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: 14 },
    overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500, padding: "1rem" },
    modal: { background: "#fff", borderRadius: 16, padding: "2rem", width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
    modalTitle: { fontSize: 20, fontWeight: 700, color: "#0f172a" },
    modalLabel: { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" },
    modalInput: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box" },
    modalCancelBtn: { padding: "8px 18px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
    modalSaveBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#1e293b", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    toast: { position: "fixed", bottom: 24, right: 24, padding: "12px 18px", borderRadius: 10, border: "1.5px solid", fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 600, display: "flex", alignItems: "center", gap: 8 },
};