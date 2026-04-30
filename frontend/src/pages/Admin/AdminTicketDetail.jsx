import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, assignTechnician, updateTicketStatus, addTechnicianUpdate } from "../../services/ticketService";
import { useAuth } from "../../AuthContext";
import { FiArrowLeft, FiSave, FiUserCheck, FiMessageSquare } from "react-icons/fi";
import api from "../../api";

const S = {
    page: { display: "flex", flexDirection: "column", gap: "1.5rem" },
    grid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" },
    card: { background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid #e8edf2", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
    cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" },
    field: { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", margin: "1rem 0 0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" },
    input: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f8fafc" },
    textarea: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", fontFamily: "inherit", boxSizing: "border-box", background: "#f8fafc", resize: "vertical", minHeight: 80 },
    btn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "background 0.15s" },
    btnSecondary: { padding: "8px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
    badge: { display: "inline-flex", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: "1.5px solid #e2e8f0", background: "#fff", color: "#334155" },
    imageGrid: { display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" },
    image: { width: 140, height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #e2e8f0" },
    updateBubble: { background: "#f8fafc", padding: "12px 14px", borderRadius: 10, marginBottom: "0.85rem", border: "1px solid #f1f5f9" },
    updateAuthor: { fontSize: 12, fontWeight: 700, color: "#0f172a", display: "flex", justifyContent: "space-between", marginBottom: 4 },
    updateText: { fontSize: 13, color: "#475569", lineHeight: 1.5, margin: 0 }
};

export default function AdminTicketDetail({ overrideBackLink }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [techName, setTechName] = useState("");
    const [technicians, setTechnicians] = useState([]);
    const [status, setStatus] = useState("");
    const [resolutionNote, setResolutionNote] = useState("");
    const [updateMsg, setUpdateMsg] = useState("");
    
    const isAdmin = currentUser?.role === "ADMIN";
    const isTechnician = currentUser?.role === "TECHNICIAN";

    const fetchTechnicians = async () => {
        try {
            const res = await api.get('/api/users');
            const techs = res.data.filter(u => u.role === "TECHNICIAN");
            setTechnicians(techs);
        } catch(err) {
            console.error("Failed to load technicians", err);
        }
    };

    const loadTicket = async () => {
        try {
            const res = await getTicketById(id);
            setTicket(res.data);
            setStatus(res.data.status);
            if (res.data.assignedTechnician) {
                setTechName(res.data.assignedTechnician);
            }
        } catch (err) {
            console.error("Failed to load ticket", err);
        }
    };

    useEffect(() => { 
        loadTicket(); 
        fetchTechnicians();
    }, [id]);

    const handleAssign = async () => {
        if (!techName) return alert("Technician name needed");
        try {
            await assignTechnician(id, techName);
            loadTicket();
            alert("Technician assigned successfully!");
        } catch (err) {
            alert("Failed to assign technician.");
            console.error(err);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await updateTicketStatus(id, status, resolutionNote);
            loadTicket();
            alert("Ticket status updated successfully!");
        } catch (err) {
            alert("Failed to update status.");
            console.error(err);
        }
    };

    const handleAddUpdate = async () => {
        if (!updateMsg) return;
        try {
            await addTechnicianUpdate(id, updateMsg, currentUser?.name || currentUser?.userName || "Admin");
            setUpdateMsg("");
            loadTicket();
            alert("Update note added successfully!");
        } catch (err) {
            alert("Failed to add note.");
            console.error(err);
        }
    };

    if (!ticket) return <div style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>Loading...</div>;

    const backUrl = overrideBackLink || "/admin/tickets/list";

    return (
        <div style={S.page}>
            <div>
                <button onClick={() => navigate(backUrl)} style={S.btnSecondary}>
                    <FiArrowLeft size={16} /> Back to Tickets
                </button>
            </div>

            <div style={S.grid}>
                {/* Main Overview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={S.card}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: "1rem" }}>{ticket.title}</h2>
                        
                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                            <span style={S.badge}>Status: {ticket.status}</span>
                            <span style={S.badge}>Priority: {ticket.priority}</span>
                            <span style={S.badge}>Category: {ticket.category || "N/A"}</span>
                            <span style={S.badge}>Location: {ticket.location || "N/A"}</span>
                        </div>

                        <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, background: "#f8fafc", padding: "1rem", borderRadius: 8 }}>
                            {ticket.description}
                        </p>

                        {ticket.attachments?.length > 0 && (
                            <>
                                <h3 style={{ ...S.field, marginTop: "1.5rem" }}>Attachments</h3>
                                <div style={S.imageGrid}>
                                    {ticket.attachments.map(att => (
                                        <a href={`http://localhost:8081/${att.filePath.replace("\\", "/")}`} target="_blank" rel="noreferrer" key={att.id}>
                                            <img src={`http://localhost:8081/${att.filePath.replace("\\", "/")}`} alt={att.fileName} style={S.image} />
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Technician Updates Timeline */}
                    <div style={S.card}>
                        <h3 style={S.cardTitle}><FiMessageSquare color="#3b82f6" /> Activity & Updates</h3>
                        
                        <div style={{ marginBottom: "1.5rem" }}>
                            {ticket.updates?.length > 0 ? ticket.updates.map(u => (
                                <div key={u.id} style={S.updateBubble}>
                                    <div style={S.updateAuthor}>
                                        <span>{u.updatedBy}</span>
                                        <span style={{ color: "#94a3b8", fontWeight: 500 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</span>
                                    </div>
                                    <p style={S.updateText}>{u.message}</p>
                                </div>
                            )) : (
                                <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>No updates recorded yet.</div>
                            )}
                        </div>

                        <div>
                            <label style={S.field}>Post New Update</label>
                            <textarea style={S.textarea} placeholder="Write a response or update note..." value={updateMsg} onChange={e => setUpdateMsg(e.target.value)} />
                            <button onClick={handleAddUpdate} style={{ ...S.btn, marginTop: "0.75rem" }}>Add Note</button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* Status Mod - Technician Only */}
                    {isTechnician && (
                        <div style={S.card}>
                            <h3 style={S.cardTitle}><FiSave color="#10b981" /> Manage Status</h3>
                            
                            <label style={S.field}>Status</label>
                            <select style={S.input} value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="OPEN">OPEN</option>
                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                <option value="RESOLVED">RESOLVED</option>
                                <option value="CLOSED">CLOSED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>

                            <label style={S.field}>Resolution Note (Optional)</label>
                            <textarea style={{ ...S.textarea, minHeight: 60 }} placeholder="Public note on resolution..." value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} />
                            
                            <button onClick={handleStatusUpdate} style={{ ...S.btn, background: "#10b981", width: "100%", marginTop: "1rem", justifyContent: "center" }}>
                                Update Ticket
                            </button>
                        </div>
                    )}

                    {/* Assigner */}
                    {isAdmin && (
                        <div style={S.card}>
                            <h3 style={S.cardTitle}><FiUserCheck color="#8b5cf6" /> Re-assign</h3>
                            
                            <label style={S.field}>Assign Technician</label>
                            <select style={S.input} value={techName} onChange={e => setTechName(e.target.value)}>
                                <option value="">-- Select Technician --</option>
                                {technicians.map(t => (
                                    <option key={t.id} value={t.name || t.userName}>{t.name || t.userName}</option>
                                ))}
                            </select>
                            
                            <button onClick={handleAssign} style={{ ...S.btn, background: "#8b5cf6", width: "100%", marginTop: "1rem", justifyContent: "center" }}>
                                Assign
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}