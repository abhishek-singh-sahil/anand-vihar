import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function PinCodes() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Single Add form
  const [form, setForm] = useState({ code: "", areaName: "", deliveryCharge: "", deliveryTime: "", active: true });
  const [formLoading, setFormLoading] = useState(false);

  // Bulk paste
  const [bulkText, setBulkText] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [showBulk, setShowBulk] = useState(false);

  // Editing inline
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pincodes");
      if (res.data?.success) setZones(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load PIN Codes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.deliveryCharge) {
      toast.error("PIN Code and Delivery Charge are required");
      return;
    }
    setFormLoading(true);
    try {
      const res = await api.post("/pincodes", {
        code: form.code.trim(),
        areaName: form.areaName.trim(),
        deliveryCharge: Number(form.deliveryCharge),
        deliveryTime: form.deliveryTime.trim(),
        active: form.active
      });
      if (res.data?.success) {
        toast.success("PIN Code zone added!");
        setForm({ code: "", areaName: "", deliveryCharge: "", deliveryTime: "", active: true });
        fetchZones();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add PIN Code");
    } finally {
      setFormLoading(false);
    }
  };

  const handleBulkCreate = async () => {
    const lines = bulkText.trim().split("\n").filter(l => l.trim());
    if (!lines.length) { toast.error("Paste some PIN Code lines first"); return; }

    const parsed = lines.map(line => {
      // Accept: "825409 - 40" or "825409 - 40 - 1-2 Days" or "825409, Bazar, 40"
      const dashSplit = line.split("-").map(s => s.trim());
      const commaSplit = line.split(",").map(s => s.trim());
      if (dashSplit.length >= 2) {
        return { code: dashSplit[0], areaName: dashSplit.length >= 3 ? dashSplit[1] : "", deliveryCharge: Number(dashSplit[dashSplit.length - 1]) || 0, deliveryTime: "" };
      } else if (commaSplit.length >= 2) {
        return { code: commaSplit[0], areaName: commaSplit[1] || "", deliveryCharge: Number(commaSplit[2]) || 0, deliveryTime: "" };
      }
      return null;
    }).filter(Boolean);

    if (!parsed.length) { toast.error("No valid lines found. Use format: CODE - CHARGE (e.g. 825409 - 40)"); return; }

    setBulkLoading(true);
    try {
      const res = await api.post("/pincodes/bulk", { zones: parsed });
      if (res.data?.success) {
        toast.success(`Imported ${res.data.count} PIN Codes!`);
        setBulkText("");
        setShowBulk(false);
        fetchZones();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk import failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggle = async (zone) => {
    try {
      const res = await api.put(`/pincodes/${zone.id}`, { active: !zone.active });
      if (res.data?.success) {
        toast.success(`PIN Code ${zone.active ? "deactivated" : "activated"}`);
        fetchZones();
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this PIN Code zone?")) return;
    try {
      const res = await api.delete(`/pincodes/${id}`);
      if (res.data?.success) { toast.success("Deleted!"); fetchZones(); }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const startEdit = (zone) => {
    setEditingId(zone.id);
    setEditForm({ code: zone.code, areaName: zone.areaName || "", deliveryCharge: zone.deliveryCharge, deliveryTime: zone.deliveryTime || "" });
  };

  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/pincodes/${id}`, {
        code: editForm.code.trim(),
        areaName: editForm.areaName.trim(),
        deliveryCharge: Number(editForm.deliveryCharge),
        deliveryTime: editForm.deliveryTime.trim()
      });
      if (res.data?.success) {
        toast.success("Updated!");
        setEditingId(null);
        fetchZones();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const filtered = zones.filter(z =>
    z.code.includes(search) || (z.areaName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">PIN Code Delivery Zones</h2>
          <p className="text-sm text-gray-500 mt-1">{zones.length} zones configured</p>
        </div>
        <button
          onClick={() => setShowBulk(!showBulk)}
          className="px-4 py-2 bg-[#013e37] text-white text-sm font-bold rounded-xl hover:bg-[#025347] transition cursor-pointer"
        >
          {showBulk ? "✕ Close Bulk Import" : "📋 Bulk Import"}
        </button>
      </div>

      {/* Bulk Import Panel */}
      {showBulk && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">📋 Bulk Paste PIN Codes</h3>
          <p className="text-xs text-gray-500">
            Paste one entry per line. Accepted formats:<br />
            <code className="bg-gray-100 px-1 rounded">825409 - 40</code> &nbsp;
            <code className="bg-gray-100 px-1 rounded">825410 - Bazaar - 50</code> &nbsp;
            <code className="bg-gray-100 px-1 rounded">825411, Market Area, 60</code>
          </p>
          <textarea
            rows={8}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"825409 - 40\n825410 - 50\n825411 - Bazar Colony - 60"}
            className="w-full font-mono text-sm px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#ff9248] resize-y"
          />
          <button
            onClick={handleBulkCreate}
            disabled={bulkLoading}
            className="px-6 py-2.5 bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-50"
          >
            {bulkLoading ? "Importing..." : "Import PIN Codes"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Add Single Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">Add New Zone</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">PIN Code *</label>
              <input
                type="text"
                required
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g. 825409"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff9248]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Area Name (optional)</label>
              <input
                type="text"
                value={form.areaName}
                onChange={(e) => setForm({ ...form, areaName: e.target.value })}
                placeholder="e.g. Jhumri Telaiya Bazar"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff9248]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Delivery Charge (₹) *</label>
              <input
                type="number"
                required
                value={form.deliveryCharge}
                onChange={(e) => setForm({ ...form, deliveryCharge: e.target.value })}
                placeholder="e.g. 40"
                min={0}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff9248]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Estimated Delivery Time</label>
              <input
                type="text"
                value={form.deliveryTime}
                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                placeholder="e.g. 1-2 Days"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff9248]"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="activeCheck"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-[#ff9248]"
              />
              <label htmlFor="activeCheck" className="text-sm text-gray-700 font-semibold cursor-pointer">Active (accepts orders)</label>
            </div>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full py-2.5 bg-[#013e37] hover:bg-[#025347] text-white font-bold rounded-xl text-sm cursor-pointer disabled:opacity-50"
            >
              {formLoading ? "Adding..." : "+ Add Zone"}
            </button>
          </form>
        </div>

        {/* Zones List */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by PIN or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#ff9248]"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400 font-semibold">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-400 font-semibold">No zones found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">PIN Code</th>
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">Area</th>
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">Charge</th>
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">ETA</th>
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="text-left py-2 px-2 text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((zone) => (
                    <tr key={zone.id} className="hover:bg-gray-50 transition">
                      {editingId === zone.id ? (
                        <>
                          <td className="py-2 px-2">
                            <input
                              value={editForm.code}
                              onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                              className="w-24 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              value={editForm.areaName}
                              onChange={(e) => setEditForm({ ...editForm, areaName: e.target.value })}
                              className="w-28 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={editForm.deliveryCharge}
                              onChange={(e) => setEditForm({ ...editForm, deliveryCharge: e.target.value })}
                              className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              value={editForm.deliveryTime}
                              onChange={(e) => setEditForm({ ...editForm, deliveryTime: e.target.value })}
                              className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-2">—</td>
                          <td className="py-2 px-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(zone.id)}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-green-200"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-gray-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-3 px-2 font-bold text-gray-800">{zone.code}</td>
                          <td className="py-3 px-2 text-gray-500">{zone.areaName || "—"}</td>
                          <td className="py-3 px-2 font-bold text-[#ff9248]">₹{zone.deliveryCharge}</td>
                          <td className="py-3 px-2 text-gray-500 text-xs">{zone.deliveryTime || "—"}</td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => handleToggle(zone)}
                              className={`px-3 py-1 text-xs font-bold rounded-full cursor-pointer border-none transition ${
                                zone.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"
                              }`}
                            >
                              {zone.active ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(zone)}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-blue-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(zone.id)}
                                className="px-2 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PinCodes;
