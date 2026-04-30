import React, { useState, useEffect } from 'react';
import ResourceList from './ResourceList';
import { getAllResources } from '../../services/resourceService';
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../AuthContext";

const FacilitiesPage = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  
  const [resources, setResources] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showAvailableModal, setShowAvailableModal] = useState(false);
  const [showOutOfServiceModal, setShowOutOfServiceModal] = useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAllResources();
        setResources(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load resources:', err);
        setResources([]);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRooms = resources.length;
  const availableRooms = resources.filter(r => r.status === 'ACTIVE' || r.status === 'active').length;
  const outOfServiceRooms = resources.filter(r => r.status === 'OUT_OF_SERVICE' || r.status === 'out_of_service').length;
  const availableResources = resources.filter(r => r.status === 'ACTIVE' || r.status === 'active');
  const outOfServiceResources = resources.filter(r => r.status === 'OUT_OF_SERVICE' || r.status === 'out_of_service');

  const stats = [
    { label: 'Total Rooms', value: statsLoading ? '...' : totalRooms.toString(), onClick: () => setShowTotalModal(true) },
    { label: 'Available', value: statsLoading ? '...' : availableRooms.toString(), onClick: () => setShowAvailableModal(true) },
    { label: 'Out of Service', value: statsLoading ? '...' : outOfServiceRooms.toString(), onClick: () => setShowOutOfServiceModal(true) },
  ];

  const styles = {
    card: {
      backgroundColor: 'rgba(255,255,255,0.35)',
      border: '1px solid rgba(255,255,255,0.45)',
      borderRadius: '12px',
      padding: '1rem',
      textAlign: 'center',
      minWidth: '100px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      {/* Hero Header */}
      <div style={{ backgroundColor: '#0B1F3A', padding: '3rem 1rem', textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Campus Facilities & Assets</h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)' }}>Browse and book campus resources in real time</p>
        
        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {stats.map(({ label, value, onClick }) => (
            <div 
              key={label}
              onClick={onClick}
              style={styles.card}
            >
              <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>{value}</h3>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Resource List */}
      <div style={{ padding: '2rem' }}>
        <ResourceList resources={resources} isAdmin={isAdmin} />
      </div>

      {/* Modals */}
      {showAvailableModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2>Available Facilities ({availableResources.length})</h2>
            <button onClick={() => setShowAvailableModal(false)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0B1F3A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
            {availableResources.length === 0 ? (
              <p>No available facilities at the moment.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {availableResources.map(r => (
                  <li key={r._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{r.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showOutOfServiceModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2>Out of Service Facilities ({outOfServiceResources.length})</h2>
            <button onClick={() => setShowOutOfServiceModal(false)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0B1F3A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
            {outOfServiceResources.length === 0 ? (
              <p>All facilities are in service.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {outOfServiceResources.map(r => (
                  <li key={r._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{r.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showTotalModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '2rem', maxWidth: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <h2>All Facilities ({totalRooms})</h2>
            <button onClick={() => setShowTotalModal(false)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0B1F3A', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {resources.map(r => (
                <li key={r._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{r.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilitiesPage;
