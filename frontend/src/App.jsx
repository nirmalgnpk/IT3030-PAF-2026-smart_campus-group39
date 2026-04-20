import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/Login/ForgotPassword";
import OAuth2Callback from "./pages/Login/Oauth2callback";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Profile from "./pages/Profile/Profile";
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import BookingsPage from './pages/BookingsPage';

// Lazy placeholders — replace with your real page components
const ResourceDetail = () => <div style={{ padding: "2rem", fontFamily: "inherit" }}><h2>Resource Detail</h2></div>;
const BookingDetail = () => <div style={{ padding: "2rem", fontFamily: "inherit" }}><h2>Booking Detail</h2></div>;
const Tickets = () => <div style={{ padding: "2rem", fontFamily: "inherit" }}><h2>Tickets</h2></div>;
const Notifications = () => <div style={{ padding: "2rem", fontFamily: "inherit" }}><h2>Notifications</h2></div>;

/**
 * App Component
 * Main application component with routing
 */
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
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth-callback" element={<OAuth2Callback />} />

            {/* Protected — any logged-in user */}
            <Route path="/profile" element={
              <ProtectedRoute roles={["STUDENT", "FACULTY", "ADMIN"]}><Profile /></ProtectedRoute>
            } />

            {/* Facilities Module Routes */}
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/facilities/:id" element={<ResourceDetail />} />

            {/* Bookings Module Routes */}
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
            } />

            {/* Technician + Admin */}
            <Route path="/admin/tickets" element={
              <ProtectedRoute roles={["TECHNICIAN", "ADMIN"]}><Tickets /></ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
