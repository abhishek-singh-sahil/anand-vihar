import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";

function Customers() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

  const handleToggleRole = async (id, currentRole) => {
    const nextRole = currentRole === "admin" ? "user" : "admin";
    if (id === currentAdmin?.id || id === currentAdmin?._id) {
      return toast.error("You cannot change your own role!");
    }
    
    if (!window.confirm(`Change user's role to ${nextRole}?`)) return;

    try {
      const res = await api.put(`/analytics/users/${id}/role`, { role: nextRole });
      if (res.data.success) {
        toast.success("Role updated successfully!");
        fetchUsers();
      }
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === currentAdmin?.id || id === currentAdmin?._id) {
      return toast.error("You cannot delete your own account!");
    }

    if (!window.confirm("Are you sure you want to permanently delete this user account?")) return;

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

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management Panel</h2>
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
          <button type="submit" className="absolute right-3 top-3 text-xs text-gray-400">
            🔍
          </button>
        </form>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-48 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* User list */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading user details...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No accounts found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2">Profile</th>
                <th className="py-4 px-2">Email</th>
                <th className="py-4 px-2">Phone</th>
                <th className="py-4 px-2">Role</th>
                <th className="py-4 px-2">Verified</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => {
                const isSelf = item._id === currentAdmin?.id || item._id === currentAdmin?._id;
                return (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
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
                      <span className={`text-[10px] font-bold ${item.isVerified ? "text-green-700" : "text-red-500"}`}>
                        {item.isVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        {!isSelf && (
                          <>
                            <button
                              onClick={() => handleToggleRole(item._id, item.role)}
                              className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#ff9248] font-bold rounded-lg transition cursor-pointer"
                            >
                              Toggle Role
                            </button>
                            <button
                              onClick={() => handleDeleteUser(item._id)}
                              className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-lg transition cursor-pointer"
                            >
                              Delete
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
    </div>
  );
}

export default Customers;
