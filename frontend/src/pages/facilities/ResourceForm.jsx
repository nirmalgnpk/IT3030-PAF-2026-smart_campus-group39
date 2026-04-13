import React, { useState, useEffect } from 'react';
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
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  border: '1.5px solid rgba(11,31,58,0.12)',
  fontFamily: 'inherit',
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  boxSizing: 'border-box',
  width: '100%',
  backgroundColor: '#FAFBFC',
  color: '#0B1F3A',
  outline: 'none',
  ':focus': {
    borderColor: '#0B1F3A',
    backgroundColor: 'white',
    boxShadow: '0 0 0 3px rgba(11,31,58,0.08)',
  },
};

// Helper function to parse availability string from backend
const parseAvailabilityString = (availabilityStr) => {
  const defaultAvailability = {
    Monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    Tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    Wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    Thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    Friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
    Saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
  };

  // If already an object (from state), return it
  if (!availabilityStr) {
    return defaultAvailability;
  }

  if (typeof availabilityStr === 'object' && availabilityStr !== null) {
    // Check if it's already in the correct format
    if (availabilityStr.Monday && typeof availabilityStr.Monday === 'object') {
      return availabilityStr;
    }
  }

  if (typeof availabilityStr !== 'string') {
    return defaultAvailability;
  }

  // First, initialize with all days disabled
  const result = {
    Monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    Sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
  };

  // Parse string format like "Monday 09:00-17:00, Tuesday 09:00-17:00"
  if (availabilityStr.trim() === '') {
    return defaultAvailability;
  }

  const days = availabilityStr.split(',').map(d => d.trim());

  days.forEach(dayStr => {
    const match = dayStr.match(/^(\w+)\s+(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
    if (match) {
      const dayName = match[1];
      const startHour = match[2].padStart(2, '0');
      const startMin = match[3];
      const endHour = match[4].padStart(2, '0');
      const endMin = match[5];
      const startTime = `${startHour}:${startMin}`;
      const endTime = `${endHour}:${endMin}`;
      
      if (result[dayName]) {
        result[dayName] = { enabled: true, startTime, endTime };
      }
    }
  });

  return result;
};

// Helper function to initialize form data
const initializeFormData = (initialData) => {
  if (!initialData) {
    return {
      name: '',
      type: 'LECTURE_HALL',
      location: '',
      capacity: 10,
      availabilityWindows: parseAvailabilityString(null),
      description: '',
      status: 'ACTIVE',
    };
  }

  return {
    ...initialData,
    availabilityWindows: parseAvailabilityString(initialData.availabilityWindows),
  };
};

// Weekly Availability Picker Component
const WeeklyAvailabilityPicker = ({ value, onChange, fieldError }) => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [isOpen, setIsOpen] = useState(false);
  const [availability, setAvailability] = useState(parseAvailabilityString(value));

  useEffect(() => {
    if (value) {
      setAvailability(parseAvailabilityString(value));
    }
  }, [value]);

  const handleDayToggle = (day) => {
    if (!availability[day]) return; // Guard against undefined day
    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        enabled: !availability[day].enabled,
      },
    };
    setAvailability(updated);
  };

  const handleTimeChange = (day, field, time) => {
    if (!availability[day]) return; // Guard against undefined day
    const updated = {
      ...availability,
      [day]: {
        ...availability[day],
        [field]: time,
      },
    };
    setAvailability(updated);
  };

  const handleApply = () => {
    onChange(availability);
    setIsOpen(false);
  };

  const handleReset = () => {
    const reset = {
      Monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      Tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      Wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      Thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      Friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      Saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      Sunday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    };
    setAvailability(reset);
    onChange(reset);
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!availability) return 'No availability set';
    const enabledDays = daysOfWeek.filter(day => availability[day]?.enabled);
    if (enabledDays.length === 0) return 'No availability set';
    if (enabledDays.length <= 3) return enabledDays.join(', ');
    return `${enabledDays.slice(0, 3).join(', ')} +${enabledDays.length - 3}`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          border: `1.5px solid ${fieldError ? '#DC2626' : 'rgba(11,31,58,0.12)'}`,
          backgroundColor: fieldError ? '#FEF2F2' : '#FAFBFC',
          color: '#0B1F3A',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: fieldError ? '0 0 0 3px rgba(220, 38, 38, 0.05)' : 'none',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>📅 {formatDisplay()}</span>
        <span style={{ fontSize: '10px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 300ms', flexShrink: 0, marginLeft: '0.5rem' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.75rem',
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1.5px solid rgba(11,31,58,0.12)',
            boxShadow: '0 12px 32px rgba(11, 31, 58, 0.2)',
            padding: '1.5rem',
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            minWidth: '450px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          <h4 style={{ fontSize: '12px', fontWeight: '700', color: '#0B1F3A', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Weekly Availability
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {daysOfWeek.map((day) => (
              <div
                key={day}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr 1fr 1fr',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.75rem',
                  backgroundColor: availability[day]?.enabled ? '#F7F8FC' : '#FAFBFC',
                  borderRadius: '10px',
                  border: '1px solid rgba(11,31,58,0.1)',
                  transition: 'all 200ms',
                }}
              >
                {/* Day Toggle */}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', minWidth: '80px' }}>
                  <input
                    type="checkbox"
                    checked={availability[day]?.enabled || false}
                    onChange={() => handleDayToggle(day)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      marginRight: '0.5rem',
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#0B1F3A' }}>{day}</span>
                </label>

                {/* Start Time */}
                <input
                  type="time"
                  value={availability[day]?.startTime || '09:00'}
                  onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                  disabled={!availability[day]?.enabled}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(11,31,58,0.15)',
                    backgroundColor: availability[day]?.enabled ? 'white' : '#EEEEEE',
                    color: '#0B1F3A',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: availability[day]?.enabled ? 'pointer' : 'not-allowed',
                    outline: 'none',
                    transition: 'all 200ms',
                  }}
                  onFocus={(e) => {
                    if (availability[day]?.enabled) {
                      e.target.style.borderColor = '#0B1F3A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(11,31,58,0.08)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(11,31,58,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />

                {/* Separator */}
                <div style={{ textAlign: 'center', color: '#6B7280', fontWeight: '600', fontSize: '12px' }}>
                  -
                </div>

                {/* End Time */}
                <input
                  type="time"
                  value={availability[day]?.endTime || '17:00'}
                  onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                  disabled={!availability[day]?.enabled}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(11,31,58,0.15)',
                    backgroundColor: availability[day]?.enabled ? 'white' : '#EEEEEE',
                    color: '#0B1F3A',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: availability[day]?.enabled ? 'pointer' : 'not-allowed',
                    outline: 'none',
                    transition: 'all 200ms',
                  }}
                  onFocus={(e) => {
                    if (availability[day]?.enabled) {
                      e.target.style.borderColor = '#0B1F3A';
                      e.target.style.boxShadow = '0 0 0 3px rgba(11,31,58,0.08)';
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(11,31,58,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleApply}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0B1F3A 0%, #1a3a52 100%)',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 200ms',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(11, 31, 58, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Apply
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                flex: 1,
                padding: '0.75rem',
                borderRadius: '10px',
                border: '1.5px solid rgba(11,31,58,0.2)',
                backgroundColor: 'white',
                color: '#0B1F3A',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 200ms',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F7F8FC';
                e.target.style.borderColor = 'rgba(11,31,58,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = 'rgba(11,31,58,0.2)';
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ResourceForm = ({ initialData = null, onSubmit, onCancel }) => {
  const isEditMode = Boolean(initialData?.id);

  const [formData, setFormData] = useState(() => initializeFormData(initialData));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldStatus, setFieldStatus] = useState({});

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData(initializeFormData(initialData));
    }
  }, [isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? (value === '' ? '' : parseInt(value, 10)) : value,
    }));
    setError(null);
    setSuccess(false);
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Real-time field validation
    validateField(name, name === 'capacity' ? (value === '' ? '' : parseInt(value, 10)) : value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
  };

  const validateField = (fieldName, value) => {
    const errors = { ...fieldErrors };
    const status = { ...fieldStatus };

    switch (fieldName) {
      case 'name':
        if (!value || !value.toString().trim()) {
          errors.name = 'Resource name is required';
          status.name = 'error';
        } else if (value.toString().trim().length < 2) {
          errors.name = 'Minimum 2 characters needed';
          status.name = 'error';
        } else if (value.toString().trim().length > 100) {
          errors.name = 'Maximum 100 characters allowed';
          status.name = 'error';
        } else {
          delete errors.name;
          status.name = 'valid';
        }
        break;

      case 'location':
        if (!value || !value.toString().trim()) {
          errors.location = 'Location is required';
          status.location = 'error';
        } else if (value.toString().trim().length < 3) {
          errors.location = 'Minimum 3 characters needed';
          status.location = 'error';
        } else if (value.toString().trim().length > 100) {
          errors.location = 'Maximum 100 characters allowed';
          status.location = 'error';
        } else {
          delete errors.location;
          status.location = 'valid';
        }
        break;

      case 'capacity':
        if (value === '' || value === 0) {
          errors.capacity = 'Capacity is required';
          status.capacity = 'error';
        } else if (isNaN(value) || value < 1) {
          errors.capacity = 'Minimum 1 person required';
          status.capacity = 'error';
        } else if (value > 10000) {
          errors.capacity = 'Maximum 10,000 people allowed';
          status.capacity = 'error';
        } else {
          delete errors.capacity;
          status.capacity = 'valid';
        }
        break;

      case 'description':
        if (value && value.trim().length > 1000) {
          errors.description = 'Maximum 1000 characters allowed';
          status.description = 'error';
        } else {
          delete errors.description;
          if (value && value.trim().length > 0) {
            status.description = 'valid';
          }
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
    setFieldStatus(status);
  };

  const validate = () => {
    // Resource Name validation
    if (!formData.name || !formData.name.trim()) {
      return 'Resource name is required.';
    }
    if (formData.name.trim().length < 2) {
      return 'Resource name must be at least 2 characters long.';
    }
    if (formData.name.trim().length > 100) {
      return 'Resource name must not exceed 100 characters.';
    }

    // Location validation
    if (!formData.location || !formData.location.trim()) {
      return 'Location is required.';
    }
    if (formData.location.trim().length < 3) {
      return 'Location must be at least 3 characters long.';
    }
    if (formData.location.trim().length > 100) {
      return 'Location must not exceed 100 characters.';
    }

    // Capacity validation
    if (!formData.capacity) {
      return 'Capacity is required.';
    }
    if (isNaN(formData.capacity) || formData.capacity < 1) {
      return 'Capacity must be at least 1 person.';
    }
    if (formData.capacity > 10000) {
      return 'Capacity cannot exceed 10,000 people.';
    }

    // Type validation
    if (!formData.type) {
      return 'Please select a resource type.';
    }

    // Status validation
    if (!formData.status) {
      return 'Please select a status.';
    }

    // Optional: Availability Windows validation (if provided)
    if (formData.availabilityWindows) {
      const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let hasEnabledDay = false;
      
      for (let day of daysOfWeek) {
        if (formData.availabilityWindows[day]?.enabled) {
          hasEnabledDay = true;
          const startTime = formData.availabilityWindows[day].startTime;
          const endTime = formData.availabilityWindows[day].endTime;
          
          if (startTime && endTime && startTime >= endTime) {
            return `${day}: Start time must be before end time.`;
          }
        }
      }
      
      if (!hasEnabledDay) {
        return 'At least one day must be available.';
      }
    }

    // Optional: Description validation (if provided)
    if (formData.description && formData.description.trim().length > 1000) {
      return 'Description must not exceed 1000 characters.';
    }

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
      // Convert availability object to string format for backend
      const dataToSubmit = { ...formData };
      if (dataToSubmit.availabilityWindows) {
        const availability = dataToSubmit.availabilityWindows;
        const enabledDays = [];
        
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
          if (availability[day]?.enabled) {
            enabledDays.push(`${day} ${availability[day].startTime}-${availability[day].endTime}`);
          }
        });
        
        dataToSubmit.availabilityWindows = enabledDays.join(', ') || null;
      }

      if (isEditMode) {
        await updateResource(dataToSubmit.id, dataToSubmit);
      } else {
        await createResource(dataToSubmit);
      }
      setSuccess(true);
      setTimeout(() => onSubmit?.(dataToSubmit), 1000);
    } catch (err) {
      setError(err.message || 'An error occurred while saving the resource.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

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
      <form 
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '100%', 
          maxWidth: '600px', 
          backgroundColor: '#FFFFFF', 
          padding: '2.75rem', 
          borderRadius: '18px', 
          boxShadow: '0 25px 50px rgba(11, 31, 58, 0.15), 0 0 1px rgba(11, 31, 58, 0.05)', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          position: 'relative',
          border: '1px solid rgba(11, 31, 58, 0.06)',
          backdropFilter: 'blur(10px)',
        }}>
        <style>{`
          form::-webkit-scrollbar {
            width: 4px;
          }
          form::-webkit-scrollbar-track {
            background: transparent;
          }
          form::-webkit-scrollbar-thumb {
            background: rgba(11, 31, 58, 0.15);
            border-radius: 10px;
            transition: background 250ms ease;
          }
          form::-webkit-scrollbar-thumb:hover {
            background: rgba(11, 31, 58, 0.3);
          }
        `}</style>

        {/* ── Form Title ── */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0B1F3A',
          marginBottom: '2rem',
          textAlign: 'center',
          marginTop: 0,
          letterSpacing: '-0.3px',
          background: 'linear-gradient(135deg, #0B1F3A 0%, #1a3a52 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {isEditMode ? 'Edit Resource' : 'Create New Resource'}
        </h2>

        {/* ── Error alert ── */}
        {error && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#FEF2F2',
          color: '#DC2626',
          borderRadius: '12px',
          fontSize: '13px',
          border: '1px solid rgba(220, 38, 38, 0.2)',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)',
          lineHeight: '1.5',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Success alert ── */}
      {success && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#F0FDF4',
          color: '#059669',
          borderRadius: '12px',
          fontSize: '13px',
          border: '1px solid rgba(5, 150, 105, 0.2)',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)',
          lineHeight: '1.5',
        }}>
          ✓ Resource {isEditMode ? 'updated' : 'created'} successfully!
        </div>
      )}

      {/* ── Section: Basic Information ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '2.25rem' }}>
        <legend style={{ fontSize: '12px', fontWeight: '700', color: '#0B1F3A', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', opacity: 0.7 }}>
          Basic Information
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Resource Name
                {fieldStatus.name === 'valid' && touchedFields.name && (
                  <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
                )}
              </label>
              <span style={{ fontSize: '11px', color: fieldErrors.name ? '#DC2626' : '#6B7280' }}>
                {formData.name ? formData.name.length : 0}/100
              </span>
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Room 101"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.name ? '#DC2626' : (fieldStatus.name === 'valid' && touchedFields.name ? '#10B981' : 'rgba(11,31,58,0.12)'),
                backgroundColor: fieldErrors.name ? '#FEF2F2' : (fieldStatus.name === 'valid' && touchedFields.name ? '#F0FDF4' : '#FAFBFC'),
                boxShadow: fieldErrors.name ? '0 0 0 3px rgba(220, 38, 38, 0.05)' : (fieldStatus.name === 'valid' && touchedFields.name ? '0 0 0 3px rgba(16, 185, 129, 0.05)' : 'none'),
              }}
            />
            {fieldErrors.name && touchedFields.name && (
              <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                ⚠ {fieldErrors.name}
              </span>
            )}
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
                style={{
                  ...inputStyle,
                  borderColor: 'rgba(11,31,58,0.12)',
                  backgroundColor: '#FAFBFC',
                }}
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
                style={{
                  ...inputStyle,
                  borderColor: 'rgba(11,31,58,0.12)',
                  backgroundColor: '#FAFBFC',
                }}
              >
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Location
                {fieldStatus.location === 'valid' && touchedFields.location && (
                  <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
                )}
              </label>
              <span style={{ fontSize: '11px', color: fieldErrors.location ? '#DC2626' : '#6B7280' }}>
                {formData.location ? formData.location.length : 0}/100
              </span>
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Building A, 2nd Floor"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.location ? '#DC2626' : (fieldStatus.location === 'valid' && touchedFields.location ? '#10B981' : 'rgba(11,31,58,0.12)'),
                backgroundColor: fieldErrors.location ? '#FEF2F2' : (fieldStatus.location === 'valid' && touchedFields.location ? '#F0FDF4' : '#FAFBFC'),
                boxShadow: fieldErrors.location ? '0 0 0 3px rgba(220, 38, 38, 0.05)' : (fieldStatus.location === 'valid' && touchedFields.location ? '0 0 0 3px rgba(16, 185, 129, 0.05)' : 'none'),
              }}
            />
            {fieldErrors.location && touchedFields.location && (
              <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                ⚠ {fieldErrors.location}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Section: Capacity & Availability ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '2.25rem' }}>
        <legend style={{ fontSize: '12px', fontWeight: '700', color: '#0B1F3A', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', opacity: 0.7 }}>
          Capacity & Availability
        </legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', marginBottom: '0.375rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Capacity (people)
              {fieldStatus.capacity === 'valid' && touchedFields.capacity && (
                <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
              )}
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              min="1"
              max="10000"
              style={{
                ...inputStyle,
                borderColor: fieldErrors.capacity ? '#DC2626' : (fieldStatus.capacity === 'valid' && touchedFields.capacity ? '#10B981' : 'rgba(11,31,58,0.12)'),
                backgroundColor: fieldErrors.capacity ? '#FEF2F2' : (fieldStatus.capacity === 'valid' && touchedFields.capacity ? '#F0FDF4' : '#FAFBFC'),
                boxShadow: fieldErrors.capacity ? '0 0 0 3px rgba(220, 38, 38, 0.05)' : (fieldStatus.capacity === 'valid' && touchedFields.capacity ? '0 0 0 3px rgba(16, 185, 129, 0.05)' : 'none'),
              }}
            />
            {fieldErrors.capacity && touchedFields.capacity && (
              <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                ⚠ {fieldErrors.capacity}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>
              Weekly Availability (Optional)
            </label>
            <WeeklyAvailabilityPicker
              value={formData.availabilityWindows}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  availabilityWindows: value,
                }));
                setError(null);
                setSuccess(false);
              }}
              fieldError={fieldErrors.availabilityWindows}
            />
            {fieldErrors.availabilityWindows && (
              <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
                ⚠ {fieldErrors.availabilityWindows}
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Section: Details ── */}
      <fieldset style={{ border: 'none', padding: 0, margin: 0, marginBottom: '2.25rem' }}>
        <legend style={{ fontSize: '12px', fontWeight: '700', color: '#0B1F3A', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', opacity: 0.7 }}>
          Details
        </legend>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', fontWeight: '600', color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Description (Optional)
              {fieldStatus.description === 'valid' && touchedFields.description && (
                <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
              )}
            </label>
            <span style={{ fontSize: '11px', color: fieldErrors.description ? '#DC2626' : '#6B7280' }}>
              {formData.description ? formData.description.length : 0}/1000
            </span>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Add any additional details..."
            style={{
              ...inputStyle,
              minHeight: '110px',
              resize: 'vertical',
              fontFamily: 'inherit',
              borderColor: fieldErrors.description ? '#DC2626' : (fieldStatus.description === 'valid' && touchedFields.description ? '#10B981' : 'rgba(11,31,58,0.12)'),
              backgroundColor: fieldErrors.description ? '#FEF2F2' : (fieldStatus.description === 'valid' && touchedFields.description ? '#F0FDF4' : '#FAFBFC'),
              boxShadow: fieldErrors.description ? '0 0 0 3px rgba(220, 38, 38, 0.05)' : (fieldStatus.description === 'valid' && touchedFields.description ? '0 0 0 3px rgba(16, 185, 129, 0.05)' : 'none'),
            }}
          />
          {fieldErrors.description && touchedFields.description && (
            <span style={{ fontSize: '11px', color: '#EF4444', marginTop: '0.25rem', display: 'block' }}>
              ⚠ {fieldErrors.description}
            </span>
          )}
        </div>
      </fieldset>

      {/* ── Action section ── */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 1,
            background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #0B1F3A 0%, #1a3a52 100%)',
            color: 'white',
            fontSize: '13px',
            fontWeight: '700',
            padding: '0.875rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: loading ? 'none' : '0 10px 25px rgba(11, 31, 58, 0.15)',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 15px 35px rgba(11, 31, 58, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 25px rgba(11, 31, 58, 0.15)';
            }
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
            fontWeight: '700',
            padding: '0.875rem 1.5rem',
            borderRadius: '12px',
            border: '1.5px solid rgba(11,31,58,0.15)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#F8FAFC';
              e.target.style.borderColor = 'rgba(11,31,58,0.25)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = 'rgba(11,31,58,0.15)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
            }
          }}
        >
          Cancel
        </button>
      </div>
    </form>
    </div>
  );
};

export default ResourceForm;
