const API_BASE_URL = 'http://localhost:8081/api/resources';

/**
 * Build query string from filter object
 * @param {object} filters - Filter object with optional keys: type, location, minCapacity
 * @returns {string} - Query string (e.g., "?type=LAB&location=Block+A")
 */
const buildQueryString = (filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return '';
  }

  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.location) params.append('location', filters.location);
  if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
};

/**
 * Get all resources with optional filtering
 * @param {object} filters - Optional filters: { type, location, minCapacity }
 * @returns {Promise<array>} - Array of resource objects
 * @throws {Error} - Error with message from API if request fails
 */
export const getAllResources = async (filters = {}) => {
  try {
    const queryString = buildQueryString(filters);
    const response = await fetch(`${API_BASE_URL}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error = {};
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      }
      throw new Error(error.message || `Failed to fetch resources: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching resources');
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error = {};
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      }
      throw new Error(error.message || `Failed to fetch resource: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error fetching resource');
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
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error = {};
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      }
      throw new Error(error.message || `Failed to create resource: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error creating resource');
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resourceData),
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error = {};
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      }
      throw new Error(error.message || `Failed to update resource: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Error updating resource');
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
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let error = {};
      if (contentType && contentType.includes('application/json')) {
        error = await response.json();
      }
      throw new Error(error.message || `Failed to delete resource: ${response.statusText}`);
    }

    // DELETE typically returns 204 No Content or empty 200
    if (response.status !== 204 && response.status !== 200) {
      return await response.json();
    }
  } catch (error) {
    throw new Error(error.message || 'Error deleting resource');
  }
};
