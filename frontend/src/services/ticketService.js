import api from "../api";

const API = "http://localhost:8081/api/tickets";

export const getAllTickets = (status) => {
  if (status) {
    return api.get(`${API}?status=${status}`);
  }
  return api.get(API);
};

export const getAssignedTickets = (technicianName) => {
  return api.get(`${API}?assignedTechnician=${technicianName}`);
};

export const getTicketById = (id) => api.get(`${API}/${id}`);

export const createTicket = (ticketData, files) => {
  const formData = new FormData();
  formData.append("ticket", JSON.stringify(ticketData));

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  return api.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const assignTechnician = (id, assignedTechnician) =>
  api.put(`${API}/${id}/assign`, { assignedTechnician });

export const updateTicketStatus = (id, status, resolutionNote) =>
  api.put(`${API}/${id}/status`, { status, resolutionNote });

export const addTechnicianUpdate = (id, message, updatedBy) =>
  api.post(`${API}/${id}/updates`, { message, updatedBy });

export const deleteTicket = (id) => api.delete(`${API}/${id}`);