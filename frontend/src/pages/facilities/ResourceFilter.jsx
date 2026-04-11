import React, { useState } from 'react';

/**
 * ResourceFilter Component — Filter Panel for Resources
 *
 * @param {object}   filters        - Current filter values
 * @param {function} onFiltersChange - Callback when filters change
 */

const fieldStyle = {
  fontSize: '13px',
  padding: '0.625rem 0.75rem',
  borderRadius: '10px',
  border: '1px solid rgba(11,31,58,0.18)',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 200ms ease',
};

const ResourceFilter = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters || {
    type: '',
    status: '',
    location: '',
    capacityMin: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: name === 'capacityMin' ? (value ? parseInt(value, 10) : '') : value,
    }));
  };

  const handleApply = () => {
    onFiltersChange?.(localFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      type: '',
      status: '',
      location: '',
      capacityMin: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  return (
    <div style={{
      backgroundColor: '#F7F8FC',
      borderRadius: '14px',
      padding: '1.25rem',
      border: '1px solid rgba(11,31,58,0.10)',
    }}>
      {/* ── Title ── */}
      <h3 style={{
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#0B1F3A',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        Filters
      </h3>

      {/* ── Filters grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '1rem' }}>

        {/* Type filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '600',
            color: '#5A6A82',
            marginBottom: '0.375rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Resource Type
          </label>
          <select
            name="type"
            value={localFilters.type}
            onChange={handleFilterChange}
            style={fieldStyle}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Laboratory</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '600',
            color: '#5A6A82',
            marginBottom: '0.375rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Status
          </label>
          <select
            name="status"
            value={localFilters.status}
            onChange={handleFilterChange}
            style={fieldStyle}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </div>

        {/* Location filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '600',
            color: '#5A6A82',
            marginBottom: '0.375rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={localFilters.location}
            onChange={handleFilterChange}
            placeholder="Search by location..."
            style={fieldStyle}
          />
        </div>

        {/* Capacity filter */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '11px',
            fontWeight: '600',
            color: '#5A6A82',
            marginBottom: '0.375rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Min. Capacity
          </label>
          <input
            type="number"
            name="capacityMin"
            value={localFilters.capacityMin}
            onChange={handleFilterChange}
            placeholder="e.g., 20"
            min="1"
            style={fieldStyle}
          />
        </div>
      </div>

      {/* ── Action buttons ── */}
      <div style={{ display: 'flex', gap: '0.5rem', width: 'fit-content' }}>
        <button
          onClick={handleApply}
          style={{
            backgroundColor: '#0B1F3A',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 180ms ease',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#132d52'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#0B1F3A'}
        >
          Apply
        </button>

        <button
          onClick={handleClear}
          style={{
            backgroundColor: 'white',
            color: '#0B1F3A',
            fontSize: '11px',
            fontWeight: '600',
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid rgba(11,31,58,0.18)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#F7F8FC';
            e.target.style.borderColor = 'rgba(11,31,58,0.30)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.borderColor = 'rgba(11,31,58,0.18)';
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ResourceFilter;
