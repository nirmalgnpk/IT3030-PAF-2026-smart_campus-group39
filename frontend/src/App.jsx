import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import ResourceDetail from './pages/facilities/ResourceDetail';
import Home from "./pages/Home/Home";
import TicketPage from "./pages/tickets/TicketPage";

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

          {/* Home Route */}
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<TicketPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;