import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

// ─── Reusable labelled-field component ───────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  );
}

function Settings() {
  const { user, settings, changePassword, fetchSettings } = useAuth();

  // ── Password change ──
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  // ── Business settings ──
  const [bizForm, setBizForm] = useState({
    shopName: "",
    phone: "",
    whatsappNumber: "",
    address: "",
    minOrderAmount: "",
    deliveryCharge: "",
    freeDeliveryMinAmount: "",
    orderingEnabled: true,
    reservationsEnabled: false,
    deliverySlots: "",
    homeNotificationText: "",
    homeNotificationEnabled: false
  });
  const [bizLoading, setBizLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setBizForm({
        shopName: settings.shopName || "",
        phone: settings.phone || "",
        whatsappNumber: settings.whatsappNumber || "",
        address: settings.address || "",
        minOrderAmount: settings.minOrderAmount || "",
        deliveryCharge: settings.deliveryCharge || "",
        freeDeliveryMinAmount: settings.freeDeliveryMinAmount || "",
        orderingEnabled: settings.orderingEnabled !== false,
        reservationsEnabled: settings.reservationsEnabled === true,
        deliverySlots: settings.deliverySlots || "",
        homeNotificationText: settings.homeNotificationText || "",
        homeNotificationEnabled: settings.homeNotificationEnabled === true
      });
    }
  }, [settings]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setPwdLoading(true);
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed successfully!");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleBizSubmit = async (e) => {
    e.preventDefault();
    setBizLoading(true);
    try {
      const res = await api.put("/settings", bizForm);
      if (res.data?.success) {
        toast.success("Business settings saved!");
        if (fetchSettings) fetchSettings();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setBizLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]";

  return (
    <div className="max-w-4xl space-y-8 font-sans">
      {/* ─── Business Settings ─── */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">🏪 Business Settings</h3>
          <p className="text-sm text-gray-500 mt-1">Control how your website behaves and appears to customers.</p>
        </div>

        <form onSubmit={handleBizSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Shop / Business Name">
              <input
                type="text"
                value={bizForm.shopName}
                onChange={(e) => setBizForm({ ...bizForm, shopName: e.target.value })}
                placeholder="Anand Vihar Sweet Shop"
                className={inputClass}
              />
            </Field>

            <Field label="Contact Phone">
              <input
                type="text"
                value={bizForm.phone}
                onChange={(e) => setBizForm({ ...bizForm, phone: e.target.value })}
                placeholder="+919934190109"
                className={inputClass}
              />
            </Field>

            <Field label="WhatsApp Number" hint="Used for order confirmations & WhatsApp Checkout">
              <input
                type="text"
                value={bizForm.whatsappNumber}
                onChange={(e) => setBizForm({ ...bizForm, whatsappNumber: e.target.value })}
                placeholder="+919934190109"
                className={inputClass}
              />
            </Field>

            <Field label="Shop Address">
              <input
                type="text"
                value={bizForm.address}
                onChange={(e) => setBizForm({ ...bizForm, address: e.target.value })}
                placeholder="Near Jhanda Chowk, Jhumri Telaiya"
                className={inputClass}
              />
            </Field>

            <Field label="Minimum Order Amount (₹)">
              <input
                type="number"
                value={bizForm.minOrderAmount}
                onChange={(e) => setBizForm({ ...bizForm, minOrderAmount: e.target.value })}
                placeholder="100"
                min={0}
                className={inputClass}
              />
            </Field>

            <Field label="Default Delivery Charge (₹)" hint="Used when no PIN Code zone is configured">
              <input
                type="number"
                value={bizForm.deliveryCharge}
                onChange={(e) => setBizForm({ ...bizForm, deliveryCharge: e.target.value })}
                placeholder="40"
                min={0}
                className={inputClass}
              />
            </Field>

            <Field label="Free Delivery Above (₹)" hint="Orders above this amount get free delivery">
              <input
                type="number"
                value={bizForm.freeDeliveryMinAmount}
                onChange={(e) => setBizForm({ ...bizForm, freeDeliveryMinAmount: e.target.value })}
                placeholder="500"
                min={0}
                className={inputClass}
              />
            </Field>

            <Field label="Delivery Slots" hint="Comma-separated time windows (e.g. 9AM-12PM, 2PM-6PM)">
              <input
                type="text"
                value={bizForm.deliverySlots}
                onChange={(e) => setBizForm({ ...bizForm, deliverySlots: e.target.value })}
                placeholder="9AM-12PM, 12PM-4PM, 4PM-8PM"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <div>
                <p className="font-bold text-gray-800 text-sm">Online Ordering</p>
                <p className="text-xs text-gray-400 mt-0.5">Customers can add items to cart & checkout</p>
              </div>
              <button
                type="button"
                onClick={() => setBizForm({ ...bizForm, orderingEnabled: !bizForm.orderingEnabled })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer border-none ${
                  bizForm.orderingEnabled ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  bizForm.orderingEnabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <div>
                <p className="font-bold text-gray-800 text-sm">Table Reservations</p>
                <p className="text-xs text-gray-400 mt-0.5">Enable dine-in reservation booking</p>
              </div>
              <button
                type="button"
                onClick={() => setBizForm({ ...bizForm, reservationsEnabled: !bizForm.reservationsEnabled })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer border-none ${
                  bizForm.reservationsEnabled ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  bizForm.reservationsEnabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>
          </div>

          {/* Homepage Announcement/Notification Banner */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="font-extrabold text-[#013e37] text-sm uppercase tracking-wider">Announcement / Announcement Banner Settings</h4>
            
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 bg-gray-50">
              <div>
                <p className="font-bold text-gray-800 text-sm">Enable Announcement Banner</p>
                <p className="text-xs text-gray-400 mt-0.5">Toggle display of the notification block below the homepage hero banner</p>
              </div>
              <button
                type="button"
                onClick={() => setBizForm({ ...bizForm, homeNotificationEnabled: !bizForm.homeNotificationEnabled })}
                className={`w-12 h-6 rounded-full transition-all relative cursor-pointer border-none ${
                  bizForm.homeNotificationEnabled ? "bg-[#ff9248]" : "bg-gray-300"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  bizForm.homeNotificationEnabled ? "translate-x-6" : ""
                }`} />
              </button>
            </div>

            <Field label="Announcement Text" hint="The message or alert displayed to customers (will disappear if empty)">
              <textarea
                rows={2}
                value={bizForm.homeNotificationText}
                onChange={(e) => setBizForm({ ...bizForm, homeNotificationText: e.target.value })}
                placeholder="Important Announcement: Enjoy free delivery on all orders above ₹499 this festive season! 🎉"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] font-sans"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={bizLoading}
            className="px-8 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold text-sm cursor-pointer shadow-sm disabled:opacity-50"
          >
            {bizLoading ? "Saving Settings..." : "💾 Save Business Settings"}
          </button>
        </form>
      </div>

      {/* ─── Admin Profile ─── */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">🔐 Admin Account</h3>
          <p className="text-sm text-gray-500 mt-1">Manage admin login credentials.</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <h4 className="font-bold text-sm text-gray-700 uppercase tracking-wider mb-3">Active Profile</h4>
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 font-semibold">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone || "—"}</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 border-t border-gray-100">
          <h4 className="font-bold text-gray-800 text-base">Change Password</h4>

          <Field label="Current Password">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="New Password">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={inputClass}
              />
            </Field>
            <Field label="Confirm New Password">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="px-6 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-bold text-sm cursor-pointer shadow-sm disabled:opacity-50"
          >
            {pwdLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
