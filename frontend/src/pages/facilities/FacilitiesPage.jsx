import React, { useState, useEffect } from 'react';
import ResourceList from './ResourceList';
import { getAllResources } from '../../services/resourceService';
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../AuthContext";

const FacilitiesPage = () => {
  // Get current  user from auth hook
  const { currentUser } = useAuth();
  
  // Compute isAdmin from user's role
  const isAdmin = currentUser?.role === 'ADMIN';
  const [resources, setResources] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAvailableModal, setShowAvailableModal] = useState(false);
  const [showOutOfServiceModal, setShowOutOfServiceModal] = useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

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
  const outOfServiceRooms = resources.filter(r => r.status === 'OUT_OF_SERVICE' || r.status === 'out_of_service').length;
  const availableResources = resources.filter(r => r.status === 'ACTIVE' || r.status === 'active');
  const outOfServiceResources = resources.filter(r => r.status === 'OUT_OF_SERVICE' || r.status === 'out_of_service');

  const stats = [
    { label: 'Total Rooms', value: statsLoading ? '...' : totalRooms.toString(), icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, onClick: () => setShowTotalModal(true) },
    { label: 'Available', value: statsLoading ? '...' : availableRooms.toString(), icon: <><circle cx="12" cy="12" r="10"/><polyline points="9 11 12 14 22 4"/></>, onClick: () => setShowAvailableModal(true) },
    { label: 'Out of Service', value: statsLoading ? '...' : outOfServiceRooms.toString(), icon: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="18"/></>, onClick: () => setShowOutOfServiceModal(true), style: { backgroundColor: 'rgba(224, 45, 45, 0.35)', border: '1px solid rgba(224, 45, 45, 0.45)' } },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <style>{scrollbarStyles}</style>

      {/* Navbar */}
      <Navbar />

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
              {stats.map(({ label, value, icon, onClick, style }) => (
                <div 
                  key={label}
                  onClick={onClick}
                  style={{ 
                    backgroundColor: style?.backgroundColor || 'rgba(255,255,255,0.35)', 
                    border: style?.border || '1px solid rgba(255,255,255,0.45)', 
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
                      const bgColor = style?.backgroundColor || 'rgba(255,255,255,0.35)';
                      const hoverBg = bgColor.replace('0.35', '0.45').replace('0.45', '0.55');
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (onClick) {
                      e.currentTarget.style.backgroundColor = style?.backgroundColor || 'rgba(255,255,255,0.35)';
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
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', lineHeight: '1', fontFamily: 'Syne, sans-serif' }}>{value}</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', marginTop: '0.125rem' }}>{label}</div>
                </div>
              ))}

              {isAdmin && (
                <div 
                  onClick={() => setShowAdminModal(true)}
                  style={{ 
                    backgroundColor: 'rgba(200,150,62,0.50)', 
                    border: '1px solid rgba(200,150,62,0.65)', 
                    borderRadius: '12px', 
                    padding: '0.75rem 1rem', 
                    textAlign: 'center', 
                    width: '90px', 
                    height: '90px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(200,150,62,0.65)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(200,150,62,0.50)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.375rem' }}>
                    <svg style={{ width: '14px', height: '14px', color: 'rgba(200,150,62,0.95)' }} viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#C8963E', lineHeight: '1', fontFamily: 'Syne, sans-serif' }}>Admin</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(200,150,62,0.9)', marginTop: '0.125rem' }}>Mode</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem' }}>
        <ResourceList />
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {availableResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid rgba(11, 31, 58, 0.1)',
                        borderRadius: '6px',
                        backgroundColor: '#F9FAFB',
                        display: 'grid',
                        gridTemplateColumns: '0.8fr 1fr 0.8fr 0.8fr 0.6fr',
                        gap: '0.75rem',
                        alignItems: 'center',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
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
                      <div style={{ fontWeight: '600', color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resource.name}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>
                        {resource.type?.replace('_', ' ') || 'N/A'}
                      </div>
                      <div style={{ color: '#1F2937', fontWeight: '500' }}>
                        {resource.location || 'N/A'}
                      </div>
                      <div style={{ color: '#6B7280' }}>
                        Cap: {resource.capacity || 'N/A'}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(29, 158, 117, 0.1)',
                        color: '#1D9E75',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        Active
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Out of Service Resources Modal ── */}
      {showOutOfServiceModal && (
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
          onClick={() => setShowOutOfServiceModal(false)}
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
              borderBottom: '1px solid rgba(224, 45, 45, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(224, 45, 45, 0.05)',
            }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '20px', fontWeight: 'bold', color: '#A32D2D' }}>
                  Out of Service Resources
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
                  {outOfServiceResources.length} resource{outOfServiceResources.length !== 1 ? 's' : ''} out of service
                </p>
              </div>
              <button
                onClick={() => setShowOutOfServiceModal(false)}
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
              {outOfServiceResources.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: '#9CA3AF',
                }}>
                  <p style={{ fontSize: '14px' }}>
                    No resources are currently out of service.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {outOfServiceResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid rgba(224, 45, 45, 0.15)',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(224, 45, 45, 0.03)',
                        display: 'grid',
                        gridTemplateColumns: '0.8fr 1fr 0.8fr 0.8fr 0.6fr',
                        gap: '0.75rem',
                        alignItems: 'center',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(224, 45, 45, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(224, 45, 45, 0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(224, 45, 45, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(224, 45, 45, 0.15)';
                      }}
                    >
                      <div style={{ fontWeight: '600', color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resource.name}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>
                        {resource.type?.replace('_', ' ') || 'N/A'}
                      </div>
                      <div style={{ color: '#1F2937', fontWeight: '500' }}>
                        {resource.location || 'N/A'}
                      </div>
                      <div style={{ color: '#6B7280' }}>
                        Cap: {resource.capacity || 'N/A'}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(224, 45, 45, 0.1)',
                        color: '#A32D2D',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        Out of Service
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Total Rooms Modal ── */}
      {showTotalModal && (
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
          onClick={() => setShowTotalModal(false)}
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
                  All Campus Resources
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
                  {resources.length} total resource{resources.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => setShowTotalModal(false)}
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
              {resources.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: '#9CA3AF',
                }}>
                  <p style={{ fontSize: '14px' }}>
                    No resources found.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid rgba(11, 31, 58, 0.1)',
                        borderRadius: '6px',
                        backgroundColor: '#F9FAFB',
                        display: 'grid',
                        gridTemplateColumns: '0.8fr 1fr 0.8fr 0.8fr 0.6fr',
                        gap: '0.75rem',
                        alignItems: 'center',
                        fontSize: '13px',
                        transition: 'all 0.2s ease',
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
                      <div style={{ fontWeight: '600', color: '#0B1F3A', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resource.name}
                      </div>
                      <div style={{ color: '#6B7280', fontSize: '12px' }}>
                        {resource.type?.replace('_', ' ') || 'N/A'}
                      </div>
                      <div style={{ color: '#1F2937', fontWeight: '500' }}>
                        {resource.location || 'N/A'}
                      </div>
                      <div style={{ color: '#6B7280' }}>
                        Cap: {resource.capacity || 'N/A'}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: resource.status === 'ACTIVE' || resource.status === 'active' 
                          ? 'rgba(29, 158, 117, 0.1)' 
                          : 'rgba(224, 45, 45, 0.1)',
                        color: resource.status === 'ACTIVE' || resource.status === 'active'
                          ? '#1D9E75'
                          : '#A32D2D',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}>
                        {resource.status === 'ACTIVE' || resource.status === 'active' ? 'Active' : 'Out of Service'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Mode Modal ── */}
      {showAdminModal && isAdmin && (
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
          onClick={() => setShowAdminModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            }}
            className="available-resources-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(200,150,62,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(200,150,62,0.05)',
            }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '20px', fontWeight: 'bold', color: '#854F0B' }}>
                  Admin Overview
                </h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#9CA3AF' }}>
                  Campus Overview
                </p>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
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
            <div style={{ padding: '2rem' }}>
              {/* Admin Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#E6F7F0',
                  borderRadius: '8px',
                  border: '1px solid rgba(29, 158, 117, 0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '12px', fontWeight: '600', color: '#0F6E56', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Resources
                  </p>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1D9E75' }}>
                    {resources.length}
                  </p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(200,150,62,0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(200,150,62,0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '12px', fontWeight: '600', color: '#854F0B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active
                  </p>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#C8963E' }}>
                    {availableRooms}
                  </p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgba(224, 45, 45, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(224, 45, 45, 0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '12px', fontWeight: '600', color: '#A32D2D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Out of Service
                  </p>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#E24B4A' }}>
                    {outOfServiceRooms}
                  </p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#EBF0F5',
                  borderRadius: '8px',
                  border: '1px solid rgba(11, 31, 58, 0.2)',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Utilization
                  </p>
                  <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#1A3F8F' }}>
                    {resources.length > 0 ? Math.round((availableRooms / resources.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;