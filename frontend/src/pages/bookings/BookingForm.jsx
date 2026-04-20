import React, { useState, useEffect } from 'react';
import { createBooking } from '../../services/bookingService';
import { getResourceById } from '../../services/resourceService';
import { useAuth } from '../../AuthContext';

const BookingForm = ({ resourceId, resourceName, onSuccess, onCancel }) => {
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: 1,
        userName: '',
        userEmail: '',
        userId: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [resourceData, setResourceData] = useState(null);
    const [timeErrors, setTimeErrors] = useState({ startTime: '', endTime: '' });
    // eslint-disable-next-line no-unused-vars
    const [resourceLoading, setResourceLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [resourceError, setResourceError] = useState(null);

    // Auto-populate user information from AuthContext on component mount
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                userName: currentUser.name || '',
                userEmail: currentUser.email || '',
                userId: currentUser.email?.split('@')[0] || '',
            }));
        }
    }, [currentUser]);

    // Fetch resource details when component mounts or resourceId changes
    useEffect(() => {
        const fetchResource = async () => {
            if (!resourceId) return;
            
            setResourceLoading(true);
            setResourceError(null);
            try {
                const data = await getResourceById(resourceId);
                setResourceData(data);
            } catch (err) {
                console.error('Error fetching resource:', err);
                setResourceError(err.message || 'Failed to load resource details');
            } finally {
                setResourceLoading(false);
            }
        };

        fetchResource();
    }, [resourceId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'expectedAttendees' ? parseInt(value) || 1 : value,
        }));

        // Validate time fields
        if (name === 'startTime' || name === 'endTime') {
            validateTimeFields(name, value);
        }
    };

    const validateTimeFields = (fieldName, fieldValue) => {
        const MIN_TIME = '09:00';
        const MAX_TIME = '18:00';
        const newErrors = { ...timeErrors };

        if (fieldName === 'startTime') {
            if (fieldValue && (fieldValue < MIN_TIME || fieldValue > MAX_TIME)) {
                newErrors.startTime = 'Start time must be between 9:00 AM and 6:00 PM';
            } else {
                newErrors.startTime = '';
            }
            // Update endTime minimum if startTime is valid
            if (fieldValue && fieldValue >= MIN_TIME && fieldValue <= MAX_TIME) {
                if (formData.endTime && formData.endTime <= fieldValue) {
                    newErrors.endTime = 'End time must be after start time';
                } else if (formData.endTime && (formData.endTime < MIN_TIME || formData.endTime > MAX_TIME)) {
                    newErrors.endTime = 'End time must be between 9:00 AM and 6:00 PM';
                } else {
                    newErrors.endTime = '';
                }
            }
        } else if (fieldName === 'endTime') {
            if (fieldValue && (fieldValue < MIN_TIME || fieldValue > MAX_TIME)) {
                newErrors.endTime = 'End time must be between 9:00 AM and 6:00 PM';
            } else if (fieldValue && formData.startTime && fieldValue <= formData.startTime) {
                newErrors.endTime = 'End time must be after start time';
            } else {
                newErrors.endTime = '';
            }
        }

        setTimeErrors(newErrors);
    };

    const validateForm = () => {
        if (!formData.date || !formData.startTime || !formData.endTime) {
            setError('Date and time fields are required');
            return false;
        }
        if (timeErrors.startTime || timeErrors.endTime) {
            setError('Please fix the time validation errors below');
            return false;
        }
        if (!formData.purpose.trim()) {
            setError('Purpose is required');
            return false;
        }
        if (!formData.userName.trim() || !formData.userEmail.trim() || !formData.userId.trim()) {
            setError('User information is required');
            return false;
        }
        if (formData.expectedAttendees < 1) {
            setError('Expected attendees must be at least 1');
            return false;
        }
        if (formData.startTime >= formData.endTime) {
            setError('Start time must be before end time');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const bookingData = {
                resourceId,
                ...formData,
            };
            await createBooking(bookingData);
            setSuccessMessage('Booking request submitted successfully! It is now pending admin approval.');
            setTimeout(() => {
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (err) {
            // Check for 409 Conflict status code (resource already booked)
            if (err.response?.status === 409 || err.message.includes('already booked')) {
                setError('This resource is already booked for the selected time. Please choose a different time slot.');
            } else {
                setError(err.message || 'Failed to create booking');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Request Booking for {resourceName}</h2>

            {error && (
                <div style={styles.errorBox}>
                    <p style={styles.errorText}>{error}</p>
                </div>
            )}

            {successMessage && (
                <div>
                    <div style={styles.successBox}>
                        <p style={styles.successText}>{successMessage}</p>
                    </div>
                    
                    {/* Display Resource Details Card */}
                    {resourceData && (
                        <div style={styles.resourceCard}>
                            <h3 style={styles.resourceCardTitle}>Resource Details</h3>
                            
                            <div style={styles.resourceGrid}>
                                <div style={styles.resourceField}>
                                    <label style={styles.resourceLabel}>Resource Name</label>
                                    <span style={styles.resourceValue}>{resourceData.name}</span>
                                </div>
                                
                                <div style={styles.resourceField}>
                                    <label style={styles.resourceLabel}>Type</label>
                                    <span style={styles.resourceValue}>{resourceData.type?.replace(/_/g, ' ') || 'N/A'}</span>
                                </div>
                                
                                <div style={styles.resourceField}>
                                    <label style={styles.resourceLabel}>Capacity</label>
                                    <span style={styles.resourceValue}>{resourceData.capacity || 'N/A'} people</span>
                                </div>
                                
                                <div style={styles.resourceField}>
                                    <label style={styles.resourceLabel}>Location</label>
                                    <span style={styles.resourceValue}>{resourceData.location || 'N/A'}</span>
                                </div>
                                
                                <div style={styles.resourceField}>
                                    <label style={styles.resourceLabel}>Status</label>
                                    <span style={{
                                        ...styles.resourceValue,
                                        color: resourceData.status === 'ACTIVE' ? '#0F6E56' : '#A32D2D',
                                        fontWeight: '600'
                                    }}>
                                        {resourceData.status?.replace(/_/g, ' ') || 'N/A'}
                                    </span>
                                </div>
                                
                                {resourceData.availabilityHours && (
                                    <div style={styles.resourceField}>
                                        <label style={styles.resourceLabel}>Availability Hours</label>
                                        <span style={styles.resourceValue}>{resourceData.availabilityHours}</span>
                                    </div>
                                )}
                            </div>
                            
                            {resourceData.description && (
                                <div style={styles.resourceDescription}>
                                    <label style={styles.resourceLabel}>Description</label>
                                    <p style={styles.resourceDescriptionText}>{resourceData.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* User Information Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Your Information</h3>
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}>Full Name *</label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                style={styles.readOnlyInput}
                                readOnly
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Email *</label>
                            <input
                                type="email"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleInputChange}
                                placeholder="your.email@example.com"
                                style={styles.readOnlyInput}
                                readOnly
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>User ID *</label>
                            <input
                                type="text"
                                name="userId"
                                value={formData.userId}
                                onChange={handleInputChange}
                                placeholder="Your user ID"
                                style={styles.readOnlyInput}
                                readOnly
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Booking Details Section */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Booking Details</h3>
                    <div style={styles.grid}>
                        <div style={styles.field}>
                            <label style={styles.label}>Date *</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Start Time *</label>
                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                min="09:00"
                                max="18:00"
                                style={{
                                    ...styles.input,
                                    borderColor: timeErrors.startTime ? '#d32f2f' : '#ddd',
                                    backgroundColor: timeErrors.startTime ? '#ffebee' : 'white',
                                }}
                                required
                            />
                            {timeErrors.startTime && (
                                <p style={styles.errorMessage}>{timeErrors.startTime}</p>
                            )}
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>End Time *</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                min={formData.startTime || '09:00'}
                                max="18:00"
                                style={{
                                    ...styles.input,
                                    borderColor: timeErrors.endTime ? '#d32f2f' : '#ddd',
                                    backgroundColor: timeErrors.endTime ? '#ffebee' : 'white',
                                }}
                                required
                            />
                            {timeErrors.endTime && (
                                <p style={styles.errorMessage}>{timeErrors.endTime}</p>
                            )}
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Expected Attendees *</label>
                            <input
                                type="number"
                                name="expectedAttendees"
                                value={formData.expectedAttendees}
                                onChange={handleInputChange}
                                min="1"
                                style={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Purpose *</label>
                        <textarea
                            name="purpose"
                            value={formData.purpose}
                            onChange={handleInputChange}
                            placeholder="Describe the purpose of this booking..."
                            style={styles.textarea}
                            rows="4"
                            required
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actions}>
                    <button
                        type="submit"
                        disabled={loading || timeErrors.startTime || timeErrors.endTime}
                        style={{
                            ...styles.btnSubmit,
                            opacity: (loading || timeErrors.startTime || timeErrors.endTime) ? 0.6 : 1,
                            cursor: (loading || timeErrors.startTime || timeErrors.endTime) ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Booking Request'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={styles.btnCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#0B1F3A',
        marginBottom: '24px',
    },
    section: {
        marginBottom: '24px',
    },
    sectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#0B1F3A',
        marginBottom: '16px',
        borderBottom: '2px solid #C8963E',
        paddingBottom: '8px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#666',
        marginBottom: '6px',
        textTransform: 'uppercase',
    },
    input: {
        padding: '11px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0B1F3A',
        backgroundColor: 'white',
        outline: 'none',
        fontFamily: 'inherit',
    },
    readOnlyInput: {
        padding: '11px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0B1F3A',
        backgroundColor: '#f5f5f5',
        outline: 'none',
        fontFamily: 'inherit',
        cursor: 'not-allowed',
    },
    textarea: {
        padding: '11px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0B1F3A',
        backgroundColor: 'white',
        outline: 'none',
        fontFamily: 'inherit',
        fontWeight: '400',
    },
    errorMessage: {
        color: '#d32f2f',
        fontSize: '12px',
        marginTop: '4px',
        fontWeight: '500',
    },
    form: {
        width: '100%',
    },
    actions: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
    },
    btnSubmit: {
        padding: '12px 24px',
        backgroundColor: '#C8963E',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnCancel: {
        padding: '12px 24px',
        backgroundColor: '#f0f0f0',
        color: '#555',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    errorBox: {
        padding: '12px 16px',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        marginBottom: '16px',
    },
    errorText: {
        color: '#c33',
        fontSize: '13px',
        margin: 0,
    },
    successBox: {
        padding: '12px 16px',
        backgroundColor: '#efe',
        border: '1px solid #cfc',
        borderRadius: '8px',
        marginBottom: '16px',
    },
    successText: {
        color: '#3c3',
        fontSize: '13px',
        margin: 0,
    },
    // New styles for resource card display
    resourceCard: {
        backgroundColor: '#f9f9f9',
        border: '2px solid #E8D4B8',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    },
    resourceCardTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#0B1F3A',
        marginBottom: '16px',
        borderBottom: '2px solid #C8963E',
        paddingBottom: '12px',
    },
    resourceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '16px',
    },
    resourceField: {
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E8D4B8',
    },
    resourceLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#5A6A82',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '6px',
    },
    resourceValue: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#0B1F3A',
        lineHeight: '1.4',
    },
    resourceDescription: {
        padding: '12px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #E8D4B8',
    },
    resourceDescriptionText: {
        fontSize: '13px',
        color: '#333',
        lineHeight: '1.5',
        margin: '6px 0 0 0',
    },
};

export default BookingForm;
