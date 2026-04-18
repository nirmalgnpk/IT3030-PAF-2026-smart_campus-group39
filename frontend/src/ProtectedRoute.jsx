import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser)
        return <Navigate to="/login" state={{ from: location }} replace />;

    if (roles.length > 0 && !roles.includes(currentUser.role))
        return <Navigate to="/dashboard" replace />;

    return children;
}