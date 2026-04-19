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

  if (!ticket) return <p style={{ color: "#718096" }}>Loading ticket details...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header section */}
      <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px" }}>
        <h2 style={{ fontSize: "24px", color: "#1a202c", margin: "0 0 8px 0" }}>{ticket.title}</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
          <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#f0fff4", color: "#276749", fontWeight: "600" }}>{ticket.status}</span>
          <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#fff5f5", color: "#9b2c2c", fontWeight: "600" }}>Priority: {ticket.priority}</span>
        </div>
      </div>

      {/* Details section */}
      <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
        <p style={{ margin: "0 0 12px 0", color: "#4a5568", lineHeight: "1.6" }}><strong>Description:</strong><br/>{ticket.description || "No description provided."}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", color: "#4a5568", fontSize: "14px" }}>
          <p style={{ margin: 0 }}><strong>Category:</strong> {ticket.category || "N/A"}</p>
          <p style={{ margin: 0 }}><strong>Location:</strong> {ticket.location || "N/A"}</p>
          <p style={{ margin: 0 }}><strong>Creator:</strong> {ticket.createdBy || "Anonymous"}</p>
          <p style={{ margin: 0 }}><strong>Assigned Technician:</strong> {ticket.assignedTechnician || "Not assigned"}</p>
        </div>
      </div>

      {/* Attachments Section */}
      {ticket.attachments?.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", color: "#2d3748", margin: "0 0 12px 0" }}>Attachments</h3>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {ticket.attachments.map((att) => (
              <img
                key={att.id}
                src={`http://localhost:8081/${att.filePath.replace("\\", "/")}`}
                alt={att.fileName}
                style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e0" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div style={{ background: "#fffaf0", padding: "16px", borderRadius: "8px", border: "1px solid #feebc8" }}>
          <h3 style={{ fontSize: "16px", color: "#dd6b20", margin: "0 0 12px 0" }}>Admin Controls - Assign Technician</h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input 
              value={techName} 
              onChange={(e) => setTechName(e.target.value)} 
              placeholder="Technician username" 
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", flex: 1 }}
            />
            <button 
              onClick={handleAssign}
              style={{ background: "#dd6b20", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer" }}
            >
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Technician Status Controls */}
      {isTechnician && (
        <div style={{ background: "#ebf8ff", padding: "16px", borderRadius: "8px", border: "1px solid #bee3f8" }}>
          <h3 style={{ fontSize: "16px", color: "#2b6cb0", margin: "0 0 12px 0" }}>Technician Controls - Update Status</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0" }}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <textarea
              placeholder="Resolution Note (optional)"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", minHeight: "80px", fontFamily: "inherit" }}
            />
            <button 
              onClick={handleStatusUpdate}
              style={{ background: "#3182ce", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", alignSelf: "flex-start" }}
            >
              Update Ticket
            </button>
          </div>
        </div>
      )}

      {/* Updates Section */}
      <div style={{ marginTop: "8px" }}>
        <h3 style={{ fontSize: "16px", color: "#2d3748", margin: "0 0 16px 0", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>Activity Log</h3>
        
        {ticket.updates?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {ticket.updates.map((u) => (
              <div key={u.id} style={{ padding: "12px", background: "#f7fafc", borderRadius: "8px", borderLeft: "4px solid #a0aec0" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: "#718096" }}><strong>{u.updatedBy}</strong> left an update</p>
                <p style={{ margin: 0, color: "#1a202c" }}>{u.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#a0aec0", fontStyle: "italic", fontSize: "14px" }}>No updates on this ticket yet.</p>
        )}

        {/* Add View/Tech Update Form */}
        {isAdminOrTech && (
          <div style={{ marginTop: "24px", padding: "16px", background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#4a5568" }}>Add an update log</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input 
                value={updatedBy} 
                onChange={(e) => setUpdatedBy(e.target.value)} 
                placeholder="Your Name (Updated By)" 
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0" }}
              />
              <textarea 
                value={updateMsg} 
                onChange={(e) => setUpdateMsg(e.target.value)} 
                placeholder="Update message details..." 
                style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #cbd5e0", minHeight: "80px", fontFamily: "inherit" }}
              />
              <button 
                onClick={handleAddUpdate}
                style={{ background: "#4a5568", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: "600", cursor: "pointer", alignSelf: "flex-end" }}
              >
                Post Update
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;