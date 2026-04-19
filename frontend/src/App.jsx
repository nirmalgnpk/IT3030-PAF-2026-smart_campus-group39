import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/Login/ForgotPassword";
import OAuth2Callback from "./pages/Login/Oauth2callback";

import FacilitiesPage from "./pages/facilities/FacilitiesPage";
import ResourceDetail from "./pages/facilities/ResourceDetail";

import TicketPage from "./pages/tickets/TicketPage";
import TicketListPage from "./pages/tickets/TicketListPage";
import TicketCreatePage from "./pages/tickets/TicketCreatePage";
import TicketDetailPage from "./pages/tickets/TicketDetailPage";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Profile/Profile";

function App() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'DM Sans', 'Segoe UI', sans-serif; background: #f1f5f9; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
                input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }
                button:hover { opacity: 0.92; }
                a:hover { opacity: 0.85; }
            `}</style>

            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/oauth-callback" element={<OAuth2Callback />} />

                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/facilities"
                            element={
                                <ProtectedRoute>
                                    <FacilitiesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/facilities/:id"
                            element={
                                <ProtectedRoute>
                                    <ResourceDetail />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/tickets"
                            element={
                                <ProtectedRoute>
                                    <TicketPage />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<TicketListPage />} />
                            <Route path="list" element={<TicketListPage />} />
                            <Route path="new" element={<TicketCreatePage />} />
                            <Route path=":id" element={<TicketDetailPage />} />
                        </Route>

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute roles={["ADMIN"]}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/tickets"
                            element={
                                <ProtectedRoute roles={["TECHNICIAN", "ADMIN"]}>
                                    <TicketPage />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<TicketListPage />} />
                            <Route path="list" element={<TicketListPage />} />
                            <Route path="new" element={<TicketCreatePage />} />
                            <Route path=":id" element={<TicketDetailPage />} />
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </>
    );
}

export default App;
