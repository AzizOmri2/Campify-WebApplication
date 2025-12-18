import { useState } from "react";
import { createPortal } from "react-dom";
import { UserPlus } from "lucide-react";
import "./InviteUserModal.css";
import { useUser } from "@/contexts/UserContext";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);

  const { inviteUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await inviteUser(email, role); // notifications handled in UserContext
      setEmail("");
      setRole("User");
      onClose();
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-invite" disabled={loading}>
              <UserPlus size={18} />
              {loading ? "Inviting..." : "Invite"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}