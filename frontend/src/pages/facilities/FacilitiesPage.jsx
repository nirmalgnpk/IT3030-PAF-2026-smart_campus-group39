import React from 'react';
import ResourceList from './ResourceList';
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from '../../AuthContext';

const FacilitiesPage = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const stats = [
    { label: 'Total Rooms', value: '48' },
    { label: 'Available', value: '36' },
  ];

  return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F7F8FC' }}>

        {/* ✅ Navbar */}
        <Navbar />

        {/* Hero Section */}
        <div style={{ backgroundColor: '#0B1F3A', padding: '40px 20px', color: 'white' }}>
          <h1 style={{ fontSize: '32px' }}>
            Campus Facilities <span style={{ color: '#C8963E' }}>& Assets</span>
          </h1>
          <p style={{ color: '#ccc' }}>
            Browse, filter, and book campus resources
          </p>


          {/* Stats */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {stats.map((item) => (
                <div key={item.label} style={styles.card}>
                  <h2>{item.value}</h2>
                  <p>{item.label}</p>
                </div>
            ))}

            {isAdmin && (
                <div style={{ ...styles.card, backgroundColor: '#C8963E', color: '#000' }}>
                  <h3>Admin</h3>
                  <p>Mode</p>
                </div>
            )}
          </div>
        </div>

        {/* Resource List */}
        <div style={{ padding: '20px' }}>
          <ResourceList isAdmin={isAdmin} />
        </div>
      </div>
  );
  
};

const styles = {
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "10px",
    minWidth: "100px",
    textAlign: "center",
  },
};

export default FacilitiesPage;