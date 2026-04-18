import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import ResourceDetail from './pages/facilities/ResourceDetail';
import BookingsPage from './pages/BookingsPage';
import BookingDetail from './pages/bookings/BookingDetail';
import Home from "./pages/Home/Home";

/**
 * App Component
 * Main application component with routing
 */
function App() {
  // TODO: Replace with actual user role from auth context
  const [isAdmin] = useState(true);

  return (
      <BrowserRouter>
        <Routes>
          {/* Facilities Module Routes */}
          <Route path="/facilities" element={<FacilitiesPage isAdmin={isAdmin} />} />
          <Route path="/facilities/:id" element={<ResourceDetail isAdmin={isAdmin} />} />

          {/* Bookings Module Routes */}
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetail />} />

          {/* Home Route */}
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;