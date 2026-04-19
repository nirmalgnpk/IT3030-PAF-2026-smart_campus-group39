import React from "react";
import { Link, useParams } from "react-router-dom";
import TicketDetail from "./TicketDetail";

function TicketDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <Link to="/tickets/list" style={{ display: "inline-block", marginBottom: 16 }}>
        Back to ticket list
      </Link>
      <h2 style={{ marginBottom: 16 }}>Ticket Detail</h2>
      <TicketDetail ticketId={id} />
    </div>
  );
}

export default TicketDetailPage;
