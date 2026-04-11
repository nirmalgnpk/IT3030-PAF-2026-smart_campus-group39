import React, { useState } from 'react';
import { createResource, updateResource } from '../../services/resourceService';

/**
 * ResourceForm Component — Create/Edit Resource
 *
 * @param {object}   initialData - Pre-populated data for edit mode
 * @param {function} onSubmit    - Callback when form is successfully submitted
 * @param {function} onCancel    - Callback when cancel button is clicked
 */

const inputStyle = {
  fontSize: '13px',
  padding: '0.625rem 0.75rem',
  borderRadius: '10px',
  border: '1px solid rgba(11,31,58,0.18)',
  fontFamily: 'inherit',
  transition: 'all 200ms ease',
  boxSizing: 'border-box',
  width: '100%',
};

const ResourceForm = ({ initialData = null, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState(initialData || {
    name: '',
    type: 'LECTURE_HALL',
    location: '',
    capacity: 10,
    availabilityWindows: '',
    description: '',
    status: 'ACTIVE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value, 10) : value,
    }));
    setError(null);
    setSuccess(false);
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Resource name is required.';
    if (!formData.location.trim()) return 'Location is required.';
    if (formData.capacity < 1) return 'Capacity must be at least 1.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditMode) {
        await updateResource(formData.id, formData);
      } else {
        await createResource(formData);
      }
      setSuccess(true);
      setTimeout(() => onSubmit?.(formData), 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>

      {/* ── Error alert ── */}
      {error && (
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.875rem 1rem',
          backgroundColor: '#FCEBEB',
          color: '#A32D2D',
          borderRadius: '10px',
          fontSize: '13px',
          border: '1px solid rgba(163, 45, 45, 0.2)',
        }}>
          {error}
        </div>
      )}

      {/* ── Success alert ── */}
      {success && (
        <div style={{
          marginBottom: '1.25rem',
          padding: '0.875rem 1rem',
          backgroundColor: '#E6F7F0',
          color: '#0F6E56',
          borderRadius: '10px',
          fontSize: '13px',
          border: '1px solid rgba(15, 110, 86, 0.2)',
        }}>
          ✓ Resource {isEditMode ? 'updated' : 'created'} successfully!
        </div>
      )}

      {/* ── Section: Basic Information ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '1.875rem' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#0B1F3A', marginBottom: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
          Basic Information
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Resource Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Room 101"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Laboratory</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, 2nd Floor"
              style={inputStyle}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section: Capacity & Availability ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '1.875rem' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#0B1F3A', marginBottom: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
          Capacity & Availability
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Capacity (people)
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Availability Windows
            </label>
            <input
              type="text"
              name="availabilityWindows"
              value={formData.availabilityWindows}
              onChange={handleChange}
              placeholder="e.g., Mon-Fri, 9AM-5PM"
              style={inputStyle}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section: Details ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '1.875rem' }}>
        <legend style={{ fontSize: '13px', fontWeight: 'bold', color: '#0B1F3A', marginBottom: '0.75rem', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block' }}>
          Details
        </legend>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional details..."
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </fieldset>

      {/* ── Action section ── */}
      <div style={{ display: 'flex', gap: '0.875rem', marginTop: '2rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: loading ? '#9ca3af' : '#0B1F3A',
            color: 'white',
            fontSize: '13px',
            fontWeight: '600',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 180ms ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = '#132d52';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = '#0B1F3A';
          }}
        >
          {loading ? 'Saving...' : (isEditMode ? 'Update Resource' : 'Create Resource')}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: 'white',
            color: '#0B1F3A',
            fontSize: '13px',
            fontWeight: '600',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            border: '1px solid rgba(11,31,58,0.18)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 180ms ease',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#F7F8FC';
              e.target.style.borderColor = 'rgba(11,31,58,0.30)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = 'rgba(11,31,58,0.18)';
            }
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResourceForm;
