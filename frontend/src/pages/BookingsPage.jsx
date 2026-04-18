import React from 'react';
import BookingList from './bookings/BookingList';
import Navbar from "../components/Navbar/Navbar";

const BookingsPage = () => {
  const stats = [
    { label: 'Total Bookings', value: '124' },
    { label: 'Confirmed', value: '87' },
    { label: 'Pending', value: '24' },
    { label: 'Cancelled', value: '13' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div style={{ backgroundColor: '#0B1F3A', padding: '40px 20px', color: 'white' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
          Booking <span style={{ color: '#C8963E' }}>Management</span>
        </h1>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>
          View and manage all campus resource bookings
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {stats.map((item) => (
            <div key={item.label} style={styles.card}>
              <h2 style={{ fontSize: '22px', color: '#0B1F3A' }}>{item.value}</h2>
              <p style={{ fontSize: '12px', color: '#888' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking List */}
      <div style={{ padding: '24px 20px' }}>
        <BookingList />
      </div>

    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    minWidth: '110px',
    textAlign: 'center',
  },
};

export default BookingsPage;