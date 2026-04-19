import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function OAuth2Callback() {
    const [params] = useSearchParams();
    const { login } = useAuth();
    const navigate  = useNavigate();

    useEffect(() => {
        const token  = params.get("token");
        const role   = params.get("role");
        const name   = params.get("name");
        const userId = params.get("userId");

        if (token) {
            login({ token, id: userId, name: decodeURIComponent(name || ""), role, email: "", userName: "" });
            navigate(role === "ADMIN" ? "/admin/dashboard" : "/dashboard", { replace: true });
        } else {
            navigate("/login?error=oauth2_failed", { replace: true });
        }
    }, []);

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#64748b", fontSize: "14px" }}>
            Completing sign-in, please wait…
        </div>
    );
}