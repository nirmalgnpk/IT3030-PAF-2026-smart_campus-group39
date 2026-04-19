import React, { useEffect, useState } from "react";
import {
  getTicketById,
  assignTechnician,
  updateTicketStatus,
  addTechnicianUpdate,
} from "../../services/ticketService";
import { useAuth } from "../../AuthContext";

function TicketDetail({ ticketId }) {
  const [ticket, setTicket] = useState(null);
  const [techName, setTechName] = useState("");
  const [status, setStatus] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const { currentUser } = useAuth();

  const isAdmin = currentUser?.role === "ADMIN";
  const isTechnician = currentUser?.role === "TECHNICIAN";
  const isAdminOrTech = isAdmin || isTechnician;

  const loadTicket = async () => {
    const res = await getTicketById(ticketId);
    setTicket(res.data);
    setStatus(res.data.status);
  };

  useEffect(() => {
    if (ticketId) loadTicket();
  }, [ticketId]);

  const handleAssign = async () => {
    await assignTechnician(ticketId, techName);
    loadTicket();
  };

  const handleStatusUpdate = async () => {
    await updateTicketStatus(ticketId, status, resolutionNote);
    loadTicket();
  };

  const handleAddUpdate = async () => {
    await addTechnicianUpdate(ticketId, updateMsg, updatedBy);
    setUpdateMsg("");
    setUpdatedBy("");
    loadTicket();
  };

  if (!ticket) return <p>Select a ticket</p>;

  return (
    <div>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Location: {ticket.location}</p>
      <p>Assigned Technician: {ticket.assignedTechnician || "Not assigned"}</p>

      <h3>Attachments</h3>
      {ticket.attachments?.map((att) => (
        <img
          key={att.id}
          src={`http://localhost:8081/${att.filePath.replace("\\", "/")}`}
          alt={att.fileName}
          width="150"
        />
      ))}

      {isAdmin && (
        <>
          <h3>Assign Technician</h3>
          <input value={techName} onChange={(e) => setTechName(e.target.value)} placeholder="Technician name" />
          <button onClick={handleAssign}>Assign</button>
        </>
      )}

      {isTechnician && (
        <>
          <h3>Update Status</h3>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <textarea
            placeholder="Resolution Note"
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
          />
          <button onClick={handleStatusUpdate}>Update Status</button>
        </>
      )}

      <h3>Technician Updates</h3>
      {ticket.updates?.map((u) => (
        <div key={u.id}>
          <p><strong>{u.updatedBy}</strong>: {u.message}</p>
        </div>
      ))}

      {isAdminOrTech && (
        <>
          <input value={updatedBy} onChange={(e) => setUpdatedBy(e.target.value)} placeholder="Updated By" />
          <textarea value={updateMsg} onChange={(e) => setUpdateMsg(e.target.value)} placeholder="Update message" />
          <button onClick={handleAddUpdate}>Add Update</button>
        </>
      )}
    </div>
  );
}

export default TicketDetail;