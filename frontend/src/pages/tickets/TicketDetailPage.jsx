import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import TicketDetail from "./TicketDetail";
import AdminTicketDetail from "../Admin/AdminTicketDetail";
import { useAuth } from "../../AuthContext";

function TicketDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser } = useAuth();

  const isTechnician = currentUser?.role === "TECHNICIAN";
  const backLink = location.pathname.startsWith('/admin') ? "/admin/tickets/list" : "/tickets";

  if (isTechnician) {
      return (
          <div>
            <AdminTicketDetail overrideBackLink={backLink} />
          </div>
      );
  }

  return (
    <div>
      <Link to={backLink} style={{ display: "inline-block", marginBottom: 16, textDecoration: "none", color: "#3b82f6", fontWeight: "600" }}>
        ← Back
      </Link>
      <TicketDetail ticketId={id} />
    </div>
  );
}

export default TicketDetailPage;
