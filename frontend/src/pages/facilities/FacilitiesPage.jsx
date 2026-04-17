import React, { useState, useEffect } from 'react';
import ResourceList from './ResourceList';
import { getAllResources } from '../../services/resourceService';

/**
 * FacilitiesPage Component
 * Main page for browsing and managing campus facilities and assets
 */
const FacilitiesPage = ({ isAdmin = false }) => {
  const [resources, setResources] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAvailableModal, setShowAvailableModal] = useState(false);

  // Scrollbar styling for modal
  const scrollbarStyles = `
    .available-resources-modal::-webkit-scrollbar {
      width: 4px;
    }
    .available-resources-modal::-webkit-scrollbar-track {
      background: transparent;
    }
    .available-resources-modal::-webkit-scrollbar-thumb {
      background: rgba(11, 31, 58, 0.15);
      border-radius: 2px;
    }
    .available-resources-modal::-webkit-scrollbar-thumb:hover {
      background: rgba(11, 31, 58, 0.25);
    }
    .available-resources-modal {
      scrollbar-width: thin;
      scrollbar-color: rgba(11, 31, 58, 0.15) transparent;
    }
  `;

  // Fetch resources for stats calculation
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllResources();
        setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load resources for stats:', err);
        setResources([]);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate stats from real data
  const totalRooms = resources.length;
  const availableRooms = resources.filter(r => r.status === 'ACTIVE' || r.status === 'active').length;
  const availableResources = resources.filter(r => r.status === 'ACTIVE' || r.status === 'active');

  const stats = [
    { label: 'Total Rooms', value: statsLoading ? '...' : totalRooms.toString(), icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
    { label: 'Available', value: statsLoading ? '...' : availableRooms.toString(), icon: <><circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/></>, onClick: () => setShowAvailableModal(true) },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <style>{scrollbarStyles}</style>

      {/* ── Hero header ── */}
      <div style={{ backgroundColor: '#0B1F3A', position: 'relative', overflow: 'hidden', backgroundImage: 'url(/image/56.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.65)', pointerEvents: 'none' }} />

        {/* Subtle geometric decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '288px', height: '288px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', top: '-32px', right: '-32px', width: '208px', height: '208px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '33.33%', width: '1px', height: '100%', backgroundColor: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '66.66%', width: '1px', height: '100%', backgroundColor: 'rgba(255,255,255,0.03)' }} />
        </div>

        {/* Accent gradient bar at very top */}
        <div style={{ height: '4px', width: '100%', background: 'linear-gradient(to right, #1A3F8F, #C8963E, #1D9E75)' }} />

        <div style={{ position: 'relative', maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', gap: 0, zIndex: 10, textAlign: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>

            <div>
              {/* Eyebrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: 'rgba(200,150,62,0.2)', border: '1px solid rgba(200,150,62,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none" stroke="#C8963E"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8963E' }}>
                  Smart Campus
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(36px, 7vw, 56px)', fontWeight: 'bold', color: 'white', lineHeight: 'tight', fontFamily: 'Syne, sans-serif' }}>
                Campus Facilities
                <span style={{ color: '#C8963E' }}> & </span>
                Assets
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontWeight: '500' }}>
                Browse, filter, and book campus resources in real time
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
              {stats.map(({ label, value, icon, onClick }) => (
                <div 
                  key={label}
                  onClick={onClick}
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.35)', 
                    border: '1px solid rgba(255,255,255,0.45)', 
                    borderRadius: '12px', 
                    padding: '0.75rem 1rem', 
                    textAlign: 'center', 
                    width: '90px', 
                    height: '90px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    cursor: onClick ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (onClick) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.45)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (onClick) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.35)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.85)' }} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {icon}
                    </svg>
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', lineHeight: 'none', fontFamily: 'Syne, sans-serif' }}>{value}</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginTop: '0.125rem' }}>{label}</div>
                </div>
              ))}

              {isAdmin && (
                <div style={{ backgroundColor: 'rgba(200,150,62,0.50)', border: '1px solid rgba(200,150,62,0.65)', borderRadius: '12px', padding: '0.75rem 1rem', textAlign: 'center', width: '90px', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: 'rgba(200,150,62,0.95)' }} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#C8963E', lineHeight: 'none', fontFamily: 'Syne, sans-serif' }}>Admin</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,150,62,0.9)', marginTop: '0.125rem' }}>Mode</div>
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

      {/* ── Available Resources Modal ── */}
      {showAvailableModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowAvailableModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            }}
            className="available-resources-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(11, 31, 58, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '20px', fontWeight: 'bold', color: '#0B1F3A' }}>
                  Available Resources
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
                  {availableResources.length} resource{availableResources.length !== 1 ? 's' : ''} available
                </p>
              </div>
              <button
                onClick={() => setShowAvailableModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6B7280',
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              {availableResources.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: '#9CA3AF',
                }}>
                  <p style={{ fontSize: '14px' }}>
                    No available resources at the moment.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {availableResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        padding: '1rem',
                        border: '1px solid rgba(11, 31, 58, 0.1)',
                        borderRadius: '8px',
                        backgroundColor: '#F9FAFB',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F3F4F6';
                        e.currentTarget.style.borderColor = 'rgba(11, 31, 58, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                        e.currentTarget.style.borderColor = 'rgba(11, 31, 58, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '15px', fontWeight: '600', color: '#0B1F3A' }}>
                            {resource.name}
                          </h3>
                          <span style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            backgroundColor: 'rgba(29, 158, 117, 0.1)',
                            color: '#1D9E75',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            Available
                          </span>
                        </div>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#6B7280',
                          backgroundColor: 'rgba(11, 31, 58, 0.05)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                        }}>
                          #{resource.id}
                        </div>
                      </div>

                      {/* Resource Details Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                        marginTop: '0.75rem',
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' }}>
                            Type
                          </span>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                            {resource.type?.replace('_', ' ') || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' }}>
                            Capacity
                          </span>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                            {resource.capacity ? `${resource.capacity} people` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' }}>
                            Location
                          </span>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                            {resource.location || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' }}>
                            Status
                          </span>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>
                            {resource.status || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
