import React, { useState, useEffect } from 'react';
import { getResourceById, updateResource } from '../../services/resourceService';
import ResourceForm from './ResourceForm';

/**
 * ResourceDetailModal — Modal popup showing resource details
 * Displays on top of facilities page with dark overlay background
 */

// Add scrollbar styling
const scrollbarStyle = `
  .resource-detail-modal-content::-webkit-scrollbar {
    width: 8px;
  }
  .resource-detail-modal-content::-webkit-scrollbar-track {
    background: transparent;
  }
  .resource-detail-modal-content::-webkit-scrollbar-thumb {
    background: rgba(11, 31, 58, 0.2);
    border-radius: 4px;
  }
  .resource-detail-modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(11, 31, 58, 0.3);
  }
  .resource-detail-modal-content {
    scrollbar-width: thin;
    scrollbar-color: rgba(11, 31, 58, 0.2) transparent;
  }
`;

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

const parseAvailability = (availabilityStr) => {
  if (!availabilityStr || availabilityStr.trim() === '') {
    return [];
  }
  
  const entries = availabilityStr.split(',').map(entry => entry.trim()).filter(entry => entry.length > 0);
  
  return entries.map(entry => {
    const match = entry.match(/^(\w+)\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
    if (match) {
      const day = match[1];
      const startHour = match[2].padStart(2, '0');
      const startMin = match[3];
      const endHour = match[4].padStart(2, '0');
      const endMin = match[5];
      const startTime = `${startHour}:${startMin}`;
      const endTime = `${endHour}:${endMin}`;
      
      return {
        day,
        startTime,
        endTime,
        timeRange: `${startTime}-${endTime}`
      };
    }
    return null;
  }).filter(Boolean);
};

const AvailabilityTable = ({ availabilityStr }) => {
  const availability = parseAvailability(availabilityStr);
  
  if (!availabilityStr || availability.length === 0) {
    return (
      <span style={{ fontSize: '13px', color: '#6B7280', fontStyle: 'italic' }}>
        Not specified
      </span>
    );
  }
  
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '13px',
      fontFamily: 'inherit',
    }}>
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(11,31,58,0.15)' }}>
          <th style={{
            textAlign: 'left',
            padding: '0.75rem 0',
            fontWeight: '600',
            color: '#5A6A82',
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: '0.04em',
          }}>Day</th>
          <th style={{
            textAlign: 'left',
            padding: '0.75rem 0',
            fontWeight: '600',
            color: '#5A6A82',
            textTransform: 'uppercase',
            fontSize: '11px',
            letterSpacing: '0.04em',
          }}>Time</th>
        </tr>
      </thead>
      <tbody>
        {availability.map((item, idx) => (
          <tr key={idx} style={{
            borderBottom: idx < availability.length - 1 ? '1px solid rgba(11,31,58,0.08)' : 'none',
          }}>
            <td style={{
              padding: '0.75rem 0',
              color: '#0B1F3A',
              fontWeight: '500',
            }}>{item.day}</td>
            <td style={{
              padding: '0.75rem 0',
              color: '#0B1F3A',
            }}>{item.timeRange}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TYPE_LABEL = {
  LECTURE_HALL: 'Lecture Hall',
  LAB: 'Laboratory',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT: 'Equipment',
};

const TYPE_BADGE = {
  LECTURE_HALL: { backgroundColor: '#E8F0FD', color: '#1A3F8F' },
  LAB: { backgroundColor: '#E6F7F0', color: '#0F6E56' },
  MEETING_ROOM: { backgroundColor: '#FDF5E6', color: '#854F0B' },
  EQUIPMENT: { backgroundColor: '#F0EBF8', color: '#534AB7' },
};

const STATUS_CONFIG = {
  ACTIVE: { backgroundColor: '#E6F7F0', color: '#0F6E56', label: 'Active' },
  OUT_OF_SERVICE: { backgroundColor: '#FCEBEB', color: '#A32D2D', label: 'Out of Service' },
};

const DetailRow = ({ label, value }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(150px, 200px) 1fr',
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

const ResourceDetailModal = ({ resourceId, onClose, isAdmin = false }) => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResourceById(resourceId);
        setResource(data);
        setIsActive(data.status === 'ACTIVE');
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load resource.');
        setResource(null);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchResource();
    }
  }, [resourceId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleToggleActive = async () => {
    setToggleLoading(true);
    try {
      const newStatus = isActive ? 'OUT_OF_SERVICE' : 'ACTIVE';
      const updatedResource = {
        ...resource,
        status: newStatus
      };
      
      await updateResource(resourceId, updatedResource);
      setResource(updatedResource);
      setIsActive(!isActive);
      setToggleLoading(false);
    } catch (err) {
      alert('Failed to update resource status: ' + (err.message || 'Unknown error'));
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
        }}
      >
        <Spinner size={32} color="white" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          padding: '1rem',
        }}
        onClick={handleBackdropClick}
      >
        <div
          style={{
            backgroundColor: '#FCEBEB',
            color: '#A32D2D',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid rgba(163, 45, 45, 0.2)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0 }}>{error}</p>
          <button
            onClick={onClose}
            style={{
              marginTop: '1rem',
              backgroundColor: '#A32D2D',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!resource) {
    return null;
  }

  // Inject scrollbar styles
  if (typeof document !== 'undefined' && !document.getElementById('resource-detail-modal-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'resource-detail-modal-styles';
    styleElement.textContent = scrollbarStyle;
    document.head.appendChild(styleElement);
  }

  if (showEditForm) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9999,
          padding: '1rem',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowEditForm(false);
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '650px',
          }}
        >
          <ResourceForm
            initialData={resource}
            onSubmit={(updatedData) => {
              setShowEditForm(false);
              setResource(updatedData);
              setIsActive(updatedData.status === 'ACTIVE');
            }}
            onCancel={() => setShowEditForm(false)}
          />
        </div>
      </div>
    );
  }

  const typeLabel = TYPE_LABEL[resource.type] || resource.type.replace(/_/g, ' ');
  const typeBadgeStyle = TYPE_BADGE[resource.type] || { backgroundColor: '#f3f4f6', color: '#6b7280' };
  const statusStyle = STATUS_CONFIG[resource.status] || { backgroundColor: '#f3f4f6', color: '#6b7280', label: 'Unknown' };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="resource-detail-modal-content"
        style={{
          width: '100%',
          maxWidth: '650px',
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          boxShadow: '0 25px 50px rgba(11, 31, 58, 0.15), 0 0 1px rgba(11, 31, 58, 0.05)',
          border: '1px solid rgba(11, 31, 58, 0.06)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* ── Header with Action Buttons ── */}
        <div style={{ padding: '2rem 2rem 1.5rem', borderBottom: '1px solid rgba(11,31,58,0.10)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.04em', padding: '0.25rem 0.625rem', borderRadius: '8px', ...typeBadgeStyle }}>
                {typeLabel}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '11px', fontWeight: '600', padding: '0.25rem 0.625rem', borderRadius: '9999px', backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.color }} />
                {statusStyle.label}
              </span>
            </div>
            
            {/* Admin Action Buttons */}
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  onClick={() => setShowEditForm(true)}
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
                  onClick={handleToggleActive}
                  disabled={toggleLoading}
                  style={{
                    backgroundColor: toggleLoading ? '#f3f4f6' : (isActive ? '#E24B4A' : '#22C55E'),
                    color: toggleLoading ? '#9ca3af' : 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: toggleLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!toggleLoading) e.target.style.backgroundColor = isActive ? '#C32F2A' : '#16A34A';
                  }}
                  onMouseLeave={(e) => {
                    if (!toggleLoading) e.target.style.backgroundColor = isActive ? '#E24B4A' : '#22C55E';
                  }}
                >
                  {isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            )}
          </div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#0B1F3A',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            {resource.name}
          </h2>
        </div>

        {/* ── Content ── */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <DetailRow label="Location" value={resource.location} />
            <DetailRow label="Type" value={typeLabel} />
            <DetailRow label="Capacity" value={`${resource.capacity} people`} />
            <DetailRow label="Status" value={statusStyle.label} />
            
            {/* Availability Table */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(150px, 200px) 1fr',
              gap: '1.5rem',
              padding: '1rem 0',
              borderBottom: '1px solid rgba(11,31,58,0.08)',
              alignItems: 'flex-start',
            }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#5A6A82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Availability
              </label>
              <div style={{ width: '100%' }}>
                <AvailabilityTable availabilityStr={resource.availabilityWindows} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 200px) 1fr', gap: '1.5rem', paddingTop: '1rem' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#5A6A82', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Description
              </label>
              <span style={{ fontSize: '13px', color: '#0B1F3A', lineHeight: '1.6', wordBreak: 'break-word' }}>
                {resource.description || 'No description provided.'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '0.75rem 2rem', backgroundColor: '#F7F8FC', borderTop: '1px solid rgba(11,31,58,0.10)', borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px', display: 'flex', justifyContent: 'center', gap: '0.875rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'white',
              color: '#0B1F3A',
              fontSize: '12px',
              fontWeight: '700',
              padding: '0.375rem 1.5rem',
              borderRadius: '6px',
              border: '1.5px solid rgba(11,31,58,0.15)',
              cursor: 'pointer',
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.borderColor = 'rgba(11,31,58,0.25)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = 'rgba(11,31,58,0.15)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailModal;
