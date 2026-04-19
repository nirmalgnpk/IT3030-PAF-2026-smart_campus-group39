const API_URL = 'http://localhost:8080/api/bookings';

/**
 * Get all bookings with optional filters
 * @param {Object} filters - Optional filters: { status, userId, resourceId }
 * @returns {Promise<Array>} List of bookings
 */
export const getAllBookings = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        
        if (filters.status) params.append('status', filters.status);
        if (filters.userId) params.append('userId', filters.userId);
        if (filters.resourceId) params.append('resourceId', filters.resourceId);
        
        const queryString = params.toString();
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching all bookings:', error);
        throw error;
    }
};

/**
 * Get a booking by ID
 * @param {String} id - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export const getBookingById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching booking ${id}:`, error);
        throw error;
    }
};

/**
 * Get all bookings for a specific user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} List of user's bookings
 */
export const getUserBookings = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching bookings for user ${userId}:`, error);
        throw error;
    }
};

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Created booking
 * @throws {Error} If booking conflicts with existing reservations (409) or validation fails
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

/**
 * Approve a pending booking (Admin only)
 * @param {String} id - Booking ID
 * @returns {Promise<Object>} Updated booking
 */
export const approveBooking = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error approving booking ${id}:`, error);
        throw error;
    }
};

/**
 * Reject a pending booking (Admin only)
 * @param {String} id - Booking ID
 * @param {String} reason - Rejection reason
 * @returns {Promise<Object>} Updated booking
 */
export const rejectBooking = async (id, reason) => {
    try {
        const response = await fetch(`${API_URL}/${id}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error rejecting booking ${id}:`, error);
        throw error;
    }
};

/**
 * Cancel an approved booking
 * @param {String} id - Booking ID
 * @returns {Promise<Object>} Updated booking
 */
export const cancelBooking = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error cancelling booking ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a booking (Admin only)
 * @param {String} id - Booking ID
 * @returns {Promise<void>}
 */
export const deleteBooking = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || `HTTP Error: ${response.status}`);
        }
        
        return response.ok;
    } catch (error) {
        console.error(`Error deleting booking ${id}:`, error);
        throw error;
    }
};
