import React, { useState, useEffect } from 'react';
import BookingList from './bookings/BookingList';
import BookingForm from './bookings/BookingForm';
import Navbar from "../components/Navbar/Navbar";
import { getAllResources } from '../services/resourceService';
import { getAllBookings } from '../services/bookingService';
import { useAuth } from '../AuthContext';

const BookingsPage = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Total Bookings', value: '0' },
    { label: 'Approved', value: '0' },
    { label: 'Pending', value: '0' },
    { label: 'Rejected', value: '0' },
    { label: 'Cancelled', value: '0' },
  ]);

  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  // Fetch bookings and calculate stats
  useEffect(() => {
    const fetchBookingsStats = async () => {
      try {
        const data = await getAllBookings();
        setBookings(data || []);
        
        // Calculate stats
        const total = data?.length || 0;
        const approved = data?.filter(b => b.status === 'APPROVED').length || 0;
        const pending = data?.filter(b => b.status === 'PENDING').length || 0;
        const rejected = data?.filter(b => b.status === 'REJECTED').length || 0;
        const cancelled = data?.filter(b => b.status === 'CANCELLED').length || 0;
        
        setStats([
          { label: 'Total Bookings', value: total.toString() },
          { label: 'Approved', value: approved.toString() },
          { label: 'Pending', value: pending.toString() },
          { label: 'Rejected', value: rejected.toString() },
          { label: 'Cancelled', value: cancelled.toString() },
        ]);
      } catch (err) {
        console.error('Error fetching bookings stats:', err);
      }
    };

    if (isAdmin) {
      fetchBookingsStats();
    }
  }, [isAdmin]);

  // Fetch resources from database
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllResources();
        setResources(data || []);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError(err.message || 'Failed to load resources');
      } finally {
        setLoading(false);
      }
    };

    if (showBookingForm) {
      fetchResources();
    }
  }, [showBookingForm]);

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
                {isAdmin ? 'Review and manage all campus resource bookings' : 'View and manage all campus resource bookings'}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => setShowBookingForm(true)}
                style={styles.btnNewBooking}
              >
                + Request Booking
              </button>
            )}
          </div>

          {/* Stats - Admin Only */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {stats.map((item) => (
                <div key={item.label} style={styles.card}>
                  <h2 style={{ fontSize: '22px', color: '#0B1F3A', margin: 0 }}>{item.value}</h2>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0, marginTop: '4px' }}>{item.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking List */}
      <div style={{ padding: '24px 20px' }}>
        <BookingList />
      </div>

      {/* Booking Form Modal - Step 1: Select Resource */}
      {showBookingForm && !selectedResource && (
        <div style={styles.overlay}>
          <div style={{ ...styles.modal, maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={styles.modalTitle}>Select Resource</h2>
            <p style={styles.modalSubtitle}>Choose which resource you want to book</p>
            
            {loading && (
              <div style={styles.loadingContainer}>
                <div style={styles.spinner}>⏳</div>
                <p style={{ textAlign: 'center', color: '#666' }}>Loading available resources...</p>
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}

            {!loading && resources.length > 0 && (
              <div style={styles.resourceCardGrid}>
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => handleResourceSelect(resource)}
                    style={styles.detailedResourceCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    {/* Accent bar */}
                    <div style={{
                      height: '3px',
                      width: '100%',
                      background: getTypeGradient(resource.type),
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px'
                    }} />

                    <div style={styles.resourceCardContent}>
                      {/* Type badge */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ ...styles.typeBadge, ...getTypeBadgeStyle(resource.type) }}>
                          {formatResourceType(resource.type)}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: resource.status === 'ACTIVE' ? '#E6F7F0' : '#FCEBEB',
                          color: resource.status === 'ACTIVE' ? '#0F6E56' : '#A32D2D'
                        }}>
                          {resource.status?.replace(/_/g, ' ') || 'N/A'}
                        </span>
                      </div>

                      {/* Resource name */}
                      <h3 style={styles.resourceName}>{resource.name}</h3>

                      {/* Details grid */}
                      <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Capacity</span>
                          <span style={styles.detailValue}>{resource.capacity} people</span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.detailLabel}>Location</span>
                          <span style={styles.detailValue}>{resource.location || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      {resource.description && (
                        <p style={styles.resourceDescription}>
                          {resource.description.substring(0, 80)}
                          {resource.description.length > 80 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!loading && resources.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ color: '#999', marginBottom: '0' }}>No resources available at the moment</p>
              </div>
            )}

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

// Helper functions for resource type styling
const TYPE_GRADIENT = {
  LECTURE_HALL: 'linear-gradient(to right, #1A3F8F, #5882E0)',
  LAB: 'linear-gradient(to right, #0F6E56, #1D9E75)',
  MEETING_ROOM: 'linear-gradient(to right, #854F0B, #C8963E)',
  EQUIPMENT: 'linear-gradient(to right, #534AB7, #8F7FE8)',
};

const TYPE_BADGE = {
  LECTURE_HALL: { backgroundColor: '#E8F0FD', color: '#1A3F8F' },
  LAB: { backgroundColor: '#E6F7F0', color: '#0F6E56' },
  MEETING_ROOM: { backgroundColor: '#FDF5E6', color: '#854F0B' },
  EQUIPMENT: { backgroundColor: '#F0EBF8', color: '#534AB7' },
};

const getTypeGradient = (type) => {
  return TYPE_GRADIENT[type] || 'linear-gradient(to right, #999, #aaa)';
};

const getTypeBadgeStyle = (type) => {
  return TYPE_BADGE[type] || { backgroundColor: '#f3f4f6', color: '#6b7280' };
};

const formatResourceType = (type) => {
  if (!type) return 'Unknown';
  return type
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  resourceCardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  detailedResourceCard: {
    backgroundColor: 'white',
    border: '1px solid rgba(11, 31, 58, 0.1)',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 220ms ease-out',
    textAlign: 'left',
    padding: 0,
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  resourceCardContent: {
    padding: '16px',
  },
  typeBadge: {
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    padding: '4px 8px',
    borderRadius: '8px',
  },
  resourceName: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#0B1F3A',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '12px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9f9f9',
    padding: '8px',
    borderRadius: '6px',
  },
  detailLabel: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#5A6A82',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '4px',
  },
  detailValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#0B1F3A',
  },
  resourceDescription: {
    fontSize: '12px',
    color: '#666',
    margin: 0,
    lineHeight: '1.4',
    fontStyle: 'italic',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  spinner: {
    fontSize: '48px',
    marginBottom: '16px',
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