import React, { useEffect } from "react";
import { FaBan, FaTrash } from "react-icons/fa";
import "./ShowUserModal.css";

interface ShowUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: {
    full_name: string;
    email: string;
    role: string;
    status: string;
    joined: string;
    avatar?: string;
  } | null;
}

const ShowUserModal: React.FC<ShowUserModalProps> = ({ isOpen, onClose, user }) => {
  // Prevent background scrolling & handle Escape key
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className="sum-modal-overlay" onClick={onClose}>
      <div className="sum-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="sum-modal-close" onClick={onClose} title="Close">&times;</button>

        <div className="sum-modal-user-wrapper">
          {/* Left: User Info */}
          <div className="user-info-left">
            <h2>{user.full_name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Role:</strong>{" "}
              <span className={`badge role-${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge status-${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </p>
            <p><strong>Joined On:</strong> {new Date(user.joined).toLocaleDateString()}</p>
          </div>

          {/* Right: Profile Picture */}
          <div className="user-info-right">
            <img src={
              user.avatar || 
              "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2210.jpg?semt=ais_hybrid&w=740&q=80"} alt="Profile" />
          </div>
        </div>

        {/* Footer with actions */}
        <div className="sum-modal-footer">
          <button className="footer-btn footer-ban" title="Ban User">
            <FaBan className="footer-icon" />
          </button>

          <button className="footer-btn footer-delete" title="Delete User">
            <FaTrash className="footer-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowUserModal;
