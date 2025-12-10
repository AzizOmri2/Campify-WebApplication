import { useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus } from "lucide-react";
import "./InviteUserModal.css";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
    setRole("User");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="invite-modal-overlay show">
      <div className="invite-modal show">
        <h2>Invite a New User</h2>
        <p>Enter the email and role of the user you want to invite.</p>

        <form onSubmit={handleSubmit} className="invite-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-invite">
              <UserPlus size={18} />
              Invite
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
