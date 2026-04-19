import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const styles = `
  .ticket-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    min-height: 100vh;
    background-color: #f5f7fa;
    font-family: "Inter", "Segoe UI", sans-serif;
    box-sizing: border-box;
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
      padding: 16px;
    }
  }
`;

function TicketPage() {
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin/tickets' : '/tickets';

  return (
    <>
      <style>{styles}</style>
      <div className="ticket-page">
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
    </>
  );
}

export default TicketPage;