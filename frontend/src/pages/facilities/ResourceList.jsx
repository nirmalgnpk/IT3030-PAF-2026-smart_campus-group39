import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import ResourceFilter from './ResourceFilter';
import ResourceForm from './ResourceForm';
import { getAllResources, deleteResource } from '../../services/resourceService';

/**
 * ResourceList Component — Full Facilities Management Page
 *
 * Displays:
 * - Toolbar with breadcrumb and "Add Resource" button
 * - Filter panel
 * - Resource grid with cards
 * - Loading/error/empty states
 * - Delete modal for admin users
 * - Create/edit modal
 */

const Spinner = ({ size = 24, color = '#0B1F3A' }) => (
  <svg
    style={{ animation: 'spin 1s linear infinite', width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" style={{ opacity: 0.25 }} />
    <path d="M12 2a10 10 0 0110 10" style={{ opacity: 1 }} />
  </svg>
);

const ResourceList = ({ isAdmin = true }) => {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    location: '',
    capacityMin: '',
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  /* ── Fetch all resources ── */
  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load resources.');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  /* ── Filter resources ── */
  const filteredResources = resources.filter(resource => {
    if (filters.type && resource.type !== filters.type) return false;
    if (filters.status && resource.status !== filters.status) return false;
    if (filters.location && !resource.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.capacityMin && resource.capacity < filters.capacityMin) return false;
    return true;
  });

  /* ── Delete resource ── */
  const handleDelete = async (resourceId) => {
    setDeleteLoading(true);
    try {
      await deleteResource(resourceId);
      setResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (err) {
      alert('Failed to delete resource: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid rgba(11,31,58,0.10)',
        marginBottom: '2rem',
      }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '12px', color: '#5A6A82', fontWeight: '500' }}>Facilities</span>
          <span style={{ fontSize: '12px', color: '#5A6A82' }}>/</span>
          <span style={{ fontSize: '12px', color: '#0B1F3A', fontWeight: '600' }}>Resources</span>
        </div>

        {/* Add Resource Button */}
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedResource(null);
              setShowForm(true);
            }}
            style={{
              backgroundColor: '#0B1F3A',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 180ms ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#132d52'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0B1F3A'}
          >
            + Add Resource
          </button>
        )}
      </div>

      {/* ── Filter panel (full-width at top) ── */}
      <div style={{ marginBottom: '2rem' }}>
        <ResourceFilter
          filters={filters}
          onFiltersChange={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* ── Resources grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '1.875rem',
      }}>
        {loading ? (
          /* Loading state */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            backgroundColor: 'white',
            borderRadius: '14px',
            border: '1px solid rgba(11,31,58,0.10)',
          }}>
              <Spinner size={32} />
            </div>
          ) : error ? (
            /* Error state */
            <div style={{
              padding: '2rem',
              backgroundColor: '#FCEBEB',
              color: '#A32D2D',
              borderRadius: '14px',
              textAlign: 'center',
              border: '1px solid rgba(163, 45, 45, 0.2)',
            }}>
              <p style={{ margin: 0, fontWeight: '500' }}>
                {error}
              </p>
            </div>
          ) : filteredResources.length === 0 ? (
            /* Empty state */
            <div style={{
              padding: '3rem 2rem',
              backgroundColor: 'white',
              borderRadius: '14px',
              border: '1px solid rgba(11,31,58,0.10)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '14px', color: '#5A6A82', marginBottom: '0.5rem' }}>
                No resources found
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                Adjust filters or create a new resource to get started.
              </div>
            </div>
          ) : (
            /* Resources grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}>
              {filteredResources.map(resource => (
                <div key={resource.id} style={{ position: 'relative' }}>
                  <ResourceCard
                    resource={resource}
                    onViewDetails={(resourceId) => navigate(`/facilities/${resourceId}`)}
                    onEdit={(resourceId) => {
                      setSelectedResource(resource);
                      setShowForm(true);
                    }}
                    isAdmin={isAdmin}
                  />

                  {/* Delete overlay for admin */}
                  {isAdmin && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(11,31,58,0.75)',
                      borderRadius: '18px',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.display = 'flex'}
                    onMouseLeave={(e) => e.currentTarget.style.display = 'none'}
                    >
                      <button
                        onClick={() => handleDelete(resource.id)}
                        disabled={deleteLoading}
                        style={{
                          backgroundColor: deleteLoading ? '#f3f4f6' : '#E24B4A',
                          color: deleteLoading ? '#9ca3af' : 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                          padding: '0.625rem 1rem',
                          borderRadius: '10px',
                          border: 'none',
                          cursor: deleteLoading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          transition: 'all 180ms ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!deleteLoading) e.target.style.backgroundColor = '#C32F2A';
                        }}
                        onMouseLeave={(e) => {
                          if (!deleteLoading) e.target.style.backgroundColor = '#E24B4A';
                        }}
                      >
                        {deleteLoading ? <Spinner size={14} color="#6b7280" /> : null}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(11,31,58,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowForm(false);
        }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(11,31,58,0.20)',
          }}>

            {/* Modal header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(11,31,58,0.10)',
            }}>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#0B1F3A',
                margin: 0,
              }}>
                {selectedResource ? 'Edit Resource' : 'Create New Resource'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#5A6A82',
                  padding: 0,
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <ResourceForm
              initialData={selectedResource}
              onSubmit={() => {
                setShowForm(false);
                fetchResources();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceList;
