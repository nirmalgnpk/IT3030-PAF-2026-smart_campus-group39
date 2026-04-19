import React from "react";
import TicketList from "./TicketList";
import AdminTicketList from "../Admin/AdminTicketList";
import { useAuth } from "../../AuthContext";

function TicketListPage() {
  const { currentUser } = useAuth();
  const isTechnician = currentUser?.role === "TECHNICIAN";

  if (isTechnician) {
    return <AdminTicketList />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>All Tickets</h2>
      <TicketList />
    </div>
  );
}

export default TicketListPage;
