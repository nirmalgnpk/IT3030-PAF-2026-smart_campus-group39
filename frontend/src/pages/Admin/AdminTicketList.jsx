import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTickets, getAssignedTickets } from "../../services/ticketService";
import { FiEye, FiSearch } from "react-icons/fi";
import { useAuth } from "../../AuthContext";

const S = {
    filterBar:    { display: "flex", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" },
    searchWrap:   { position: "relative", flex: "1 1 240px", minWidth: 200 },
    searchInput:  { width: "100%", padding: "9px 12px 9px 34px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" },
    roleFilters:  { display: "flex", gap: 6, flexWrap: "wrap" },
    filterChip:   { padding: "5px 12px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#64748b", fontFamily: "inherit" },
    filterChipActive: { background: "#1e293b", color: "#fff", border: "1.5px solid #1e293b" },
    tableWrap:    { background: "#fff", borderRadius: 14, border: "1px solid #e8edf2", overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
    table:        { width: "100%", borderCollapse: "collapse" },
    th:           { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1.5px solid #f1f5f9", background: "#f8fafc" },
    tr:           { transition: "background 0.1s" },
    td:           { padding: "12px 16px", borderBottom: "1px solid #f1f5f9" },
    actionBtn:    { padding: "5px 7px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1, display: "inline-flex", alignItems: "center" },
    emptyState:   { padding: "3rem", textAlign: "center", color: "#94a3b8", fontSize: 14 },
    badgeDefault: { display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: "1px solid transparent" }
};

const badgeColors = {
    OPEN: { bg: "#ebf8ff", color: "#2b6cb0", borderColor: "#bee3f8" },
    IN_PROGRESS: { bg: "#fffbeb", color: "#7b5e00", borderColor: "#f6e05e" },
    RESOLVED: { bg: "#f0fff4", color: "#276749", borderColor: "#9ae6b4" },
    CLOSED: { bg: "#f7fafc", color: "#4a5568", borderColor: "#cbd5e0" },
    REJECTED: { bg: "#fff5f5", color: "#9b2c2c", borderColor: "#feb2b2" },
};

const prioColors = {
    LOW: { bg: "#f0fff4", color: "#276749", borderColor: "#9ae6b4" },
    MEDIUM: { bg: "#fffbeb", color: "#7b5e00", borderColor: "#f6e05e" },
    HIGH: { bg: "#fff5f5", color: "#9b2c2c", borderColor: "#feb2b2" },
};

function StatusBadge({ type, value }) {
    const theme = (type === "status" ? badgeColors[value] : prioColors[value]) || badgeColors.OPEN;
    return (
        <span style={{ ...S.badgeDefault, background: theme.bg, color: theme.color, borderColor: theme.borderColor }}>
            {value.replace("_", " ")}
        </span>
    );
}

export default function AdminTicketList() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const isTechnician = currentUser?.role === "TECHNICIAN";
    const username = currentUser?.name || currentUser?.userName;

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        try {
            let res;
            if (isTechnician && username) {
                res = await getAssignedTickets(username);
            } else if (isTechnician && !username) {
                res = { data: [] }; // No username = no assigned tickets
            } else {
                res = await getAllTickets();
            }
            setTickets(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = tickets.filter(t => {
        const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase()) || 
            t.assignedTechnician?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div>
            <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
                    {isTechnician ? "My Assigned Tickets" : "Ticket Management"}
                </h2>
            </div>
            
            <div style={S.filterBar}>
                <div style={S.searchWrap}>
                    <FiSearch size={14} color="#94a3b8" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
                    <input style={S.searchInput} placeholder="Search tickets by title, desc, assigned tech..."
                           value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <div style={S.roleFilters}>
                    {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"].map(st => (
                        <button key={st} onClick={() => setStatusFilter(st)}
                                style={{ ...S.filterChip, ...(statusFilter === st ? S.filterChipActive : {}) }}>
                            {st === "ALL" ? "All Tickets" : st.replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            <div style={S.tableWrap}>
                {loading ? (
                    <div style={S.emptyState}>Loading tickets...</div>
                ) : filtered.length === 0 ? (
                    <div style={S.emptyState}>No tickets found</div>
                ) : (
                    <table style={S.table}>
                        <thead>
                            <tr>
                                {["Details", "Category", "Status", "Priority", "Assigned To", "Actions"].map(h => (
                                    <th key={h} style={S.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((t, i) => (
                                <tr key={t.id} style={{ ...S.tr, background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                                    <td style={S.td}>
                                        <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>{t.title}</div>
                                        <div style={{ fontSize: 11, color: "#94a3b8", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 180 }}>
                                            {t.description || "—"}
                                        </div>
                                    </td>
                                    <td style={S.td}><span style={{ fontSize: 13, color: "#475569" }}>{t.category}</span></td>
                                    <td style={S.td}><StatusBadge type="status" value={t.status} /></td>
                                    <td style={S.td}><StatusBadge type="priority" value={t.priority} /></td>
                                    <td style={S.td}>
                                        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
                                            {t.assignedTechnician || "Unassigned"}
                                        </span>
                                    </td>
                                    <td style={S.td}>
                                        <button onClick={() => {
                                            if (window.location.pathname.startsWith('/admin')) {
                                                navigate(`/admin/tickets/${t.id}`);
                                            } else {
                                                navigate(`/tickets/${t.id}`);
                                            }
                                        }} style={{ ...S.actionBtn, color: "#3b82f6" }} title="View Details">
                                            <FiEye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}