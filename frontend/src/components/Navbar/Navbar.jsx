import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export default function Navbar() {
  const styles = {
    nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1e293b",
      color: "white",
      fontFamily: "inherit",
    },
    logo: {
      fontSize: "1.5rem",
      fontWeight: "700",
      textDecoration: "none",
      color: "white",
    },
    links: {
      display: "flex",
      gap: "2rem",
      listStyle: "none",
      margin: 0,
      padding: 0,
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      textDecoration: "none",
      color: "white",
      transition: "opacity 0.3s",
      cursor: "pointer",
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        Smart Campus
      </Link>
      <ul style={styles.links}>
        <li>
          <Link to="/" style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/facilities" style={styles.link}>
            Resources
          </Link>
        </li>
        <li>
          <Link to="/bookings" style={styles.link}>
            <Calendar size={20} />
            Bookings
          </Link>
        </li>
        <li>
          <Link to="/tickets" style={styles.link}>
            Tickets
          </Link>
        </li>
        <li>
          <Link to="/notifications" style={styles.link}>
            Notifications
          </Link>
        </li>
        <li>
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

import React from " react\;
import { Link } from \react-router-dom\;
import { Calendar } from \lucide-react\;

export default function Navbar() {
 const styles = {
 nav: {
 display: \flex\,
 justifyContent: \space-between\,
 alignItems: \center\,
 padding: \1rem 2rem\,
 backgroundColor: \#1e293b\,
 color: \white\,
 fontFamily: \inherit\,
 },
 logo: {
 fontSize: \1.5rem\,
 fontWeight: \700\,
 textDecoration: \none\,
 color: \white\,
 },
 links: {
 display: \flex\,
 gap: \2rem\,
 listStyle: \none\,
 margin: 0,
 padding: 0,
 },
 link: {
 display: \flex\,
 alignItems: \center\,
 gap: \0.5rem\,
 textDecoration: \none\,
 color: \white\,
 transition: \opacity 0.3s\,
 cursor: \pointer\,
 },
 };

 return (
 <nav style={styles.nav}>
 <Link to=\/\ style={styles.logo}>
 Smart Campus
 </Link>
 <ul style={styles.links}>
 <li>
 <Link to=\/\ style={styles.link}>
 Home
 </Link>
 </li>
 <li>
 <Link to=\/facilities\ style={styles.link}>
 Resources
 </Link>
 </li>
 <li>
 <Link to=\/bookings\ style={styles.link}>
 <Calendar size={20} />
 Bookings
 </Link>
 </li>
 <li>
 <Link to=\/tickets\ style={styles.link}>
 Tickets
 </Link>
 </li>
 <li>
 <Link to=\/notifications\ style={styles.link}>
 Notifications
 </Link>
 </li>
 <li>
 <Link to=\/login\ style={styles.link}>
 Login
 </Link>
 </li>
 </ul>
 </nav>
 );
}
