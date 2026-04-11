import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import ResourceDetail from './pages/facilities/ResourceDetail';

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

        {/* Add your other routes here */}
        <Route 
          path="/" 
          element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)' }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
                  Smart Campus Management System
                </h1>
                <p style={{ color: '#475569', marginBottom: '2rem', fontSize: '16px' }}>
                  Navigate to <code style={{ color: '#2563eb', fontFamily: 'monospace' }}>/facilities</code> to get started
                </p>
                <a 
                  href="/facilities"
                  style={{ display: 'inline-block', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', padding: '0.5rem 1.5rem', borderRadius: '8px', textDecoration: 'none', transition: 'background-color 150ms ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  Go to Facilities
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
