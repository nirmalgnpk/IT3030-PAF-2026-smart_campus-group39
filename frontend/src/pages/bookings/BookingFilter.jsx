import React, { useState } from 'react';

const BookingFilter = ({ onFilter, isAdmin }) => {
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [userId, setUserId] = useState('');
    const [resourceId, setResourceId] = useState('');

    const handleApply = () => {
        onFilter({
            status: status || undefined,
            date: date || undefined,
            userId: userId || undefined,
            resourceId: resourceId || undefined,
        });
    };

    const handleClear = () => {
        setStatus('');
        setDate('');
        setUserId('');
        setResourceId('');
        onFilter({
            status: undefined,
            date: undefined,
            userId: undefined,
            resourceId: undefined,
        });
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm p-4 rounded-lg">
            <div className="flex flex-wrap gap-4 items-end">
                {/* Status Dropdown */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                    >
                        <option value="">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Date Input */}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold text-gray-700 mb-1">
                        Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                    />
                </div>

                {/* User ID / Name Input (Admin only) */}
                {isAdmin && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            User ID
                        </label>
                        <input
                            type="text"
                            placeholder="User ID or name"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                        />
                    </div>
                )}

                {/* Resource Name Input (Admin only) */}
                {isAdmin && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-1">
                            Resource Name
                        </label>
                        <input
                            type="text"
                            placeholder="Resource name"
                            value={resourceId}
                            onChange={(e) => setResourceId(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleApply}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleClear}
                        className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors duration-200"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingFilter;
