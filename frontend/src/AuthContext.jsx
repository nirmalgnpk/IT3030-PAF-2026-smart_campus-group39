import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

// ── Helper: normalize user object so both id and userId are always set ───────
function normalizeUser(userData, token) {
    return {
        ...userData,
        id:     userData.id     || userData.userId,
        userId: userData.userId || userData.id,
        token:  token || userData.token,
    };
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading]         = useState(true);

    // ── On mount: restore session from localStorage via /api/auth/verify ──────
    useEffect(() => {
        const token = localStorage.getItem("sc_token");

        if (token) {
            api.get("/api/auth/verify")
                .then(({ data }) => {
                    if (data.valid) {
                        setCurrentUser(normalizeUser({
                            id:              data.userId,
                            userId:          data.userId,
                            email:           data.email           || "",
                            role:            data.role            || "USER",
                            name:            data.name            || "",
                            userName:        data.userName        || "",
                            profilePhotoUrl: data.profilePhotoUrl || "",
                            provider:        data.provider        || "LOCAL",
                        }, token));
                    } else {
                        clearAuth();
                    }
                })
                .catch(() => clearAuth())
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // ── login: called after register / login API success or OAuth callback ────
    const login = (userData) => {
        const token = userData.token;

        if (token) {
            localStorage.setItem("sc_token", token);
        }

        const normalized = normalizeUser(userData, token);
        setCurrentUser(normalized);
    };

    // ── logout ────────────────────────────────────────────────────────────────
    const logout = () => {
        api.post("/api/auth/logout").catch(() => {});
        clearAuth();
    };

    // ── clearAuth ─────────────────────────────────────────────────────────────
    const clearAuth = () => {
        localStorage.removeItem("sc_token");
        setCurrentUser(null);
    };

    // ── getAuthHeader: use when you need to pass headers manually to axios ────
    // e.g.  axios.post(url, data, { headers: getAuthHeader() })
    const getAuthHeader = () => {
        const token = localStorage.getItem("sc_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // ── Loading screen ────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                color: "#64748b",
                fontSize: 14,
                background: "#f8fafc",
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        border: "3px solid #e2e8f0", borderTopColor: "#3b82f6",
                        animation: "sc_spin 0.8s linear infinite",
                    }} />
                    <span>Loading...</span>
                    <style>{`@keyframes sc_spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading, getAuthHeader }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}