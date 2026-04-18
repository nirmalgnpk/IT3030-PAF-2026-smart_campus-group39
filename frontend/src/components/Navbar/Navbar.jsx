import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Smart Campus</h2>

      <ul style={styles.navLinks}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/facilities" style={styles.link}>Resources</Link></li>
        <li>
          <Link to="/bookings" style={styles.navLinkWithIcon}>
            <Calendar size={18} style={styles.icon} />
            Bookings
          </Link>
        </li>
        <li><Link to="/tickets" style={styles.link}>Tickets</Link></li>
        <li><Link to="/notifications" style={styles.link}>Notifications</Link></li>
        <li><Link to="/login" style={styles.link}>Login</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1e293b",
  },
  logo: {
    color: "#fff",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  navLinkWithIcon: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  icon: {
    marginRight: "2px",
  },
};

export default Navbar;