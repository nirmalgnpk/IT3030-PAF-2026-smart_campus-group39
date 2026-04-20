import React, { useState, useEffect } from "react";
import { createTicket } from "../../services/ticketService";
import { useAuth } from "../../AuthContext";

const styles = `
  .ticket-form-wrapper {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    max-width: 1000px;
    margin: 0 auto;
  }

  .ticket-form-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-top: 0;
    margin-bottom: 24px;
  }

  .ticket-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ticket-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .ticket-form__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ticket-form__label {
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
  }

  .ticket-form__label span {
    color: #ef4444;
    margin-left: 2px;
  }

  .ticket-form__input,
  .ticket-form__select,
  .ticket-form__textarea {
    width: 100%;
    padding: 12px 14px;
    font-size: 14px;
    color: #1f2937;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
  }

  .ticket-form__input:focus,
  .ticket-form__select:focus,
  .ticket-form__textarea:focus {
    border-color: #6366f1;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .ticket-form__input::placeholder,
  .ticket-form__textarea::placeholder {
    color: #9ca3af;
  }

  .ticket-form__textarea {
    resize: vertical;
    min-height: 100px;
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

  .ticket-form__priority-LOW    { color: #065f46; background: #ecfdf5; border-color: #a7f3d0; }
  .ticket-form__priority-MEDIUM { color: #92400e; background: #fffbeb; border-color: #fde68a; }
  .ticket-form__priority-HIGH   { color: #991b1b; background: #fef2f2; border-color: #fecaca; }

  .ticket-form__file-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ticket-form__file-drop {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px dashed #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .ticket-form__file-drop:hover {
    border-color: #6366f1;
    background: #e0e7ff;
  }

  .ticket-form__file-icon {
    font-size: 20px;
    line-height: 1;
  }

  .ticket-form__file-text {
    font-size: 14px;
    color: #6b7280;
  }

  .ticket-form__file-text strong {
    color: #6366f1;
    font-weight: 500;
  }

  .ticket-form__file-input {
    display: none;
  }

  .ticket-form__file-previews {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .ticket-form__file-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: #e0e7ff;
    border: 1px solid #c7d2fe;
    border-radius: 20px;
    font-size: 13px;
    color: #3730a3;
  }

  .ticket-form__file-chip-remove {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-size: 16px;
    color: #818cf8;
    line-height: 1;
    display: flex;
    align-items: center;
  }

  .ticket-form__file-chip-remove:hover {
    color: #ef4444;
  }

  .ticket-form__submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 14px 20px;
    background: #6366f1;
    color: #ffffff;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    margin-top: 10px;
  }

  .ticket-form__submit:hover {
    background: #4f46e5;
  }

  .ticket-form__submit:active {
    transform: scale(0.99);
  }

  .ticket-form__submit:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .ticket-form__error {
    color: #ef4444;
    font-size: 13px;
    margin-top: 4px;
    display: block;
  }

  @media (max-width: 640px) {
    .ticket-form__row {
      grid-template-columns: 1fr;
    }
    .ticket-form-wrapper {
      padding: 20px;
    }
  }
`;

const PRIORITY_CLASSES = {
  LOW: "ticket-form__priority-LOW",
  MEDIUM: "ticket-form__priority-MEDIUM",
  HIGH: "ticket-form__priority-HIGH",
};

function TicketForm() {
  const { currentUser } = useAuth();
  
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "MEDIUM",
    preferredContact: "",
    createdBy: currentUser?.name || currentUser?.userName || "",
  });

  useEffect(() => {
    if (currentUser) {
      setForm(prev => ({
        ...prev,
        createdBy: prev.createdBy || currentUser.name || currentUser.userName || ""
      }));
    }
  }, [currentUser]);

  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // 1. title
    if (!form.title) {
      newErrors.title = "Title is required";
    } else if (form.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (form.title.length > 100) {
      newErrors.title = "Title must be maximum 100 characters";
    }

    // 2. category
    if (!form.category) {
      newErrors.category = "Category is required";
    }

    // 3. description
    if (!form.description) {
      newErrors.description = "Description is required";
    } else if (form.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (form.description.length > 1000) {
      newErrors.description = "Description must be maximum 1000 characters";
    }

    // 4. location
    if (!form.location) {
      newErrors.location = "Location is required";
    }

    // 5. priority
    if (!form.priority) {
      newErrors.priority = "Priority is required";
    }

    // 6. preferredContact
    if (!form.preferredContact) {
      newErrors.preferredContact = "Preferred Contact is required";
    } else {
      const phoneRegex = /^07\d{8}$/; // Sri Lankan phone
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email
      if (!phoneRegex.test(form.preferredContact) && !emailRegex.test(form.preferredContact)) {
        newErrors.preferredContact = "Must be a valid Sri Lankan phone number (07XXXXXXXX) or a valid email format";
      }
    }

    // 7. attachments
    if (files.length > 3) {
      newErrors.files = "Maximum 3 images allowed";
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!allowedTypes.includes(file.type)) {
            newErrors.files = "Only image types (jpg, jpeg, png) are allowed";
            break;
        }
        if (file.size > maxFileSize) {
            newErrors.files = "Each file must be less than 5MB";
            break;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    if (errors.files) {
      setErrors({ ...errors, files: null });
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (errors.files) {
      setErrors({ ...errors, files: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
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
        createdBy: currentUser?.name || currentUser?.userName || "",
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
    <div className="ticket-form-wrapper">
      <style>{styles}</style>
      <h2 className="ticket-form-title">Create Ticket</h2>
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
            />
            {errors.title && <span className="ticket-form__error">{errors.title}</span>}
          </div>
          <div className="ticket-form__field">
            <label className="ticket-form__label">Category <span>*</span></label>
            <input
              className="ticket-form__input"
              name="category"
              placeholder="e.g. Maintenance"
              value={form.category}
              onChange={handleChange}
            />
            {errors.category && <span className="ticket-form__error">{errors.category}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="ticket-form__field">
          <label className="ticket-form__label">Description <span>*</span></label>
          <textarea
            className="ticket-form__textarea"
            name="description"
            placeholder="Describe the issue in detail..."
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && <span className="ticket-form__error">{errors.description}</span>}
        </div>

        {/* Row 2: Location + Priority */}
        <div className="ticket-form__row">
          <div className="ticket-form__field">
            <label className="ticket-form__label">Location <span>*</span></label>
            <input
              className="ticket-form__input"
              name="location"
              placeholder="e.g. Building B, Room 204"
              value={form.location}
              onChange={handleChange}
            />
            {errors.location && <span className="ticket-form__error">{errors.location}</span>}
          </div>
          <div className="ticket-form__field">
            <label className="ticket-form__label">Priority <span>*</span></label>
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
            {errors.priority && <span className="ticket-form__error">{errors.priority}</span>}
          </div>
        </div>

        {/* Row 3: Preferred Contact + Created By */}
        <div className="ticket-form__row">
          <div className="ticket-form__field">
            <label className="ticket-form__label">Preferred Contact <span>*</span></label>
            <input
              className="ticket-form__input"
              name="preferredContact"
              placeholder="e.g. email or phone"
              value={form.preferredContact}
              onChange={handleChange}
            />
            {errors.preferredContact && <span className="ticket-form__error">{errors.preferredContact}</span>}
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
            {errors.files && <span className="ticket-form__error">{errors.files}</span>}
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
    </div>
  );
}

export default TicketForm;