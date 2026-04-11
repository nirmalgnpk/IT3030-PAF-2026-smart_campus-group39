import React from 'react';
import ResourceList from './ResourceList';

/**
 * FacilitiesPage Component
 * Main page for browsing and managing campus facilities and assets
 */
const FacilitiesPage = ({ isAdmin = false }) => {
  const stats = [
    { label: 'Total Rooms', value: '48', icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { label: 'Available', value: '36', icon: <><circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/></> },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>

      {/* ── Hero header ── */}
      <div style={{ backgroundColor: '#0B1F3A', position: 'relative', overflow: 'hidden' }}>

        {/* Subtle geometric decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '288px', height: '288px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', top: '-32px', right: '-32px', width: '208px', height: '208px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '33.33%', width: '1px', height: '100%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '66.66%', width: '1px', height: '100%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        </div>

        {/* Accent gradient bar at very top */}
        <div style={{ height: '4px', width: '100%', background: 'linear-gradient(to right, #1A3F8F, #C8963E, #1D9E75)' }} />

        <div style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div>
              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: 'rgba(200,150,62,0.2)', border: '1px solid rgba(200,150,62,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="#C8963E"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8963E' }}>
                  Smart Campus
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: 'white', lineHeight: 'tight', fontFamily: 'Syne, sans-serif' }}>
                Campus Facilities
                <span style={{ color: '#C8963E' }}> & </span>
                Assets
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontWeight: '500' }}>
                Browse, filter, and book campus resources in real time
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
              {stats.map(({ label, value, icon }) => (
                <div key={label}
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '0.75rem 1rem', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)' }} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', lineHeight: 'none', fontFamily: 'Syne, sans-serif' }}>{value}</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.125rem' }}>{label}</div>
                </div>
              ))}

              {isAdmin && (
                <div style={{ backgroundColor: 'rgba(200,150,62,0.15)', border: '1px solid rgba(200,150,62,0.3)', borderRadius: '12px', padding: '0.75rem 1rem', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: 'rgba(200,150,62,0.7)' }} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#C8963E', lineHeight: 'none', fontFamily: 'Syne, sans-serif' }}>Admin</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,150,62,0.6)', marginTop: '0.125rem' }}>Mode</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <ResourceList isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default FacilitiesPage;
