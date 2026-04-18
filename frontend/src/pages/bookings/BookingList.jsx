import React, { useState, useEffect, useCallback } from 'react';
import BookingCard from './BookingCard';
import BookingFilter from './BookingFilter';
import {
    getAllBookings,
    approveBooking,
    rejectBooking,
    cancelBooking,
} from '../../services/bookingService';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelBookingId, setCancelBookingId] = useState(null);

    const isAdmin = true;

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllBookings(filters);
            setBookings(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleFilter = (newFilters) => setFilters(newFilters);

    const handleApprove = async (id) => {
        try {
            await approveBooking(id);
            fetchBookings();
        } catch (err) {
            setError(err.message || 'Failed to approve booking');
        }
    };

    const handleRejectClick = (id) => {
        setSelectedBookingId(id);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }
        try {
            await rejectBooking(selectedBookingId, rejectReason);
            setShowRejectModal(false);
            setSelectedBookingId(null);
            setRejectReason('');
            fetchBookings();
        } catch (err) {
            setError(err.message || 'Failed to reject booking');
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setSelectedBookingId(null);
        setRejectReason('');
    };

    const handleCancelClick = (id) => {
        setCancelBookingId(id);
        setShowCancelConfirm(true);
    };

    const handleCancelConfirm = async () => {
        try {
            await cancelBooking(cancelBookingId);
            setShowCancelConfirm(false);
            setCancelBookingId(null);
            fetchBookings();
        } catch (err) {
            setError(err.message || 'Failed to cancel booking');
        }
    };

    const handleCancelCancel = () => {
        setShowCancelConfirm(false);
        setCancelBookingId(null);
    };

    return (
        <div style={{ padding: '24px 20px', minHeight: '60vh' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Error Message */}
                {error && (
                    <div style={styles.errorBanner}>
                        {error}
                    </div>
                )}

                {/* Filter */}
                <div style={{ marginBottom: '24px' }}>
                    <BookingFilter onFilter={handleFilter} isAdmin={isAdmin} />
                </div>

                {/* Loading Spinner */}
                {loading ? (
                    <div style={styles.centered}>
                        <div style={styles.spinner} />
                        <span style={{ marginLeft: '14px', color: '#888', fontSize: '15px' }}>
                            Loading bookings...
                        </span>
                    </div>
                ) : bookings.length === 0 ? (
                    /* Empty State */
                    <div style={styles.emptyState}>
                        <p style={{ color: '#888', fontSize: '15px' }}>
                            {Object.values(filters).some((v) => v !== undefined)
                                ? 'No bookings match your filters'
                                : 'No bookings available'}
                        </p>
                    </div>
                ) : (
                    /* Booking Cards */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onApprove={handleApprove}
                                onReject={handleRejectClick}
                                onCancel={handleCancelClick}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Reject Booking</h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            rows={4}
                            style={styles.textarea}
                        />
                        <div style={styles.modalActions}>
                            <button onClick={handleRejectCancel} style={styles.btnSecondary}>
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim()}
                                style={{
                                    ...styles.btnDanger,
                                    opacity: !rejectReason.trim() ? 0.5 : 1,
                                    cursor: !rejectReason.trim() ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirm Dialog */}
            {showCancelConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Cancel Booking?</h3>
                        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>
                        <div style={styles.modalActions}>
                            <button onClick={handleCancelCancel} style={styles.btnSecondary}>
                                No, Keep It
                            </button>
                            <button onClick={handleCancelConfirm} style={styles.btnDanger}>
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    errorBanner: {
        marginBottom: '16px',
        padding: '14px 16px',
        backgroundColor: '#fdecea',
        border: '1px solid #f5c6c6',
        color: '#b71c1c',
        borderRadius: '10px',
        fontSize: '14px',
    },
    centered: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 0',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #e0e0e0',
        borderTop: '4px solid #C8963E',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    },
    emptyState: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '60px 20px',
        textAlign: 'center',
        border: '0.5px solid #e5e7eb',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '20px',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '28px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    },
    modalTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#0B1F3A',
        marginBottom: '16px',
    },
    textarea: {
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit',
        color: '#0B1F3A',
    },
    modalActions: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
    },
    btnSecondary: {
        padding: '9px 18px',
        backgroundColor: '#f0f0f0',
        color: '#444',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '14px',
        cursor: 'pointer',
    },
    btnDanger: {
        padding: '9px 18px',
        backgroundColor: '#C8963E',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '14px',
        cursor: 'pointer',
    },
};

// Spinner keyframes — inject once
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinnerStyle);

export default BookingList;