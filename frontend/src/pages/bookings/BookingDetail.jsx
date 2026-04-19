import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getBookingById,
    approveBooking,
    rejectBooking,
    cancelBooking,
} from '../../services/bookingService';
import { useAuth } from '../../AuthContext';

const BookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [actionError, setActionError] = useState(null);

    // Check if current user is an admin
    const isAdmin = currentUser?.role === 'ADMIN';

    const fetchBooking = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBookingById(id);
            setBooking(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch booking details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'CANCELLED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApprove = async () => {
        setActionError(null);
        try {
            await approveBooking(id);
            fetchBooking();
        } catch (err) {
            setActionError(err.message || 'Failed to approve booking');
        }
    };

    const handleRejectClick = () => {
        setRejectReason('');
        setShowRejectModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) {
            setActionError('Please provide a rejection reason');
            return;
        }
        setActionError(null);
        try {
            await rejectBooking(id, rejectReason);
            setShowRejectModal(false);
            setRejectReason('');
            fetchBooking();
        } catch (err) {
            setActionError(err.message || 'Failed to reject booking');
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setRejectReason('');
    };

    const handleCancelClick = () => {
        setShowCancelConfirm(true);
    };

    const handleCancelConfirm = async () => {
        setActionError(null);
        try {
            await cancelBooking(id);
            setShowCancelConfirm(false);
            fetchBooking();
        } catch (err) {
            setActionError(err.message || 'Failed to cancel booking');
        }
    };

    const handleCancelCancel = () => {
        setShowCancelConfirm(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/bookings')}
                    className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                    <span>←</span> Back to Bookings
                </button>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
                        <span className="ml-4 text-gray-600 text-lg">Loading booking details...</span>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-red-700 font-semibold text-lg mb-4">
                            Error Loading Booking
                        </div>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => navigate('/bookings')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
                        >
                            Go Back
                        </button>
                    </div>
                ) : booking ? (
                    /* Detail Card */
                    <div className="bg-white rounded-lg shadow-md p-8">
                        {/* Header with Status */}
                        <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    {booking.resourceName}
                                </h1>
                                <p className="text-gray-600">
                                    Booking ID: <span className="font-mono text-sm">{booking.id}</span>
                                </p>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                                {booking.status}
                            </span>
                        </div>

                        {/* Error Message */}
                        {actionError && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {actionError}
                            </div>
                        )}

                        {/* Booking Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Date Section */}
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Date
                                </p>
                                <p className="text-xl text-gray-800 font-semibold">
                                    {booking.date}
                                </p>
                            </div>

                            {/* Time Section */}
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Time
                                </p>
                                <p className="text-xl text-gray-800 font-semibold">
                                    {booking.startTime} — {booking.endTime}
                                </p>
                            </div>

                            {/* Purpose Section */}
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Purpose
                                </p>
                                <p className="text-lg text-gray-800">
                                    {booking.purpose}
                                </p>
                            </div>

                            {/* Attendees Section */}
                            <div>
                                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                                    Expected Attendees
                                </p>
                                <p className="text-lg text-gray-800">
                                    {booking.expectedAttendees}
                                </p>
                            </div>
                        </div>

                        {/* User Information Section */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Booked By
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        Name
                                    </p>
                                    <p className="text-gray-800 text-lg">
                                        {booking.userName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        Email
                                    </p>
                                    <p className="text-gray-800">
                                        {booking.userEmail}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        User ID
                                    </p>
                                    <p className="text-gray-800 font-mono text-sm">
                                        {booking.userId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rejection Reason (if rejected) */}
                        {booking.status === 'REJECTED' && booking.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                                <p className="text-sm font-bold text-red-700 uppercase tracking-wide mb-2">
                                    Rejection Reason
                                </p>
                                <p className="text-red-700 text-lg">
                                    {booking.rejectionReason}
                                </p>
                            </div>
                        )}

                        {/* Timeline Information */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Timeline
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        Created
                                    </p>
                                    <p className="text-gray-800">
                                        {new Date(booking.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                                        Last Updated
                                    </p>
                                    <p className="text-gray-800">
                                        {new Date(booking.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            {/* PENDING + Admin: Approve and Reject buttons */}
                            {booking.status === 'PENDING' && isAdmin && (
                                <>
                                    <button
                                        onClick={handleApprove}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Approve Booking
                                    </button>
                                    <button
                                        onClick={handleRejectClick}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Reject Booking
                                    </button>
                                </>
                            )}

                            {/* APPROVED: Cancel button */}
                            {booking.status === 'APPROVED' && (
                                <button
                                    onClick={handleCancelClick}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Reject Booking
                        </h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                            rows="4"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleRejectCancel}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectReason.trim()}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
                            >
                                Confirm Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirm Dialog */}
            {showCancelConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                            Cancel Booking?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={handleCancelCancel}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                            >
                                No, Keep It
                            </button>
                            <button
                                onClick={handleCancelConfirm}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetail;
