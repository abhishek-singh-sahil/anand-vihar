import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { FaTrash, FaEdit, FaUserPlus, FaBan, FaUnlockAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Customers() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Modal control states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  
  // Selected user for editing / blocking
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState("user");
  const [blockDuration, setBlockDuration] = useState("1"); // in hours, "24" = 1 day, "168" = 1 week, "-1" = perm

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/analytics/users?search=${search}`;
      if (roleFilter) {
        url += `&role=${roleFilter}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch user accounts list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formPassword) {
      return toast.error("Please fill all required fields");
    }

    try {
      const res = await api.post("/analytics/users", {
        name: formName,
        email: formEmail,
        password: formPassword,
        phone: formPhone,
        role: formRole
      });

      if (res.data.success) {
        toast.success("User account created successfully!");
        setShowAddModal(false);
        // Reset form
        setFormName("");
        setFormEmail("");
        setFormPassword("");
        setFormPhone("");
        setFormRole("user");
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user account");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await api.put(`/analytics/users/${selectedUser.id || selectedUser._id}`, {
        name: formName,
        email: formEmail,
        phone: formPhone,
        role: formRole
      });

      if (res.data.success) {
        toast.success("User account updated successfully!");
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user details");
    }
  };

  const handleBlockToggle = async () => {
    if (!selectedUser) return;
    const hours = Number(blockDuration);

    try {
      const res = await api.put(`/analytics/users/${selectedUser.id || selectedUser._id}/block`, {
        durationHours: hours
      });

      if (res.data.success) {
        toast.success(res.data.message || "User block state updated successfully");
        setShowBlockModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle block status");
    }
  };

  const handleUnblockUser = async (user) => {
    try {
      const res = await api.put(`/analytics/users/${user.id || user._id}/block`, {
        durationHours: 0
      });
      if (res.data.success) {
        toast.success("User account successfully unblocked!");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleDeleteUser = async (id) => {
    const isSelf = id === currentAdmin?.id || id === currentAdmin?._id;
    if (isSelf) {
      return toast.error("You cannot delete your own account!");
    }

    if (!window.confirm("Are you sure you want to permanently delete this user account? This cannot be undone.")) return;

    try {
      const res = await api.delete(`/analytics/users/${id}`);
      if (res.data.success) {
        toast.success("User account deleted successfully");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone || "");
    setFormRole(user.role);
    setShowEditModal(true);
  };

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setBlockDuration("1");
    setShowBlockModal(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-xs text-gray-400 mt-1">Manage, CRUD, and block user accounts in your system.</p>
        </div>
        <button
          onClick={() => {
            setFormName("");
            setFormEmail("");
            setFormPassword("");
            setFormPhone("");
            setFormRole("user");
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-sm cursor-pointer flex items-center gap-2 border-none shadow-sm transition"
        >
          <FaUserPlus size={14} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <button type="submit" className="absolute right-3 top-3 text-xs text-gray-400 bg-transparent border-none cursor-pointer">
            🔍
          </button>
        </form>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-48 px-3 py-2.5 text-xs rounded-xl border border-gray-200 outline-none cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="user">Users Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      {/* User list table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold animate-pulse">Loading user details...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No accounts found matching your query.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2">Profile Details</th>
                <th className="py-4 px-2">Email Address</th>
                <th className="py-4 px-2">Phone</th>
                <th className="py-4 px-2">Role</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const userId = item.id || item._id;
                const adminId = currentAdmin?.id || currentAdmin?._id;
                const isSelf = (userId && adminId) ? (userId === adminId) : false;
                
                // Block status check
                const isUserBlocked = item.isBlocked;
                const isBlockExpired = item.blockedUntil ? new Date() > new Date(item.blockedUntil) : false;
                const isActiveBlock = isUserBlocked && !isBlockExpired;

                return (
                  <tr key={userId} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center font-bold text-[#ff9248]">
                          {item.profilePic ? (
                            <img src={item.profilePic} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            item.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {isSelf && (
                              <span className="bg-orange-50 text-[#ff9248] text-[9px] font-bold px-1.5 py-0.5 rounded">
                                You
                              </span>
                            )}
                          </h4>
                          <span className="text-[9px] text-gray-400 font-medium">Joined {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-sm text-gray-600 font-medium">{item.email}</td>
                    <td className="py-4 px-2 text-sm text-gray-500 font-medium">{item.phone || "-"}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {isActiveBlock ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                            🔴 Blocked
                          </span>
                          {item.blockedUntil && (
                            <span className="text-[8px] text-red-400 font-medium mt-0.5 max-w-[120px] truncate" title={new Date(item.blockedUntil).toLocaleString()}>
                              Until {new Date(item.blockedUntil).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                          🟢 Active
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        {!isSelf && (
                          <>
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 text-xs bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-[#ff9248] rounded-lg transition cursor-pointer border-none"
                              title="Edit User"
                            >
                              <FaEdit size={12} />
                            </button>
                            {isActiveBlock ? (
                              <button
                                onClick={() => handleUnblockUser(item)}
                                className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition cursor-pointer border-none"
                                title="Unblock User"
                              >
                                <FaUnlockAlt size={12} />
                              </button>
                            ) : (
                              <button
                                onClick={() => openBlockModal(item)}
                                className="p-2 text-xs bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition cursor-pointer border-none"
                                title="Block User"
                              >
                                <FaBan size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(userId)}
                              className="p-2 text-xs bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition cursor-pointer border-none"
                              title="Delete User"
                            >
                              <FaTrash size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= ADD USER MODAL ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaUserPlus className="text-[#013e37]" />
                <span>Create User Account</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-lg font-semibold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Password *</label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Account Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] cursor-pointer"
                >
                  <option value="user">User (Customer)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 font-semibold text-xs cursor-pointer bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#013e37] text-white rounded-xl font-bold text-xs cursor-pointer hover:bg-[#025347] border-none"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT USER MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 animate-scaleIn">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaEdit className="text-[#ff9248]" />
                <span>Edit User Account</span>
              </h3>
              <button 
                onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-lg font-semibold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Account Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] cursor-pointer"
                >
                  <option value="user">User (Customer)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedUser(null); }}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-500 font-semibold text-xs cursor-pointer bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold text-xs cursor-pointer border-none"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BLOCK DURATION MODAL ================= */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 animate-scaleIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <FaExclamationTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Block Account</h3>
              <p className="text-xs text-gray-400 px-4">
                Select block duration for user <b>{selectedUser?.name}</b>. Blocked users cannot log in or make purchases.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Block Duration</label>
                <select
                  value={blockDuration}
                  onChange={(e) => setBlockDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] cursor-pointer"
                >
                  <option value="1">Block for 1 Hour</option>
                  <option value="24">Block for 1 Day</option>
                  <option value="168">Block for 1 Week</option>
                  <option value="-1">Block Permanently</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowBlockModal(false); setSelectedUser(null); }}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 font-semibold text-xs cursor-pointer bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockToggle}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs cursor-pointer border-none"
                >
                  Confirm Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
