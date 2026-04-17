import React, { useState } from "react";
import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import TicketDetail from "./TicketDetail";

const styles = `
  .ticket-page {
    display: flex;
    gap: 24px;
    padding: 24px;
    min-height: 100vh;
    background-color: #f5f7fa;
    font-family: "Inter", "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  .ticket-page__left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }

  .ticket-page__right {
    flex: 1;
    min-width: 0;
  }

  .ticket-page__panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .ticket-page__panel-title {
    font-size: 15px;
    font-weight: 600;
    color: #1a202c;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
    letter-spacing: -0.01em;
  }

  @media (max-width: 768px) {
    .ticket-page {
      flex-direction: column;
      padding: 16px;
      gap: 16px;
    }
  }
`;

function TicketPage() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  return (
    <>
      <style>{styles}</style>
      <div className="ticket-page">
        <div className="ticket-page__left">
          <div className="ticket-page__panel">
            <h2 className="ticket-page__panel-title">New Ticket</h2>
            <TicketForm />
          </div>
          <div className="ticket-page__panel">
            <h2 className="ticket-page__panel-title">All Tickets</h2>
            <TicketList onSelectTicket={setSelectedTicketId} />
          </div>
        </div>
        <div className="ticket-page__right">
          <div className="ticket-page__panel" style={{ height: "100%" }}>
            <h2 className="ticket-page__panel-title">Ticket Detail</h2>
            <TicketDetail ticketId={selectedTicketId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketPage;