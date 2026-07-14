import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";

function Settings() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Admin password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[700px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-8">
      <div>
        <h3 className="text-xl font-bold text-gray-800">Admin Account Settings</h3>
        <p className="text-sm text-gray-500 mt-1">Configure your login credentials and profile preferences.</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
        <h4 className="font-bold text-sm text-gray-700 uppercase tracking-wider">Active Profile Info</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 font-semibold">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone || "-"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-100">
        <h4 className="font-bold text-gray-800 text-base mb-2">Change Password</h4>
        
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold text-sm cursor-pointer shadow-sm disabled:opacity-50 mt-4"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

export default Settings;
