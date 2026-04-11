import React from 'react';

/**
 * ResourceCard Component — Smart Campus Premium UI
 *
 * @param {object}   resource          - Resource object
 * @param {function} onViewDetails     - Callback when "View Details" is clicked
 * @param {function} onEdit            - Callback when "Edit" is clicked
 * @param {boolean}  isAdmin           - Show edit button for admins
 */

/* ─── Accent bar gradients per type ─── */
const TYPE_GRADIENT = {
  LECTURE_HALL: 'linear-gradient(to right, #1A3F8F, #5882E0)',
  LAB:          'linear-gradient(to right, #0F6E56, #1D9E75)',
  MEETING_ROOM: 'linear-gradient(to right, #854F0B, #C8963E)',
  EQUIPMENT:    'linear-gradient(to right, #534AB7, #8F7FE8)',
};

/* ─── Type badge styles ─── */
const TYPE_BADGE = {
  LECTURE_HALL: { backgroundColor: '#E8F0FD', color: '#1A3F8F' },
  LAB:          { backgroundColor: '#E6F7F0', color: '#0F6E56' },
  MEETING_ROOM: { backgroundColor: '#FDF5E6', color: '#854F0B' },
  EQUIPMENT:    { backgroundColor: '#F0EBF8', color: '#534AB7' },
};

/* ─── Type display labels ─── */
const TYPE_LABEL = {
  LECTURE_HALL: 'Lecture Hall',
  LAB:          'Laboratory',
  MEETING_ROOM: 'Meeting Room',
  EQUIPMENT:    'Equipment',
};

/* ─── Status badge styles ─── */
const STATUS_CONFIG = {
  ACTIVE:          { style: { backgroundColor: '#E6F7F0', color: '#0F6E56' }, dot: '#1D9E75', label: 'Active' },
  OUT_OF_SERVICE:  { style: { backgroundColor: '#FCEBEB', color: '#A32D2D' }, dot: '#E24B4A', label: 'Out of Service' },
};

/* ─── Icons ─── */
const IconCapacity = () => (
  <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none"
    stroke="#5A6A82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const IconLocation = () => (
  <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none"
    stroke="#5A6A82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconClock = () => (
  <svg style={{ width: '15px', height: '15px' }} viewBox="0 0 24 24" fill="none"
    stroke="#5A6A82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ─── MetaRow ─── */
const MetaRow = ({ icon, label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
    <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#F7F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
      <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A6A82' }}>
        {label}
      </span>
      {children}
    </div>
  </div>
);

/* ─── ResourceCard ─── */
const ResourceCard = ({ resource, onViewDetails, onEdit, isAdmin = false }) => {
  const accentGradient = TYPE_GRADIENT[resource.type] ?? 'linear-gradient(to right, #999, #aaa)';
  const typeBadgeStyle = TYPE_BADGE[resource.type]  ?? { backgroundColor: '#f3f4f6', color: '#6b7280' };
  const typeLabel      = TYPE_LABEL[resource.type]  ?? resource.type.replace(/_/g, ' ');
  const statusCfg      = STATUS_CONFIG[resource.status] ?? {
    style: { backgroundColor: '#f3f4f6', color: '#6b7280' }, dot: '#9ca3af',
    label: resource.status.replace(/_/g, ' '),
  };

  return (
    <div style={{ 
      backgroundColor: 'white',
      borderRadius: '18px',
      border: '1px solid rgba(11,31,58,0.10)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%',
      transition: 'all 220ms ease-out',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(11,31,58,0.11)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}>

      {/* ── Accent bar ── */}
      <div style={{ height: '4px', width: '100%', background: accentGradient }} />

      {/* ── Header ── */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(11,31,58,0.10)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.625rem' }}>

          {/* Type badge */}
          <span style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.04em', padding: '0.25rem 0.625rem', borderRadius: '8px', ...typeBadgeStyle }}>
            {typeLabel}
          </span>

          {/* Status badge */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '11px', fontWeight: '600', padding: '0.25rem 0.625rem', borderRadius: '9999px', ...statusCfg.style }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, backgroundColor: statusCfg.dot }} />
            {statusCfg.label}
          </span>
        </div>

        {/* Resource name */}
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: 'bold', color: '#0B1F3A', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {resource.name}
        </h3>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>

        {/* Capacity */}
        <MetaRow icon={<IconCapacity />} label="Capacity">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.125rem' }}>
            <span style={{ backgroundColor: '#0B1F3A', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '0.125rem 0.5rem', borderRadius: '6px', letterSpacing: '0.03em' }}>
              {resource.capacity}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#5A6A82' }}>people</span>
          </div>
        </MetaRow>

        {/* Location */}
        <MetaRow icon={<IconLocation />} label="Location">
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#0B1F3A', lineHeight: '1.4' }}>
            {resource.location}
          </span>
        </MetaRow>

        {/* Availability */}
        <MetaRow icon={<IconClock />} label="Availability">
          <span style={{ fontSize: '13px', fontWeight: '500', color: '#0B1F3A', lineHeight: '1.4' }}>
            {resource.availabilityWindows}
          </span>
        </MetaRow>

        {/* Description */}
        {resource.description && (
          <p style={{ fontSize: '12px', color: '#5A6A82', lineHeight: '1.5', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {resource.description}
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ padding: '0.875rem 1.25rem', backgroundColor: '#F7F8FC', borderTop: '1px solid rgba(11,31,58,0.10)', display: 'flex', gap: '0.625rem' }}>
        <button
          onClick={() => onViewDetails?.(resource.id)}
          style={{ flex: 1, backgroundColor: '#0B1F3A', color: 'white', fontSize: '13px', fontWeight: '600', padding: '0.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'background-color 180ms ease' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#132d52'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0B1F3A'}
        >
          View Details
        </button>

        {isAdmin && (
          <button
            onClick={() => onEdit?.(resource.id)}
            style={{ flex: 1, backgroundColor: 'white', color: '#0B1F3A', fontSize: '13px', fontWeight: '600', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(11,31,58,0.18)', cursor: 'pointer', transition: 'all 180ms ease' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F7F8FC';
              e.target.style.borderColor = 'rgba(11,31,58,0.30)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = 'rgba(11,31,58,0.18)';
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
