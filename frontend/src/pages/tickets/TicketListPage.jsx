import React from "react";
import TicketList from "./TicketList";

function TicketListPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>All Tickets</h2>
      <TicketList />
    </div>
  );
}

export default TicketListPage;
