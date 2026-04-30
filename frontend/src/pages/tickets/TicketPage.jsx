import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../AuthContext";

const styles = `
  .ticket-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #F7F8FC;
    font-family: inherit;
    box-sizing: border-box;
  }

  .ticket-page__content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ticket-page__tabs {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .ticket-page__tab {
    border: 1px solid #cbd5e0;
    border-radius: 8px;
    background: #ffffff;
    color: #334155;
    text-decoration: none;
    padding: 8px 14px;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.15s ease;
  }

  .ticket-page__tab:hover {
    border-color: #667eea;
    color: #4c51bf;
  }

  .ticket-page__tab--active {
    background: #667eea;
    border-color: #667eea;
    color: #ffffff;
  }

  .ticket-page__panel {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 768px) {
    .ticket-page__content {
      padding: 16px;
    }
  }
`;

function TicketPage() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const basePath = location.pathname.startsWith('/admin') ? '/admin/tickets' : '/tickets';

  return (
    <>
      <style>{styles}</style>
      <div className="ticket-page">
        <Navbar />

        <div className="ticket-page__content">
          <div className="ticket-page__tabs">
            <NavLink
              to={`${basePath}/list`}
              className={({ isActive }) =>
                `ticket-page__tab ${isActive ? "ticket-page__tab--active" : ""}`
              }
            >
              Ticket List
            </NavLink>
            <NavLink
              to={`${basePath}/new`}
              className={({ isActive }) =>
                `ticket-page__tab ${isActive ? "ticket-page__tab--active" : ""}`
              }
            >
              New Ticket
            </NavLink>
          </div>

          <div className="ticket-page__panel">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default TicketPage;