import React, { useEffect, useState } from "react";
import { getAllTickets } from "../../services/ticketService";

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

  .ticket-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  }

  .ticket-card:hover {
    border-color: #667eea;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }

  .ticket-card:active {
    transform: translateY(0);
  }

  .ticket-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .ticket-card__title {
    font-size: 14px;
    font-weight: 600;
    color: #1a202c;
    margin: 0;
    line-height: 1.4;
  }

  .ticket-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ticket-card__category {
    font-size: 12px;
    color: #718096;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ticket-card__badges {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .ticket-badge {
    display: inline-block;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: 11px;
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
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const loadTickets = async () => {
    const res = await getAllTickets(statusFilter || null);
    setTickets(res.data);
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

        {/* Ticket cards */}
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="ticket-card"
            onClick={() => onSelectTicket(ticket.id)}
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
            </div>
          </div>
        ))}

      </div>
    </>
  );
}

export default TicketList;