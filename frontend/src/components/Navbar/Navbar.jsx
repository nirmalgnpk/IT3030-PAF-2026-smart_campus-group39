import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const NAV_LINKS = [
  { to: "/",              label: "Home" },
  { to: "/facilities",    label: "Resources" },
  { to: "/bookings",      label: "Bookings" },
  { to: "/tickets",       label: "Tickets" },
  { to: "/notifications", label: "Notifications" },
];

function initials(name = "") {
  return name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

function getAvatarColor(email = "") {
  const colors = ["#3b82f6","#8b5cf6","#ec4899","#f59e0b","#10b981","#ef4444"];
  return colors[email.charCodeAt(0) % colors.length];
}

const ROLE_CONFIG = {
  USER:       { label: "Student",      bg: "#eff6ff", color: "#1d4ed8", icon: "🎓" },
  STUDENT:    { label: "Student",      bg: "#eff6ff", color: "#1d4ed8", icon: "🎓" },
  TECHNICIAN: { label: "Technician",   bg: "#f0fdf4", color: "#15803d", icon: "🔧" },
  MANAGER:    { label: "Manager",      bg: "#fdf4ff", color: "#7e22ce", icon: "📋" },
  ADMIN:      { label: "Admin",        bg: "#fef3c7", color: "#92400e", icon: "⚡" },
};

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef    = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const roleInfo = currentUser ? (ROLE_CONFIG[currentUser.role] || ROLE_CONFIG.USER) : null;
  const avatarColor = getAvatarColor(currentUser?.email || "");

  function isActive(path) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  return (
      <nav style={S.nav}>
        {/* Logo */}
        <Link to="/" style={S.logo}>
          <div style={S.logoIcon}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>SC</span>
          </div>
          <span style={S.logoText}>Smart Campus</span>
        </Link>

        {/* Nav links */}
        <ul style={S.links}>
          {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                    to={to}
                    style={{
                      ...S.link,
                      ...(isActive(to) ? S.linkActive : {}),
                    }}
                >
                  {label}
                  {isActive(to) && <span style={S.linkDot} />}
                </Link>
              </li>
          ))}
          {currentUser?.role === "ADMIN" && (
              <li>
                <Link
                    to="/admin/dashboard"
                    style={{
                      ...S.link,
                      ...(isActive("/admin") ? S.linkActive : {}),
                      color: isActive("/admin") ? "#fbbf24" : "#fbbf24",
                      opacity: isActive("/admin") ? 1 : 0.8,
                    }}
                >
                  ⚡ Admin
                  {isActive("/admin") && <span style={{ ...S.linkDot, background: "#fbbf24" }} />}
                </Link>
              </li>
          )}
        </ul>

        {/* Right side */}
        <div style={S.rightSide}>
          {currentUser ? (
              <div style={{ position: "relative" }} ref={menuRef}>
                {/* Avatar button */}
                <button
                    style={S.avatarBtn}
                    onClick={() => setMenuOpen((o) => !o)}
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                >
                  {currentUser.profilePhotoUrl ? (
                      <img
                          src={currentUser.profilePhotoUrl}
                          alt="Profile"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                  ) : (
                      <div style={{ ...S.avatarFallback, background: avatarColor }}>
                        {initials(currentUser.name)}
                      </div>
                  )}
                  {/* Online indicator */}
                  <span style={S.onlineDot} />
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <div style={S.dropdown}>
                      {/* Header */}
                      <div style={S.dropHeader}>
                        <div style={S.dropAvatarRow}>
                          <div style={S.dropAvatar}>
                            {currentUser.profilePhotoUrl ? (
                                <img src={currentUser.profilePhotoUrl} alt="Profile"
                                     style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                            ) : (
                                <div style={{ ...S.dropAvatarFallback, background: avatarColor }}>
                                  {initials(currentUser.name)}
                                </div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={S.dropName}>{currentUser.name || currentUser.userName}</p>
                            <p style={S.dropEmail}>{currentUser.email}</p>
                          </div>
                        </div>
                        {roleInfo && (
                            <span style={{
                              display: "inline-flex", alignItems: "center", gap: 4,
                              fontSize: 11, fontWeight: 600,
                              padding: "2px 9px", borderRadius: 20, marginTop: 8,
                              background: roleInfo.bg, color: roleInfo.color,
                            }}>
                      {roleInfo.icon} {roleInfo.label}
                    </span>
                        )}
                      </div>

                      {/* Menu items */}
                      <div style={S.dropBody}>
                        <Link
                            to="/profile"
                            style={S.dropItem}
                            onClick={() => setMenuOpen(false)}
                        >
                          <span style={S.dropItemIcon}>👤</span>
                          <span>My Profile</span>
                        </Link>
                        <Link
                            to="/bookings"
                            style={S.dropItem}
                            onClick={() => setMenuOpen(false)}
                        >
                          <span style={S.dropItemIcon}>📅</span>
                          <span>My Bookings</span>
                        </Link>
                        <Link
                            to="/notifications"
                            style={S.dropItem}
                            onClick={() => setMenuOpen(false)}
                        >
                          <span style={S.dropItemIcon}>🔔</span>
                          <span>Notifications</span>
                        </Link>

                        {currentUser.role === "ADMIN" && (
                            <>
                              <div style={S.dropDivider} />
                              <Link
                                  to="/admin/dashboard"
                                  style={S.dropItem}
                                  onClick={() => setMenuOpen(false)}
                              >
                                <span style={S.dropItemIcon}>⚡</span>
                                <span>Admin Dashboard</span>
                              </Link>
                            </>
                        )}
                      </div>

                      <div style={S.dropFooter}>
                        <button style={S.dropLogout} onClick={handleLogout}>
                          <span style={S.dropItemIcon}>🚪</span>
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                )}
              </div>
          ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login" style={S.loginBtn}>Sign in</Link>
                <Link to="/register" style={S.registerBtn}>Register</Link>
              </div>
          )}
        </div>
      </nav>
  );
}

