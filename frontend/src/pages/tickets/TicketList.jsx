import React, { useEffect, useState } from "react";
import { getAllTickets, getAssignedTickets, deleteTicket } from "../../services/ticketService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const styles = `
  .ticket-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ticket-list__filter-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .ticket-list__filter-label {
    font-size: 13px;
    font-weight: 500;
    color: #4a5568;
    white-space: nowrap;
  }

  .ticket-list__select {
    flex: 1;
    padding: 8px 32px 8px 12px;
    font-size: 13px;
    color: #1a202c;
    background: #f9fafb;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
  }

  .ticket-list__select:focus {
    border-color: #667eea;
    background-color: #ffffff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }

  .ticket-list__empty {
    text-align: center;
    padding: 32px 16px;
    color: #a0aec0;
    font-size: 14px;
    border: 1.5px dashed #e2e8f0;
    border-radius: 10px;
    background: #f9fafb;
  }

  .ticket-list__empty-icon {
    font-size: 28px;
    margin-bottom: 8px;
  }

  .ticket-list__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .ticket-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    min-height: 140px;
  }

  .ticket-card:hover {
    border-color: #667eea;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.12);
    transform: translateY(-2px);
  }

  .ticket-card:active {
    transform: translateY(0);
  }

  .ticket-card__header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .ticket-card__title {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
    line-height: 1.4;
  }

  .ticket-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid #edf2f7;
  }

  .ticket-card__category {
    font-size: 13px;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f7fafc;
    padding: 4px 10px;
    border-radius: 20px;
  }

  .ticket-card__badges {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
    flex-shrink: 0;
  }

  .ticket-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
    border: 1px solid transparent;
  }

  /* Status badges */
  .ticket-badge--OPEN        { background: #ebf8ff; color: #2b6cb0; border-color: #bee3f8; }
  .ticket-badge--IN_PROGRESS { background: #fffbeb; color: #7b5e00; border-color: #f6e05e; }
  .ticket-badge--RESOLVED    { background: #f0fff4; color: #276749; border-color: #9ae6b4; }
  .ticket-badge--CLOSED      { background: #f7fafc; color: #4a5568; border-color: #cbd5e0; }
  .ticket-badge--REJECTED    { background: #fff5f5; color: #9b2c2c; border-color: #feb2b2; }

  /* Priority badges */
  .ticket-badge--LOW    { background: #f0fff4; color: #276749; border-color: #9ae6b4; }
  .ticket-badge--MEDIUM { background: #fffbeb; color: #7b5e00; border-color: #f6e05e; }
  .ticket-badge--HIGH   { background: #fff5f5; color: #9b2c2c; border-color: #feb2b2; }

  .ticket-card__delete {
    background: none;
    border: none;
    color: #e53e3e;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .ticket-card__delete:hover {
    background-color: #fff5f5;
  }
`;

const STATUS_LABELS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  REJECTED: "Rejected",
};

const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

function TicketList({ onSelectTicket }) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTickets = async () => {
    let res;
    if (currentUser?.role === "TECHNICIAN") {
      const username = currentUser?.name || currentUser?.userName;
      if (!username) {
        setTickets([]);
        return;
      }
      res = await getAssignedTickets(username);
      let tdata = res.data;
      if (statusFilter) {
        tdata = tdata.filter(t => t.status === statusFilter);
      }
      setTickets(tdata);
    } else {
      res = await getAllTickets(statusFilter || null);
      setTickets(res.data);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await deleteTicket(id);
        setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
      } catch (error) {
        console.error("Error deleting ticket:", error);
      }
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  return (
    <>
      <style>{styles}</style>
      <div className="ticket-list">

        {/* Filter row */}
        <div className="ticket-list__filter-row">
          <span className="ticket-list__filter-label">Filter by status:</span>
          <select
            className="ticket-list__select"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {/* Empty state */}
        {tickets.length === 0 && (
          <div className="ticket-list__empty">
            <div className="ticket-list__empty-icon">🎫</div>
            <div>No tickets found</div>
          </div>
        )}

        {/* Ticket cards inline grid */}
        <div className="ticket-list__grid">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => {
                if (onSelectTicket) {
                  onSelectTicket(ticket.id);
                  return;
                }
                // If we are currently under admin, navigate to admin route
                if (window.location.pathname.startsWith('/admin')) {
                  navigate(`/admin/tickets/${ticket.id}`);
                } else {
                  navigate(`/tickets/${ticket.id}`);
                }
              }}
            >
              <div className="ticket-card__header">
                <h4 className="ticket-card__title">{ticket.title}</h4>
                <div className="ticket-card__badges">
                  <span className={`ticket-badge ticket-badge--${ticket.priority}`}>
                    {PRIORITY_LABELS[ticket.priority] ?? ticket.priority}
                  </span>
                  <span className={`ticket-badge ticket-badge--${ticket.status}`}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                </div>
              </div>
              <div className="ticket-card__meta">
                <span className="ticket-card__category">📁 {ticket.category}</span>
                {(currentUser && (currentUser.role === "USER" || currentUser.role === "STUDENT" || ticket.createdBy === currentUser.name || ticket.createdBy === currentUser.userName || currentUser.role === "ADMIN")) && (
                  <button 
                    className="ticket-card__delete" 
                    onClick={(e) => handleDelete(e, ticket.id)}
                    title="Delete Ticket"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default TicketList;