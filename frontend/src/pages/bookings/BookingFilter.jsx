import React, { useState } from 'react';

const BookingFilter = ({ onFilter, isAdmin }) => {
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [userId, setUserId] = useState('');
    const [resourceName, setResourceName] = useState('');

    const handleApply = () => {
        onFilter({
            status: status || undefined,
            date: date || undefined,
            userId: userId || undefined,
            resourceName: resourceName || undefined,
        });
    };

    const handleClear = () => {
        setStatus('');
        setDate('');
        setUserId('');
        setResourceName('');
        onFilter({});
    };

    return (
        <div style={styles.card}>
            <p style={styles.title}>Filter Bookings</p>

            <div style={styles.grid}>
                <div style={styles.field}>
                    <label style={styles.label}>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={styles.input}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {isAdmin && (
                    <div style={styles.field}>
                        <label style={styles.label}>User ID / Name</label>
                        <input
                            type="text"
                            placeholder="Search user..."
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                )}

                <div style={styles.field}>
                    <label style={styles.label}>Resource Name</label>
                    <input
                        type="text"
                        placeholder="Search resource..."
                        value={resourceName}
                        onChange={(e) => setResourceName(e.target.value)}
                        style={styles.input}
                    />
                </div>
            </div>

            <div style={styles.actions}>
                <button onClick={handleApply} style={styles.btnApply}>
                    Apply Filters
                </button>
                <button onClick={handleClear} style={styles.btnClear}>
                    Clear
                </button>
            </div>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px 24px',
        border: '0.5px solid #e5e7eb',
    },
    title: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#0B1F3A',
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '12px',
        color: '#888',
        fontWeight: '500',
        marginBottom: '5px',
    },
    input: {
        padding: '9px 12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#0B1F3A',
        backgroundColor: 'white',
        outline: 'none',
        width: '100%',
    },
    actions: {
        display: 'flex',
        gap: '10px',
        marginTop: '16px',
    },
    btnApply: {
        padding: '9px 20px',
        backgroundColor: '#0B1F3A',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    btnClear: {
        padding: '9px 16px',
        backgroundColor: '#f0f0f0',
        color: '#555',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer',
    },
};

export default BookingFilter;