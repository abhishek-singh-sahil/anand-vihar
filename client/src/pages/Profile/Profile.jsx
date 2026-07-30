import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { FaStar } from "react-icons/fa";

// ─── Star Rating Widget ─────────────────────────────────────────────────────
function StarRating({ value, onChange, readonly = false, size = "text-xl" }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${size} cursor-pointer bg-transparent border-none p-0.5 leading-none transition-transform duration-100 active:scale-90 ${
            readonly ? "cursor-default" : ""
          }`}
        >
          <FaStar
            className={`transition-colors ${
              (hovered || value) >= star ? "text-amber-400 fill-amber-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    pending:   { bg: "bg-yellow-100 text-yellow-800", label: "Pending" },
    confirmed: { bg: "bg-blue-100 text-blue-800",     label: "Confirmed" },
    preparing: { bg: "bg-orange-100 text-orange-800", label: "Preparing" },
    out_for_delivery: { bg: "bg-purple-100 text-purple-800", label: "Out for Delivery" },
    delivered: { bg: "bg-green-100 text-green-800",   label: "✓ Delivered" },
    cancelled: { bg: "bg-red-100 text-red-800",       label: "Cancelled" }
  };
  const style = map[status] || { bg: "bg-gray-100 text-gray-600", label: status };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${style.bg}`}>
      {style.label}
    </span>
  );
}

// ─── Review Modal ────────────────────────────────────────────────────────────
function ReviewModal({ order, onClose, onReviewed }) {
  const items = order.items || [];
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [eligibility, setEligibility] = useState({});

  useEffect(() => {
    const checkAllEligibility = async () => {
      const statuses = {};
      for (const item of items) {
        try {
          const res = await api.get(`/reviews/check-eligibility/${item.productId}`);
          statuses[item.productId] = {
            eligible: res.data.eligible,
            message: res.data.message
          };
        } catch (err) {
          statuses[item.productId] = {
            eligible: false,
            message: "Error checking review eligibility status"
          };
        }
      }
      setEligibility(statuses);
    };
    checkAllEligibility();
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    let successCount = 0;
    for (const item of items) {
      // Skip if not eligible
      if (eligibility[item.productId]?.eligible === false) continue;

      const rating = ratings[item.productId];
      const comment = comments[item.productId];
      if (!rating || !comment?.trim()) continue;
      try {
        await api.post(`/reviews/product/${item.productId}`, { rating, comment });
        successCount++;
      } catch (err) {
        toast.error(err.response?.data?.message || `Review failed for ${item.name}`);
      }
    }
    setSubmitting(false);
    if (successCount > 0) {
      toast.success(`${successCount} review${successCount > 1 ? "s" : ""} submitted! Thank you 🎉`);
      onReviewed();
    } else {
      toast.error("Please fill rating & comment for at least one eligible item");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">⭐ Rate Your Order</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order #{order.orderNumber} · Delivered</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {items.map((item) => {
            const status = eligibility[item.productId];
            const isEligible = status === undefined ? true : status.eligible; // default to true during loading

            return (
              <div key={item.id || item.productId} className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  )}
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                    {item.weight && <p className="text-xs text-gray-400">{item.weight}</p>}
                  </div>
                </div>

                {status !== undefined && !status.eligible ? (
                  <div className="bg-orange-50 border border-orange-100 text-orange-800 text-xs rounded-xl p-3 font-medium">
                    ⚠️ {status.message}
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Your Rating</p>
                      <StarRating
                        value={ratings[item.productId] || 0}
                        onChange={(val) => setRatings((prev) => ({ ...prev, [item.productId]: val }))}
                        size="text-2xl"
                        readonly={!isEligible}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Review</label>
                      <textarea
                        rows={2}
                        disabled={!isEligible}
                        value={comments[item.productId] || ""}
                        onChange={(e) => setComments((prev) => ({ ...prev, [item.productId]: e.target.value }))}
                        placeholder="Share your experience with this product..."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff9248] resize-none disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-500 font-semibold text-sm cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Reviews"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Address Card ────────────────────────────────────────────────────────────
function AddressCard({ addr, onDelete, onSetDefault }) {
  return (
    <div className={`rounded-2xl border p-4 space-y-2 relative transition ${addr.isDefault ? "border-[#ff9248] bg-orange-50" : "border-gray-200 bg-white"}`}>
      {addr.isDefault && (
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#ff9248] text-white px-2 py-0.5 rounded-full">Default</span>
      )}
      <div className="flex items-start gap-2">
        <span className="text-lg">🏠</span>
        <div>
          <p className="font-bold text-gray-800 text-sm">{addr.houseNumber}, {addr.street}</p>
          {addr.landmark && <p className="text-xs text-gray-500">{addr.landmark}</p>}
          <p className="text-sm text-gray-600">{addr.city}, {addr.state} — <span className="font-mono font-bold">{addr.pinCode}</span></p>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        {!addr.isDefault && (
          <button
            onClick={() => onSetDefault(addr.id)}
            className="text-xs font-bold text-[#ff9248] px-3 py-1 bg-orange-50 rounded-lg cursor-pointer border border-orange-200 hover:bg-orange-100 transition"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onDelete(addr.id)}
          className="text-xs font-bold text-red-500 px-3 py-1 bg-red-50 rounded-lg cursor-pointer border-none hover:bg-red-100 transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── Main Profile Page ───────────────────────────────────────────────────────
function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeTab, setActiveTab] = useState("info");

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reviewModalOrder, setReviewModalOrder] = useState(null);

  // Addresses state
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [newAddr, setNewAddr] = useState({ houseNumber: "", street: "", landmark: "", city: "", state: "", pinCode: "" });
  const [showAddrForm, setShowAddrForm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setPreviewUrl(user.profilePic || "");
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "orders" && user) fetchOrders();
    if (activeTab === "addresses" && user) fetchAddresses();
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get("/orders/my-orders");
      if (res.data?.success) setOrders(res.data.orders);
    } catch { toast.error("Failed to load orders"); }
    finally { setOrdersLoading(false); }
  };

  const fetchAddresses = async () => {
    setAddrLoading(true);
    try {
      const res = await api.get("/address");
      if (res.data?.success) setAddresses(res.data.addresses || []);
    } catch { toast.error("Failed to load addresses"); }
    finally { setAddrLoading(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.houseNumber || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.pinCode) {
      toast.error("Please fill all required address fields");
      return;
    }
    try {
      const res = await api.post("/address", newAddr);
      if (res.data?.success) {
        toast.success("Address saved!");
        setNewAddr({ houseNumber: "", street: "", landmark: "", city: "", state: "", pinCode: "" });
        setShowAddrForm(false);
        fetchAddresses();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to add address"); }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await api.delete(`/address/${id}`);
      toast.success("Address removed");
      fetchAddresses();
    } catch { toast.error("Delete failed"); }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/address/${id}/default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch { toast.error("Failed to set default"); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setProfilePic(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    if (profilePic) formData.append("profilePic", profilePic);
    try {
      const res = await updateProfile(formData);
      if (res.success) toast.success("Profile updated!");
    } catch (err) { toast.error(err.message || "Failed to update"); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      const res = await changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success("Password changed!");
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      }
    } catch (err) { toast.error(err.message || "Failed"); }
  };

  const tabs = [
    { id: "info",      label: "👤 Personal Info" },
    { id: "orders",    label: "📦 My Orders" },
    { id: "addresses", label: "🏠 Saved Addresses" },
    { id: "security",  label: "🔒 Security" },
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all text-sm";

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#013e37] mb-8 font-sans">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-2">
          {/* Avatar */}
          <div className="flex flex-col items-center py-4 border-b border-gray-100 mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-100 bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400 mb-3">
              {previewUrl ? <img src={previewUrl} alt={name} className="w-full h-full object-cover" /> : (name.charAt(0) || "?")}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{user?.name}</h3>
            <p className="text-xs text-[#ff9248] font-semibold capitalize">{user?.role}</p>
          </div>

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all text-left flex items-center gap-2 cursor-pointer border-none ${
                activeTab === tab.id ? "bg-orange-50 text-[#ff9248]" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">

            {/* ── Personal Info ── */}
            {activeTab === "info" && (
              <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
                <form onSubmit={handleUpdateInfo} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email (Read-only)</label>
                    <input type="email" value={user?.email || ""} disabled className={inputClass + " bg-gray-50 text-gray-400"} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Profile Photo</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100" />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Orders ── */}
            {activeTab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders</h2>
                  {ordersLoading ? (
                    <div className="text-center py-10 text-gray-400">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <p className="text-4xl mb-3">🛍️</p>
                      <p className="font-semibold">No orders yet. Start shopping!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-2xl p-5 space-y-4 hover:border-orange-200 transition">
                          {/* Order Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-extrabold text-gray-800 text-base">#{order.orderNumber}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <StatusBadge status={order.status} />
                              <span className="font-extrabold text-[#013e37]">₹{order.grandTotal}</span>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="divide-y divide-gray-50">
                            {(order.items || []).map((item) => (
                              <div key={item.id} className="flex items-center gap-3 py-2">
                                {item.image && (
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                                  <p className="text-xs text-gray-400">{item.weight && `${item.weight} ·`} Qty: {item.quantity}</p>
                                </div>
                                <span className="text-sm font-bold text-gray-700">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery address */}
                          {order.street && (
                            <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 font-medium">
                              📍 {order.houseNumber}, {order.street}, {order.city} — {order.pinCode}
                            </div>
                          )}

                          {/* Review CTA for delivered orders */}
                          {order.status === "delivered" && (
                            <button
                              onClick={() => setReviewModalOrder(order)}
                              className="w-full py-2.5 border border-orange-200 text-[#ff9248] text-sm font-bold rounded-xl cursor-pointer bg-orange-50 hover:bg-orange-100 transition"
                            >
                              ⭐ Rate & Review Products
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Addresses ── */}
            {activeTab === "addresses" && (
              <motion.div key="addresses" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Saved Addresses</h2>
                  <button
                    onClick={() => setShowAddrForm(!showAddrForm)}
                    className="px-4 py-2 bg-[#013e37] text-white text-sm font-bold rounded-xl cursor-pointer border-none hover:bg-[#025347] transition"
                  >
                    {showAddrForm ? "✕ Cancel" : "+ Add Address"}
                  </button>
                </div>

                {/* Add Address Form */}
                <AnimatePresence>
                  {showAddrForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddAddress}
                      className="space-y-4 bg-gray-50 rounded-2xl p-5 border border-gray-200 overflow-hidden"
                    >
                      <h4 className="font-bold text-gray-700 text-sm">New Address</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">House / Flat No. *</label>
                          <input required value={newAddr.houseNumber} onChange={(e) => setNewAddr({ ...newAddr, houseNumber: e.target.value })} placeholder="A-12" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street / Area *</label>
                          <input required value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} placeholder="Main Road, Bazaar" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Landmark</label>
                          <input value={newAddr.landmark} onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })} placeholder="Near SBI Bank" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City *</label>
                          <input required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} placeholder="Jhumri Telaiya" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State *</label>
                          <input required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} placeholder="Jharkhand" className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">PIN Code *</label>
                          <input required value={newAddr.pinCode} onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })} placeholder="825409" maxLength={6} className={inputClass} />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold rounded-xl text-sm cursor-pointer">
                        Save Address
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {addrLoading ? (
                  <div className="text-center py-6 text-gray-400">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-4xl mb-2">🏠</p>
                    <p className="font-semibold">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <AddressCard key={addr.id} addr={addr} onDelete={handleDeleteAddress} onSetDefault={handleSetDefault} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Security ── */}
            {activeTab === "security" && (
              <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6"
              >
                <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm Password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
                    </div>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm">
                    Update Password
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalOrder && (
          <ReviewModal
            order={reviewModalOrder}
            onClose={() => setReviewModalOrder(null)}
            onReviewed={() => setReviewModalOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Profile;
