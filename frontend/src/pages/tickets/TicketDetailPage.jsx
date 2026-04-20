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
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
      <Link to={backLink} style={{ display: "inline-block", marginBottom: 20, textDecoration: "none", color: "#3b82f6", fontWeight: "600", fontSize: "15px", transition: "color 0.2s" }} onMouseOver={(e) => e.target.style.color = "#2563eb"} onMouseOut={(e) => e.target.style.color = "#3b82f6"}>
        ← Back to Tickets
      </Link>
      <TicketDetail ticketId={id} />
    </div>
  );
}

export default TicketDetailPage;
