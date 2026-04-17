import axios from "axios";

const API = "http://localhost:8081/api/tickets";

export const getAllTickets = (status) => {
  if (status) {
    return axios.get(`${API}?status=${status}`);
  }
  return axios.get(API);
};

export const getTicketById = (id) => axios.get(`${API}/${id}`);

export const createTicket = (ticketData, files) => {
  const formData = new FormData();
  formData.append("ticket", JSON.stringify(ticketData));

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  return axios.post(API, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const assignTechnician = (id, assignedTechnician) =>
  axios.put(`${API}/${id}/assign`, { assignedTechnician });

export const updateTicketStatus = (id, status, resolutionNote) =>
  axios.put(`${API}/${id}/status`, { status, resolutionNote });

export const addTechnicianUpdate = (id, message, updatedBy) =>
  axios.post(`${API}/${id}/updates`, { message, updatedBy });