const S = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 1.75rem",
    height: 60,
    backgroundColor: "#0f172a",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid #1e293b",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
  },
  logo: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 9,
    letterSpacing: "-0.2px",
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(59,130,246,0.4)",
  },
  logoText: { color: "#f1f5f9", fontWeight: 700 },
  links: { listStyle: "none", display: "flex", gap: 2, alignItems: "center" },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    padding: "5px 11px",
    borderRadius: 7,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    transition: "color 0.15s",
  },
  linkActive: { color: "#f1f5f9" },
  linkDot: {
    width: 4, height: 4, borderRadius: "50%",
    background: "#3b82f6", position: "absolute", bottom: -1,
  },
  rightSide: { display: "flex", alignItems: "center", gap: 10 },
  avatarBtn: {
    width: 36, height: 36, borderRadius: "50%",
    border: "2px solid #334155",
    background: "#1e293b",
    cursor: "pointer",
    overflow: "hidden",
    padding: 0,
    position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "border-color 0.2s",
  },
  avatarFallback: {
    width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#fff",
  },
  onlineDot: {
    position: "absolute", bottom: 0, right: 0,
    width: 9, height: 9, borderRadius: "50%",
    background: "#22c55e", border: "2px solid #0f172a",
  },
  dropdown: {
    position: "absolute", top: 46, right: 0,
    width: 240,
    background: "#fff",
    border: "1px solid #e8edf2",
    borderRadius: 14,
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 200,
    animation: "fadeIn 0.15s ease",
  },
  dropHeader: { padding: "14px 14px 10px" },
  dropAvatarRow: { display: "flex", alignItems: "center", gap: 10 },
  dropAvatar: {
    width: 38, height: 38, borderRadius: "50%",
    background: "#f1f5f9", flexShrink: 0, overflow: "hidden",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  dropAvatarFallback: {
    width: "100%", height: "100%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff",
  },
  dropName: { fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  dropEmail: { fontSize: 11, color: "#94a3b8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  dropBody: { borderTop: "1px solid #f1f5f9", padding: "6px 6px" },
  dropItem: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 10px", borderRadius: 8,
    fontSize: 13, color: "#374151", textDecoration: "none",
    transition: "background 0.12s",
  },
  dropItemIcon: { fontSize: 15, lineHeight: 1 },
  dropDivider: { height: 1, background: "#f1f5f9", margin: "4px 0" },
  dropFooter: { borderTop: "1px solid #f1f5f9", padding: "6px 6px" },
  dropLogout: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 10px", width: "100%",
    fontSize: 13, color: "#ef4444",
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "inherit", borderRadius: 8, textAlign: "left",
    transition: "background 0.12s",
  },
  loginBtn: {
    padding: "6px 14px",
    background: "#1e293b",
    color: "#f1f5f9",
    border: "1px solid #334155",
    borderRadius: 8,
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: "inherit", textDecoration: "none",
  },
  registerBtn: {
    padding: "6px 14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", textDecoration: "none",
  },
};