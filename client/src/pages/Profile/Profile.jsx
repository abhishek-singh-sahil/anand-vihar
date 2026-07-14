import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../../services/api";

function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [reservations, setReservations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState("info"); // info, security, reservations

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPreviewUrl(user.profilePic || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/reservations/history");
        if (response.data.success) {
          setReservations(response.data.reservations);
        }
      } catch (error) {
        console.error("Could not load reservation history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };
    
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6 bg-[#FDFCFA]">
      <h1 className="text-4xl font-extrabold text-[#013e37] mb-8 font-sans">User Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 h-fit space-y-2">
          <div className="flex flex-col items-center py-4 border-b border-gray-100 mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-orange-100 shadow-inner mb-3 bg-gray-100 flex items-center justify-center text-3xl text-gray-400 font-bold">
              {previewUrl ? (
                <img src={previewUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0)
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
            <p className="text-sm text-[#ff9248] capitalize font-medium">{user?.role}</p>
          </div>
          
          <button
            onClick={() => setActiveTab("info")}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeTab === "info" ? "bg-orange-50 text-[#ff9248]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            👤 Personal Info
          </button>
          
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeTab === "security" ? "bg-orange-50 text-[#ff9248]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            🔒 Security Settings
          </button>
          
          <button
            onClick={() => setActiveTab("reservations")}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all text-left flex items-center gap-3 cursor-pointer ${
              activeTab === "reservations" ? "bg-orange-50 text-[#ff9248]" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            📅 Bookings History
          </button>
        </div>

        {/* Dynamic Content Pane */}
        <div className="lg:col-span-3">
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
              <form onSubmit={handleUpdateInfo} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Save Profile Info
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold transition-all shadow-sm cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === "reservations" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-md border border-gray-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reservation Bookings</h2>
              
              {loadingHistory ? (
                <div className="text-center py-12 text-gray-500 font-medium">Loading history...</div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-medium">
                  No reservations found matching your email.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-semibold text-sm">
                        <th className="py-4 px-2">Date</th>
                        <th className="py-4 px-2">Time</th>
                        <th className="py-4 px-2">Guests</th>
                        <th className="py-4 px-2">Special Request</th>
                        <th className="py-4 px-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((resv) => (
                        <tr key={resv._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                          <td className="py-4 px-2 font-medium text-gray-800">{resv.date}</td>
                          <td className="py-4 px-2 text-gray-600">{resv.time}</td>
                          <td className="py-4 px-2 text-gray-600">{resv.guests}</td>
                          <td className="py-4 px-2 text-gray-500 text-sm max-w-xs truncate">
                            {resv.specialRequest || "-"}
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                resv.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : resv.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {resv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
