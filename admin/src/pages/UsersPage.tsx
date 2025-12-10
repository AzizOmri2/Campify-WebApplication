import { Search, UserPlus, Mail, Eye, UserX, Trash2 } from "lucide-react";
import "@/styles/pages.css";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useOutletContext } from "react-router-dom";
import { createPortal } from "react-dom";
import InviteUserModal from "@/components/InviteUserModal";

const roleBadgeClass: Record<string, string> = {
  Admin: "badge-accent",
  User: "badge-blue",
};

export default function UsersPage() {

  const { users, loadingUsers, fetchUsersForAdmin, deleteUser, banUser, unbanUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { openShowUserModal } = useOutletContext<{ openShowUserModal: (user: any) => void }>();

  // For delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // Delete modal animation state
  const [deleteModalAnimation, setDeleteModalAnimation] = useState({
    show: false,
    isClosing: false
  });

  // For Invite User modal
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchUsersForAdmin();
  }, []);

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = async () => {
    if (!selectedUserId) return;
    await deleteUser(selectedUserId);
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const cancelDelete = () => {
    setDeleteModalAnimation({ show: true, isClosing: true });

    setTimeout(() => {
      setShowDeleteModal(false);
      setSelectedUserId(null);
      setDeleteModalAnimation({ show: false, isClosing: false });
    }, 300);
  };

  const handleDeleteClick = (userId: string) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);

    // trigger fade-in after modal is in the DOM
    setTimeout(() => {
      setDeleteModalAnimation({ show: true, isClosing: false });
    }, 10);
  };

  return (
    <div className="page-enter space-y-6">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage team members and permissions.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowInviteModal(true)}>
            <UserPlus />
            Invite User
          </button>
        </div>
      </div>

      <div className="card">
        <div className="search-wrapper mb-6">
          <Search className="search-icon" />
          <input type="text" placeholder="Search users..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

        {loadingUsers ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
            <p className="loading-text">Loading users...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <UserX className="empty-icon" size={48} />
                <p className="empty-title">No users found</p>
                <p className="empty-subtitle">No users found in the system.</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.email} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar">{user.full_name.charAt(0)}</div>
                    <div>
                      <p className="user-name">{user.full_name}</p>
                      <p className="user-email">
                        <Mail />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="user-meta">
                    <span className={`badge ${roleBadgeClass[user.role]}`}>
                      {user.role}
                    </span>
                    <span className={`user-status ${user.status === "Active" ? "active" : "inactive"}`}>
                      <span className="user-status-dot" />
                      {user.status}
                    </span>
                    <div className="action-buttons flex gap-2">
                      <button className="icon-btn show" title="Show" onClick={() => openShowUserModal(user)}>
                        <Eye size={16} />
                      </button>

                      <button className="icon-btn remove" title="Remove" onClick={() => handleDeleteClick(user.id)}>
                        <Trash2 size={16} />
                      </button>

                      {user.status === "Active" ? (
                        <button className="icon-btn ban" title="Ban" onClick={() => banUser(user.id)}>
                          <UserX size={16} />
                        </button>
                      ) : (
                        <button className="icon-btn unban" title="Unban" onClick={() => unbanUser(user.id)}>
                          <UserPlus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        createPortal(
          <div className={`modal-overlay ${deleteModalAnimation.show ? "show" : ""} ${deleteModalAnimation.isClosing ? "closing" : ""}`}>
            <div className={`modal ${deleteModalAnimation.show ? "show" : ""} ${deleteModalAnimation.isClosing ? "closing" : ""}`}>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this user?</p>

              <div className="modal-actions">
                <button className="btn btn-delete-confirm" onClick={confirmDelete}>
                  <Trash2 className="delete-icon" size={18} />
                  Delete
                </button>
                <button className="btn btn-cancel" onClick={cancelDelete}>
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
    </div>
  );
}