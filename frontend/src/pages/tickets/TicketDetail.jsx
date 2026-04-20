import React, { useEffect, useState } from "react";
import {
  getTicketById,
  assignTechnician,
  updateTicketStatus,
  addTechnicianUpdate,
} from "../../services/ticketService";
import { useAuth } from "../../AuthContext";

const styles = `
  .detail-wrapper {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    max-width: 1000px;
    margin: 0 auto;
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
  }

  .detail-header {
    border-bottom: 2px solid #f3f4f6;
    padding-bottom: 20px;
    margin-bottom: 24px;
  }

  .detail-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin: 0 0 12px 0;
  }

  .detail-tags {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .detail-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .badge-status { background: #dcfce7; color: #065f46; border: 1px solid #bbf7d0; }
  .badge-priority { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

  .detail-info-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 28px;
  }

  .info-desc-label {
    font-size: 13px;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0 0 8px 0;
  }

  .info-desc-text {
    font-size: 16px;
    color: #1f2937;
    line-height: 1.6;
    margin: 0 0 24px 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    border-top: 1px solid #e5e7eb;
    padding-top: 20px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .info-label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-value {
    font-size: 15px;
    color: #111827;
    font-weight: 500;
  }

  .detail-section-title {
    font-size: 18px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 16px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .detail-attachments {
    margin-bottom: 32px;
  }

  .attachment-grid {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .attachment-img-container {
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    position: relative;
    width: 160px;
    height: 160px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }

  .attachment-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s ease;
    z-index: 2;
    position: relative;
    background: #fff; /* masks the alt text below if image loads */
  }

  .attachment-img:hover {
    transform: scale(1.05);
  }

  .attachment-alt-text {
    position: absolute;
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    padding: 10px;
    word-break: break-word;
    z-index: 1;
  }

  .admin-panel, .tech-panel {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 24px;
    margin-bottom: 28px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  }

  .admin-panel { border-left: 4px solid #f59e0b; background: #fffbeb; }
  .tech-panel { border-left: 4px solid #3b82f6; background: #eff6ff; }

  .panel-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 16px 0;
  }

  .admin-panel .panel-title { color: #b45309; }
  .tech-panel .panel-title { color: #1d4ed8; }

  .form-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .form-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .detail-input, .detail-select, .detail-textarea {
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
    box-sizing: border-box;
    background: #ffffff;
  }

  .detail-input:focus, .detail-select:focus, .detail-textarea:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .detail-btn {
    padding: 12px 20px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .btn-admin { background: #f59e0b; }
  .btn-admin:hover { background: #d97706; }
  
  .btn-tech { background: #3b82f6; }
  .btn-tech:hover { background: #2563eb; }

  .btn-dark { background: #4f46e5; }
  .btn-dark:hover { background: #4338ca; }

  .activity-log {
    margin-top: 32px;
  }

  .log-empty {
    color: #9ca3af;
    font-style: italic;
    background: #f9fafb;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    border: 1px dashed #d1d5db;
  }

  .log-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .log-item {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-left: 4px solid #6366f1;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }

  .log-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .log-author {
    font-weight: 700;
    color: #111827;
  }

  .log-text {
    color: #6b7280;
  }

  .log-msg {
    margin: 0;
    color: #374151;
    font-size: 15px;
    line-height: 1.5;
  }

  .add-log-box {
    margin-top: 24px;
    background: #f9fafb;
    padding: 20px;
    border-radius: 10px;
    border: 1px dashed #c0c4cc;
  }
  
  .add-log-title {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
    color: #4b5563;
  }
`;

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

  if (!ticket) return <p style={{ color: "#718096", padding: "20px" }}>Loading ticket details...</p>;

  return (
    <div className="detail-wrapper">
      <style>{styles}</style>

      {/* Header section */}
      <div className="detail-header">
        <h2 className="detail-title">{ticket.title}</h2>
        <div className="detail-tags">
          <span className="detail-badge badge-status">{ticket.status}</span>
          <span className="detail-badge badge-priority">Priority: {ticket.priority}</span>
        </div>
      </div>

      {/* Details section */}
      <div className="detail-info-card">
        <h3 className="info-desc-label">Description</h3>
        <p className="info-desc-text">{ticket.description || "No description provided."}</p>
        
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Category</span>
            <span className="info-value">{ticket.category || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location</span>
            <span className="info-value">{ticket.location || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Creator</span>
            <span className="info-value">{ticket.createdBy || "Anonymous"}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Assigned Technician</span>
            <span className="info-value">{ticket.assignedTechnician || "Not assigned"}</span>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      {ticket.attachments?.length > 0 && (
        <div className="detail-attachments">
          <h3 className="detail-section-title">Attachments</h3>
          <div className="attachment-grid">
            {ticket.attachments.map((att) => (
              <a 
                key={att.id} 
                href={`http://localhost:8081/${att.filePath.replace("\\", "/")}`} 
                target="_blank" 
                rel="noreferrer"
                className="attachment-img-container"
              >
                {/* Fallback alt text shown underneath if the image fails to load */}
                <span className="attachment-alt-text">{att.fileName}</span>
                <img
                  className="attachment-img"
                  src={`http://localhost:8081/${att.filePath.replace("\\", "/")}`}
                  alt={att.fileName}
                  onError={(e) => {
                    e.target.style.display = 'none'; // hide the broken image element and reveal alt-text below
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="admin-panel">
          <h3 className="panel-title">Admin Controls - Assign Technician</h3>
          <div className="form-row">
            <input 
              className="detail-input"
              value={techName} 
              onChange={(e) => setTechName(e.target.value)} 
              placeholder="Technician username" 
              style={{ flex: 1 }}
            />
            <button className="detail-btn btn-admin" onClick={handleAssign}>
              Assign
            </button>
          </div>
        </div>
      )}

      {/* Technician Status Controls */}
      {isTechnician && (
        <div className="tech-panel">
          <h3 className="panel-title">Technician Controls - Update Status</h3>
          <div className="form-col">
            <select 
              className="detail-select"
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <textarea
              className="detail-textarea"
              placeholder="Resolution Note (optional)"
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              style={{ minHeight: "80px" }}
            />
            <button className="detail-btn btn-tech" onClick={handleStatusUpdate} style={{ alignSelf: "flex-start" }}>
              Update Ticket
            </button>
          </div>
        </div>
      )}

      {/* Activity Log Section */}
      <div className="activity-log">
        <h3 className="detail-section-title" style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "20px" }}>
          Activity Log
        </h3>
        
        {ticket.updates?.length > 0 ? (
          <div className="log-list">
            {ticket.updates.map((u) => (
              <div key={u.id} className="log-item">
                <div className="log-header">
                  <span className="log-author">{u.updatedBy}</span>
                  <span className="log-text">left an update</span>
                </div>
                <p className="log-msg">{u.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="log-empty">No updates on this ticket yet.</div>
        )}

        {/* Add View/Tech Update Form */}
        {isAdminOrTech && (
          <div className="add-log-box">
            <h4 className="add-log-title">Add an update log</h4>
            <div className="form-col">
              <input 
                className="detail-input"
                value={updatedBy} 
                onChange={(e) => setUpdatedBy(e.target.value)} 
                placeholder="Your Name (Updated By)" 
              />
              <textarea 
                className="detail-textarea"
                value={updateMsg} 
                onChange={(e) => setUpdateMsg(e.target.value)} 
                placeholder="Update message details..." 
                style={{ minHeight: "80px" }}
              />
              <button className="detail-btn btn-dark" onClick={handleAddUpdate} style={{ alignSelf: "flex-end" }}>
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