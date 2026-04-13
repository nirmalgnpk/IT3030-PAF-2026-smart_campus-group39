import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ResourceForm from './ResourceForm';
import { getResourceById } from '../../services/resourceService';

/**
 * ResourceDetail Component — Detailed View of a Single Resource
 */

const Ico = ({ type }) => {
  if (type === 'capacity')
    return (
      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none"
        stroke="#1A3F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    );

  if (type === 'location')
    return (
      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none"
        stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    );

  if (type === 'availability')
    return (
      <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none"
        stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    );

  return null;
};

const DetaljRow = ({ label, value }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(120px, 150px) 1fr',
    gap: '1.5rem',
    padding: '1rem 0',
    borderBottom: '1px solid rgba(11,31,58,0.08)',
    alignItems: 'flex-start',
  }}>
    <label style={{ fontSize: '12px', fontWeight: '600', color: '#5A6A82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </label>
    <span style={{ fontSize: '13px', color: '#0B1F3A', lineHeight: '1.6', wordBreak: 'break-word' }}>
      {value}
    </span>
  </div>
);

const MetricCard = ({ icon, label, value }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid rgba(11,31,58,0.10)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 1px 3px rgba(11,31,58,0.05)',
    transition: 'all 200ms ease',
  }}>
    <div style={{ opacity: 0.6 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#5A6A82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0B1F3A', marginTop: '0.25rem', wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  </div>
);

const Spinner = ({ size = 24, color = '#0B1F3A' }) => (
  <svg
    style={{ animation: 'spin 1s linear infinite', width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" style={{ opacity: 0.25 }} />
    <path d="M12 2a10 10 0 0110 10" style={{ opacity: 1 }} />
  </svg>
);

const NavBar = ({ resourceName, onBack, onEdit, onToggleActive, isActive, isLoading }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
    borderBottom: '1px solid rgba(11,31,58,0.10)',
    flexWrap: 'wrap',
    gap: '1rem',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <button
        onClick={onBack}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Back"
      >
        <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none"
          stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0B1F3A', margin: 0 }}>
          {resourceName}
        </h1>
        <p style={{ fontSize: '12px', color: '#5A6A82', margin: '0.25rem 0 0 0' }}>
          Resource Details
        </p>
      </div>
    </div>

    {/* Action buttons */}
    <div style={{ display: 'flex', gap: '0.625rem' }}>
      <button
        onClick={onEdit}
        style={{
          backgroundColor: '#0B1F3A',
          color: 'white',
          fontSize: '12px',
          fontWeight: '600',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 180ms ease',
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#132d52'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#0B1F3A'}
      >
        Edit
      </button>
      <button
        onClick={onToggleActive}
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#f3f4f6' : (isActive ? '#E24B4A' : '#22C55E'),
          color: isLoading ? '#9ca3af' : 'white',
          fontSize: '12px',
          fontWeight: '600',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 180ms ease',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) e.target.style.backgroundColor = isActive ? '#C32F2A' : '#16A34A';
        }}
        onMouseLeave={(e) => {
          if (!isLoading) e.target.style.backgroundColor = isActive ? '#E24B4A' : '#22C55E';
        }}
      >
        {isLoading ? <Spinner size={14} color="#6b7280" /> : null}
        {isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  </div>
);

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchResource = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getResourceById(id);
      setResource(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load resource.');
      setResource(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResource();
  }, [id, fetchResource]);

  const handleToggleActive = async () => {
    setToggleLoading(true);
    try {
      // Toggle the active state
      setIsActive(!isActive);
      setTimeout(() => {
        setToggleLoading(false);
      }, 500);
    } catch (err) {
      alert('Failed to update resource status: ' + (err.message || 'Unknown error'));
      setToggleLoading(false);
    }
  };

  if (loading)
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F7F8FC',
      }}>
        <Spinner size={32} />
      </div>
    );

  if (error)
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F8FC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: '#FCEBEB',
          color: '#A32D2D',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}>
          {error}
        </div>
      </div>
    );

  if (!resource)
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F7F8FC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          borderRadius: '12px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
        }}>
          Resource not found.
        </div>
      </div>
    );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F7F8FC',
      padding: '2rem 1rem',
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
      }}>

      {/* ── NavBar ── */}
      <NavBar
        resourceName={resource.name}
        onBack={() => navigate('/facilities')}
        onEdit={() => setShowForm(true)}
        onToggleActive={handleToggleActive}
        isActive={isActive}
        isLoading={toggleLoading}
      />

      {/* ── Metrics ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
        '@media (max-width: 600px)': {
          gridTemplateColumns: '1fr',
        },
      }}>
        <MetricCard icon={<Ico type="capacity" />} label="Capacity" value={`${resource.capacity} people`} />
        <MetricCard icon={<Ico type="location" />} label="Status" value={isActive ? 'ACTIVE' : 'OUT OF SERVICE'} />
        <MetricCard icon={<Ico type="availability" />} label="Availability" value={resource.availabilityWindows} />
      </div>

      {!showForm ? (
        <>
          {/* ── Full Details ── */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid rgba(11,31,58,0.10)',
            padding: '2rem',
            boxShadow: '0 2px 4px rgba(11,31,58,0.06)',
          }}>
            <h3 style={{
              fontSize: '13px',
              fontWeight: 'bold',
              color: '#0B1F3A',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <DetaljRow label="Type" value={resource.type.replace(/_/g, ' ')} />
              <DetaljRow label="Location" value={resource.location} />
              <DetaljRow label="Capacity" value={`${resource.capacity} people`} />
              <DetaljRow label="Status" value={isActive ? 'ACTIVE' : 'OUT OF SERVICE'} />
              <DetaljRow label="Availability" value={resource.availabilityWindows} />
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 150px) 1fr', gap: '1.5rem', paddingTop: '1rem' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#5A6A82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Description
                </label>
                <span style={{ fontSize: '13px', color: '#0B1F3A', lineHeight: '1.6', wordBreak: 'break-word' }}>
                  {resource.description || 'No description provided.'}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ResourceForm
          initialData={resource}
          onSubmit={() => {
            setShowForm(false);
            fetchResource();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}
      </div>
    </div>
  );
};

export default ResourceDetail;
