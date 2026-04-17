import React, { useState } from "react";
import { createTicket } from "../../services/ticketService";

const styles = `
  .ticket-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ticket-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .ticket-form__field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ticket-form__label {
    font-size: 13px;
    font-weight: 500;
    color: #4a5568;
  }

  .ticket-form__label span {
    color: #e53e3e;
    margin-left: 2px;
  }

  .ticket-form__input,
  .ticket-form__select,
  .ticket-form__textarea {
    width: 100%;
    padding: 9px 12px;
    font-size: 14px;
    color: #1a202c;
    background: #f9fafb;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    box-sizing: border-box;
    font-family: inherit;
  }

  .ticket-form__input:focus,
  .ticket-form__select:focus,
  .ticket-form__textarea:focus {
    border-color: #667eea;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.12);
  }

  .ticket-form__input::placeholder,
  .ticket-form__textarea::placeholder {
    color: #a0aec0;
  }

  .ticket-form__textarea {
    resize: vertical;
    min-height: 90px;
    line-height: 1.5;
  }

  .ticket-form__select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }

  .ticket-form__priority-LOW    { color: #276749; background: #f0fff4; border-color: #9ae6b4; }
  .ticket-form__priority-MEDIUM { color: #7b5e00; background: #fffbeb; border-color: #f6e05e; }
  .ticket-form__priority-HIGH   { color: #9b2c2c; background: #fff5f5; border-color: #feb2b2; }

  .ticket-form__file-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ticket-form__file-drop {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1.5px dashed #cbd5e0;
    border-radius: 8px;
    background: #f9fafb;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }

  .ticket-form__file-drop:hover {
    border-color: #667eea;
    background: #eef2ff;
  }

  .ticket-form__file-icon {
    font-size: 18px;
    line-height: 1;
  }

  .ticket-form__file-text {
    font-size: 13px;
    color: #718096;
  }

  .ticket-form__file-text strong {
    color: #667eea;
    font-weight: 500;
  }

  .ticket-form__file-input {
    display: none;
  }

  .ticket-form__file-previews {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ticket-form__file-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: #eef2ff;
    border: 1px solid #c3dafe;
    border-radius: 20px;
    font-size: 12px;
    color: #434190;
  }

  .ticket-form__file-chip-remove {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    color: #7f9cf5;
    line-height: 1;
    display: flex;
    align-items: center;
  }

  .ticket-form__file-chip-remove:hover {
    color: #e53e3e;
  }

  .ticket-form__divider {
    height: 1px;
    background: #e2e8f0;
    margin: 2px 0;
  }

  .ticket-form__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 20px;
    background: #667eea;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    font-family: inherit;
    letter-spacing: 0.01em;
  }

  .ticket-form__submit:hover {
    background: #5a67d8;
  }

  .ticket-form__submit:active {
    transform: scale(0.98);
  }

  .ticket-form__submit:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 560px) {
    .ticket-form__row {
      grid-template-columns: 1fr;
    }
  }
`;

const PRIORITY_CLASSES = {
  LOW: "ticket-form__priority-LOW",
  MEDIUM: "ticket-form__priority-MEDIUM",
  HIGH: "ticket-form__priority-HIGH",
};

function TicketForm() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "MEDIUM",
    preferredContact: "",
    createdBy: "",
  });

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }
    setFiles(selected);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTicket(form, files);
      alert("Ticket created successfully");
      setForm({
        title: "",
        category: "",
        description: "",
        location: "",
        priority: "MEDIUM",
        preferredContact: "",
        createdBy: "",
      });
      setFiles([]);
    } catch (error) {
      console.error(error);
      alert("Error creating ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <form className="ticket-form" onSubmit={handleSubmit}>

        {/* Row 1: Title + Category */}
        <div className="ticket-form__row">
          <div className="ticket-form__field">
            <label className="ticket-form__label">Title <span>*</span></label>
            <input
              className="ticket-form__input"
              name="title"
              placeholder="e.g. Broken AC unit"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="ticket-form__field">
            <label className="ticket-form__label">Category</label>
            <input
              className="ticket-form__input"
              name="category"
              placeholder="e.g. Maintenance"
              value={form.category}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Description */}
        <div className="ticket-form__field">
          <label className="ticket-form__label">Description</label>
          <textarea
            className="ticket-form__textarea"
            name="description"
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Location + Priority */}
        <div className="ticket-form__row">
          <div className="ticket-form__field">
            <label className="ticket-form__label">Location</label>
            <input
              className="ticket-form__input"
              name="location"
              placeholder="e.g. Building B, Room 204"
              value={form.location}
              onChange={handleChange}
            />
          </div>
          <div className="ticket-form__field">
            <label className="ticket-form__label">Priority</label>
            <select
              className={`ticket-form__select ticket-form__priority-${form.priority}`}
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Row 3: Preferred Contact + Created By */}
        <div className="ticket-form__row">
          <div className="ticket-form__field">
            <label className="ticket-form__label">Preferred Contact</label>
            <input
              className="ticket-form__input"
              name="preferredContact"
              placeholder="e.g. email or phone"
              value={form.preferredContact}
              onChange={handleChange}
            />
          </div>
          <div className="ticket-form__field">
            <label className="ticket-form__label">Created By</label>
            <input
              className="ticket-form__input"
              name="createdBy"
              placeholder="Your name"
              value={form.createdBy}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="ticket-form__field">
          <label className="ticket-form__label">Attachments <span style={{ color: "#a0aec0", fontWeight: 400 }}>(max 3 images)</span></label>
          <div className="ticket-form__file-wrapper">
            <label className="ticket-form__file-drop">
              <span className="ticket-form__file-icon">📎</span>
              <span className="ticket-form__file-text">
                <strong>Click to upload</strong> or drag &amp; drop — PNG, JPG, GIF
              </span>
              <input
                className="ticket-form__file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            {files.length > 0 && (
              <div className="ticket-form__file-previews">
                {files.map((file, i) => (
                  <div key={i} className="ticket-form__file-chip">
                    {file.name}
                    <button
                      type="button"
                      className="ticket-form__file-chip-remove"
                      onClick={() => removeFile(i)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ticket-form__divider" />

        <button className="ticket-form__submit" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Create Ticket"}
        </button>
      </form>
    </>
  );
}

export default TicketForm;