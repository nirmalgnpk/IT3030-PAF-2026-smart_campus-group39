import React, { useState } from 'react';

const BookingCard = ({ booking, onApprove, onReject, onCancel, isAdmin }) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

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
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                        {booking.resourceName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                    </span>
                </div>

                {/* Date and Time */}
                <div className="mb-3">
                    <p className="text-gray-700">
                        <span className="font-semibold">Date:</span> {booking.date}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Time:</span> {booking.startTime} — {booking.endTime}
                    </p>
                </div>

                {/* Purpose and Attendees */}
                <div className="mb-3">
                    <p className="text-gray-700">
                        <span className="font-semibold">Purpose:</span> {booking.purpose}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Expected Attendees:</span> {booking.expectedAttendees}
                    </p>
                </div>

                {/* User Information */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-gray-700">
                        <span className="font-semibold">Booked by:</span> {booking.userName}
                    </p>
                    <p className="text-gray-600 text-sm">{booking.userEmail}</p>
                </div>

                {/* Rejection Reason (if rejected) */}
                {booking.status === 'REJECTED' && booking.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                        <p className="text-red-700 font-semibold text-sm">Rejection Reason:</p>
                        <p className="text-red-600 text-sm">{booking.rejectionReason}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    {/* PENDING + Admin: Approve and Reject buttons */}
                    {booking.status === 'PENDING' && isAdmin && (
                        <>
                            <button
                                onClick={() => onApprove(booking.id)}
                                className="flex-1 min-w-[120px] bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Approve
                            </button>
                            <button
                                onClick={handleRejectClick}
                                className="flex-1 min-w-[120px] bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {/* PENDING + Not Admin: Cancel Request button */}
                    {booking.status === 'PENDING' && !isAdmin && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Cancel Request
                        </button>
                    )}

                    {/* APPROVED: Cancel button */}
                    {booking.status === 'APPROVED' && (
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Rejection Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Reject Booking
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
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
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
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

export default BookingCard;
