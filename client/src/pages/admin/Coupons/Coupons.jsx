import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const DISCOUNT_TYPES = ["PERCENTAGE", "FLAT"];

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
    usageLimit: "",
    active: true
  };
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/coupons");
      if (res.data?.success) setCoupons(res.data.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue || !form.expiryDate) {
      toast.error("Code, discount value and expiry date are required");
      return;
    }
    setFormLoading(true);
    try {
      if (editingId) {
        const res = await api.put(`/coupons/${editingId}`, form);
        if (res.data?.success) {
          toast.success("Coupon updated!");
          setEditingId(null);
          setForm(emptyForm);
          fetchCoupons();
        }
      } else {
        const res = await api.post("/coupons", form);
        if (res.data?.success) {
          toast.success("Coupon created!");
          setForm(emptyForm);
          fetchCoupons();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
      usageLimit: coupon.usageLimit || "",
      active: coupon.active
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = async (coupon) => {
    try {
      const res = await api.put(`/coupons/${coupon.id}`, { active: !coupon.active });
      if (res.data?.success) {
        toast.success(`Coupon ${coupon.active ? "deactivated" : "activated"}`);
        fetchCoupons();
      }
    } catch { toast.error("Toggle failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon permanently?")) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data?.success) { toast.success("Coupon deleted"); fetchCoupons(); }
    } catch { toast.error("Delete failed"); }
  };

  const isExpired = (date) => new Date(date) < new Date();

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]";

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">🎟 Coupons Manager</h2>
          <p className="text-sm text-gray-500 mt-1">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total</p>
        </div>
        {editingId && (
          <button
            onClick={() => { setEditingId(null); setForm(emptyForm); }}
            className="px-4 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl cursor-pointer border-none hover:bg-gray-200"
          >
            ✕ Cancel Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create / Edit Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">
            {editingId ? "✏️ Edit Coupon" : "➕ Create Coupon"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. FESTIVAL50"
                className={inputClass + " uppercase font-mono font-bold tracking-widest"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type *</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className={inputClass}
                >
                  {DISCOUNT_TYPES.map(t => (
                    <option key={t} value={t}>{t === "PERCENTAGE" ? "% Percentage" : "₹ Flat Amount"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Value {form.discountType === "PERCENTAGE" ? "(%)" : "(₹)"} *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "PERCENTAGE" ? "10" : "100"}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  placeholder="200"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usage Limit</label>
                <input
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="100 (blank = unlimited)"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="accent-[#ff9248] w-4 h-4"
              />
              Active (visible to customers)
            </label>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-50"
            >
              {formLoading ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
            </button>
          </form>
        </div>

        {/* Coupons Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4">All Coupons</h3>

          {loading ? (
            <div className="text-center py-10 text-gray-400">Loading...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No coupons created yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                    <th className="py-3 px-2 text-left">Code</th>
                    <th className="py-3 px-2 text-left">Discount</th>
                    <th className="py-3 px-2 text-left">Min Order</th>
                    <th className="py-3 px-2 text-left">Expiry</th>
                    <th className="py-3 px-2 text-left">Usage</th>
                    <th className="py-3 px-2 text-left">Status</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((coupon) => {
                    const expired = isExpired(coupon.expiryDate);
                    return (
                      <tr key={coupon.id} className="hover:bg-gray-50 transition">
                        <td className="py-3 px-2 font-mono font-bold text-gray-800 tracking-wider">
                          {coupon.code}
                        </td>
                        <td className="py-3 px-2 font-bold text-[#ff9248]">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}% OFF`
                            : `₹${coupon.discountValue} OFF`}
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : "—"}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-semibold ${expired ? "text-red-500" : "text-gray-600"}`}>
                            {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                            {expired && <span className="ml-1 text-[10px] font-bold">(Expired)</span>}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-gray-500 text-xs">
                          {coupon.usageCount}
                          {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                        </td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => handleToggle(coupon)}
                            className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer border-none transition ${
                              coupon.active && !expired
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-600 hover:bg-red-200"
                            }`}
                          >
                            {coupon.active && !expired ? "Active" : expired ? "Expired" : "Inactive"}
                          </button>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(coupon)}
                              className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-red-100"
                            >
                              Delete
                            </button>
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
      </div>
    </div>
  );
}

export default Coupons;
