import React, { useState } from 'react';

const BookingCard = ({ booking, onApprove, onReject, onCancel, isAdmin }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const getStatusBg = (status) => {
        switch (status) {
            case 'PENDING':
                return '#fef3c7';
            case 'APPROVED':
                return '#dcfce7';
            case 'REJECTED':
                return '#fee2e2';
            case 'CANCELLED':
                return '#f3f4f6';
            default:
                return '#f3f4f6';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return '#b45309';
            case 'APPROVED':
                return '#15803d';
            case 'REJECTED':
                return '#dc2626';
            case 'CANCELLED':
                return '#6b7280';
            default:
                return '#6b7280';
        }
    };

    const handleRejectClick = () => {
        setShowRejectModal(true);
    };

    const handleRejectConfirm = () => {
        if (rejectionReason.trim()) {
            onReject(booking.id, rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setRejectionReason('');
    };

    return (
        <>
            <div style={styles.card}>
                {/* Header */}
                <div style={styles.header}>
                    <h3 style={styles.resourceName}>
                        {booking.resourceName || 'Resource'}
                    </h3>
                    <span style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusBg(booking.status),
                        color: getStatusColor(booking.status),
                    }}>
                        {booking.status}
                    </span>
                </div>

                {/* Date and Time */}
                <div style={styles.section}>
                    <p style={styles.infoText}>
                        <span style={styles.label}>Date:</span> {booking.date}
                    </p>
                    <p style={styles.infoText}>
                        <span style={styles.label}>Time:</span> {booking.startTime} — {booking.endTime}
                    </p>
                </div>

                {/* Purpose and Attendees */}
                <div style={styles.section}>
                    <p style={styles.infoText}>
                        <span style={styles.label}>Purpose:</span> {booking.purpose}
                    </p>
                    <p style={styles.infoText}>
                        <span style={styles.label}>Expected Attendees:</span> {booking.expectedAttendees}
                    </p>
                </div>

                {/* User Information */}
                <div style={styles.userSection}>
                    <p style={styles.infoText}>
                        <span style={styles.label}>Booked by:</span> {booking.userName}
                    </p>
                    <p style={styles.emailText}>{booking.userEmail}</p>
                </div>

                {/* Rejection Reason (if rejected) */}
                {booking.status === 'REJECTED' && booking.rejectionReason && (
                    <div style={styles.rejectionBox}>
                        <p style={styles.rejectionLabel}>Rejection Reason:</p>
                        <p style={styles.rejectionText}>{booking.rejectionReason}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actions}>
                    {/* PENDING + Admin: Approve and Reject buttons */}
                    {booking.status === 'PENDING' && isAdmin && (
                        <>
                            <button
                                onClick={() => onApprove(booking.id)}
                                style={styles.btnApprove}
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleRejectClick}
                                style={styles.btnReject}
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {/* PENDING + Not Admin: Cancel Request button */}
                    {booking.status === 'PENDING' && !isAdmin && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            style={styles.btnCancel}
                        >
                            Cancel Request
                        </button>
                    )}

                    {/* APPROVED: Cancel button (Not Admin only) */}
                    {booking.status === 'APPROVED' && !isAdmin && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            style={styles.btnCancel}
                        >
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Reject Booking</h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            style={styles.textarea}
                            rows="4"
                        />
                        <div style={styles.modalActions}>
                            <button
                                onClick={handleRejectCancel}
                                style={styles.btnSecondary}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectionReason.trim()}
                                style={{
                                    ...styles.btnPrimary,
                                    opacity: !rejectionReason.trim() ? 0.5 : 1,
                                    cursor: !rejectionReason.trim() ? 'not-allowed' : 'pointer',
                                }}
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '16px 20px',
        border: '0.5px solid #e5e7eb',
        marginBottom: '12px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
    },
    resourceName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#0B1F3A',
        margin: 0,
    },
    statusBadge: {
        paddingLeft: '12px',
        paddingRight: '12px',
        paddingTop: '4px',
        paddingBottom: '4px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
    },
    section: {
        marginBottom: '8px',
    },
    userSection: {
        paddingTop: '8px',
        paddingBottom: '8px',
        borderTop: '0.5px solid #e5e7eb',
        borderBottom: '0.5px solid #e5e7eb',
        marginBottom: '12px',
    },
    infoText: {
        fontSize: '13px',
        color: '#555',
        margin: '4px 0',
    },
    label: {
        fontWeight: '600',
        color: '#0B1F3A',
    },
    emailText: {
        fontSize: '12px',
        color: '#888',
        margin: '4px 0 0 0',
    },
    rejectionBox: {
        padding: '12px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: '8px',
        marginBottom: '12px',
    },
    rejectionLabel: {
        fontWeight: '600',
        color: '#b91c1c',
        fontSize: '12px',
        margin: '0 0 4px 0',
    },
    rejectionText: {
        color: '#991b1b',
        fontSize: '13px',
        margin: 0,
    },
    actions: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginTop: '12px',
    },
    btnApprove: {
        flex: 1,
        minWidth: '100px',
        padding: '8px 16px',
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnReject: {
        flex: 1,
        minWidth: '100px',
        padding: '8px 16px',
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnCancel: {
        flex: 1,
        minWidth: '100px',
        padding: '8px 16px',
        backgroundColor: '#6b7280',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        margin: 0,
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
        boxSizing: 'border-box',
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
    btnPrimary: {
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

export default BookingCard;
