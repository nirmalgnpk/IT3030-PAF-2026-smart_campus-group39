import React, { useState } from 'react';
import BookingList from './bookings/BookingList';
import BookingForm from './bookings/BookingForm';
import Navbar from "../components/Navbar/Navbar";

const BookingsPage = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const stats = [
    { label: 'Total Bookings', value: '124' },
    { label: 'Approved', value: '87' },
    { label: 'Pending', value: '24' },
    { label: 'Cancelled', value: '13' },
  ];

  // Sample resources - in production, fetch from API
  const resources = [
    { id: '1', name: 'Conference Room A' },
    { id: '2', name: 'Lecture Hall B' },
    { id: '3', name: 'Lab C' },
    { id: '4', name: 'Meeting Room D' },
  ];

  const handleResourceSelect = (resource) => {
    setSelectedResource(resource);
  };

  const handleFormClose = () => {
    setShowBookingForm(false);
    setSelectedResource(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div style={{ backgroundColor: '#0B1F3A', padding: '40px 20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
                Booking <span style={{ color: '#C8963E' }}>Management</span>
              </h1>
              <p style={{ color: '#ccc', marginBottom: '0' }}>
                View and manage all campus resource bookings
              </p>
            </div>
            <button
              onClick={() => setShowBookingForm(true)}
              style={styles.btnNewBooking}
            >
              + Request Booking
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {stats.map((item) => (
              <div key={item.label} style={styles.card}>
                <h2 style={{ fontSize: '22px', color: '#0B1F3A', margin: 0 }}>{item.value}</h2>
                <p style={{ fontSize: '12px', color: '#888', margin: 0, marginTop: '4px' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div style={{ padding: '24px 20px' }}>
        <BookingList />
      </div>

      {/* Booking Form Modal - Step 1: Select Resource */}
      {showBookingForm && !selectedResource && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Select Resource</h2>
            <p style={styles.modalSubtitle}>Choose which resource you want to book</p>
            
            <div style={styles.resourceGrid}>
              {resources.map((resource) => (
                <button
                  key={resource.id}
                  onClick={() => handleResourceSelect(resource)}
                  style={styles.resourceCard}
                >
                  <div style={{ fontSize: '20px', marginBottom: '8px' }}>📍</div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#0B1F3A' }}>
                    {resource.name}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleFormClose}
              style={styles.btnCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Modal - Step 2: Fill Details */}
      {showBookingForm && selectedResource && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <BookingForm
              resourceId={selectedResource.id}
              resourceName={selectedResource.name}
              onSuccess={handleFormClose}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  btnNewBooking: {
    padding: '12px 24px',
    backgroundColor: '#C8963E',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  card: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '10px',
    minWidth: '110px',
    textAlign: 'center',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0B1F3A',
    marginBottom: '8px',
    margin: 0,
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
    margin: '8px 0 24px 0',
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  resourceCard: {
    padding: '20px 16px',
    border: '2px solid #ddd',
    borderRadius: '10px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontSize: '13px',
  },
  btnCancel: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#f0f0f0',
    color: '#555',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default BookingsPage;