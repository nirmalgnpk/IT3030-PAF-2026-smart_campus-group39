import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

const Home = () => {
    return (
        <div>

            {/* ✅ Navbar */}
            <Navbar />

            {/* Home Content */}
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(to bottom right, #f8fafc, #f1f5f9)",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <h1
                        style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: "#0f172a",
                            marginBottom: "1rem",
                        }}
                    >
                        Smart Campus Management System
                    </h1>

                    <p
                        style={{
                            color: "#475569",
                            marginBottom: "2rem",
                            fontSize: "16px",
                        }}
                    >
                        Navigate to{" "}
                        <code style={{ color: "#2563eb", fontFamily: "monospace" }}>
                            /facilities
                        </code>{" "}
                        to get started
                    </p>

                    <Link
                        to="/facilities"
                        style={{
                            display: "inline-block",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            fontWeight: "600",
                            padding: "0.5rem 1.5rem",
                            borderRadius: "8px",
                            textDecoration: "none",
                        }}
                    >
                        Go to Facilities
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;