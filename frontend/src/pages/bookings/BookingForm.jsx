import React, { useState, useEffect } from 'react';
import { createBooking } from '../../services/bookingService';

const BookingForm = ({ resourceId, resourceName, onSuccess, onCancel }) => {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'expectedAttendees' ? parseInt(value) || 1 : value,
        }));
    };

    const validateForm = () => {
        if (!formData.date || !formData.startTime || !formData.endTime) {
            setError('Date and time fields are required');
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
            if (err.message.includes('already booked')) {
                setError('This time slot is already booked. Please choose a different time.');
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
                <div style={styles.successBox}>
                    <p style={styles.successText}>{successMessage}</p>
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
                                style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
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
                                style={styles.input}
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>End Time *</label>
                            <input
                                type="time"
                                name="endTime"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            />
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
                        disabled={loading}
                        style={{
                            ...styles.btnSubmit,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
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
};

export default BookingForm;
