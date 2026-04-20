import api from '../api';

const API_BASE_URL = '/api/resources';

/**
 * Get all resources with optional filtering
 * @param {object} filters - Optional filters: { type, location, minCapacity }
 * @returns {Promise<array>} - Array of resource objects
 * @throws {Error} - Error with message from API if request fails
 */
export const getAllResources = async (filters = {}) => {
  try {
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.location) params.location = filters.location;
    if (filters.minCapacity) params.minCapacity = filters.minCapacity;

    const response = await api.get(API_BASE_URL, { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Error fetching resources');
  }
};

/**
 * Get a single resource by ID
 * @param {string} id - Resource ID
 * @returns {Promise<object>} - Resource object
 * @throws {Error} - Error with message from API if request fails
 */
export const getResourceById = async (id) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Error fetching resource');
  }
};

/**
 * Create a new resource
 * @param {object} resourceData - Resource data object
 * @returns {Promise<object>} - Created resource object
 * @throws {Error} - Error with message from API if request fails
 */
export const createResource = async (resourceData) => {
  try {
    const response = await api.post(API_BASE_URL, resourceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Error creating resource');
  }
};

/**
 * Update an existing resource
 * @param {string} id - Resource ID
 * @param {object} resourceData - Updated resource data object
 * @returns {Promise<object>} - Updated resource object
 * @throws {Error} - Error with message from API if request fails
 */
export const updateResource = async (id, resourceData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${id}`, resourceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Error updating resource');
  }
};

/**
 * Delete a resource (soft delete via API)
 * @param {string} id - Resource ID
 * @returns {Promise<void>}
 * @throws {Error} - Error with message from API if request fails
 */
export const deleteResource = async (id) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Error deleting resource');
  }
};
