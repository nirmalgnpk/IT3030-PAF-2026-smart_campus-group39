import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import ResourceDetail from './pages/facilities/ResourceDetail';
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

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

          {/* Home Route */}
          <Route path="/" element={<Home />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Facilities Module Routes */}
          <Route path="/facilities" element={<FacilitiesPage isAdmin={isAdmin} />} />
          <Route path="/facilities/:id" element={<ResourceDetail isAdmin={isAdmin} />} />

        </Routes>
      </BrowserRouter>
  );
}

export default App;