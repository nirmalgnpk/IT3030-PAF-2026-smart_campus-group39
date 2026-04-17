import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("sc_token");

        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            axios.get("/api/auth/verify")
                .then(({ data }) => {
                    if (data.valid) {
                        setCurrentUser({
                            id:              data.userId,
                            email:           data.email,
                            role:            data.role,
                            name:            data.name            || "",
                            userName:        data.userName         || "",
                            profilePhotoUrl: data.profilePhotoUrl  || "",
                            token,
                        });
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

    const login = (userData) => {
        const { token, ...user } = userData;
        localStorage.setItem("sc_token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setCurrentUser({ ...user, token });
    };

    const logout = () => {
        axios.post("/api/auth/logout").catch(() => {});
        clearAuth();
    };

    const clearAuth = () => {
        localStorage.removeItem("sc_token");
        delete axios.defaults.headers.common["Authorization"];
        setCurrentUser(null);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center",
                justifyContent: "center", fontFamily: "'Inter', sans-serif",
                color: "#64748b", fontSize: "14px",
            }}>
                Loading…
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}