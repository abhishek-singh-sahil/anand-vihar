import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function HomepageCMS() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    displayOrder: 0,
    active: true
  });
  const [bannerImage, setBannerImage] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    link: "",
    displayOrder: 0,
    active: true
  });
  const [editBannerImage, setEditBannerImage] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get("/banners/admin");
      if (res.data.success) {
        setBanners(res.data.banners || []);
      }
    } catch (error) {
      toast.error("Could not fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!bannerImage) {
      toast.error("Please upload a banner image file");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    formData.append("displayOrder", form.displayOrder);
    formData.append("active", form.active);
    formData.append("image", bannerImage);

    try {
      const res = await api.post("/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Banner added successfully!");
        setForm({ title: "", description: "", link: "", displayOrder: 0, active: true });
        setBannerImage(null);
        document.getElementById("bannerImageInput").value = "";
        fetchBanners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setEditForm({
      title: b.title || "",
      description: b.description || "",
      link: b.link || "",
      displayOrder: b.displayOrder || 0,
      active: b.active
    });
    setEditBannerImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editForm.title);
    formData.append("description", editForm.description);
    formData.append("link", editForm.link);
    formData.append("displayOrder", editForm.displayOrder);
    formData.append("active", editForm.active);
    if (editBannerImage) {
      formData.append("image", editBannerImage);
    }

    try {
      const res = await api.put(`/banners/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Banner updated successfully!");
        setEditingId(null);
        fetchBanners();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      const res = await api.delete(`/banners/${id}`);
      if (res.data.success) {
        toast.success("Banner deleted");
        fetchBanners();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggleActive = async (b) => {
    try {
      const res = await api.put(`/banners/${b.id}`, { active: !b.active });
      if (res.data.success) {
        toast.success(`Banner is now ${!b.active ? "Active" : "Inactive"}`);
        fetchBanners();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]";

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">Homepage Hero CMS</h2>
          <p className="text-sm text-gray-500 mt-1">Manage interactive slides and call-to-actions on the hero section.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create / Edit Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 h-fit">
          <h3 className="text-xl font-bold text-gray-800">
            {editingId ? "✏️ Edit Slide Banner" : "➕ Add Slide Banner"}
          </h3>

          {editingId ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Slide Title (Optional)</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Delicious Kalakand"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Slide description text..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Redirect Link (URL Path)</label>
                <input
                  type="text"
                  value={editForm.link}
                  onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                  placeholder="e.g. /menu or /offers"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Display Order</label>
                  <input
                    type="number"
                    value={editForm.displayOrder}
                    onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 0 })}
                    min={0}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Status</label>
                  <select
                    value={editForm.active}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.value === "true" })}
                    className={inputClass}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Replace Slide Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditBannerImage(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white font-bold rounded-xl text-sm cursor-pointer"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Slide Title (Optional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Delicious Kalakand"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Slide description text..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Redirect Link (URL Path)</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="e.g. /menu or /offers"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    min={0}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Status</label>
                  <select
                    value={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                    className={inputClass}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Banner Slide Image *</label>
                <input
                  id="bannerImageInput"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setBannerImage(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold rounded-xl text-sm cursor-pointer shadow-sm"
              >
                Add Banner Slide
              </button>
            </form>
          )}
        </div>

        {/* Banners Grid list */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Current Hero Slides ({banners.length})</h3>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No banner slides added yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                  <div className="aspect-[21/9] w-full bg-gray-50 overflow-hidden relative border-b border-gray-100">
                    <img src={b.image} alt={b.title || "Banner"} className="w-full h-full object-cover" />
                    {!b.active && (
                      <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        Inactive
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Order: {b.displayOrder}
                    </span>
                  </div>
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm truncate">{b.title || "Untitled Slide"}</h4>
                      {b.description && <p className="text-xs text-gray-500 line-clamp-1">{b.description}</p>}
                      <p className="text-[11px] text-[#ff9248] font-semibold font-mono truncate mt-1">
                        🔗 {b.link || "No redirect link"}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-50">
                      <button
                        onClick={() => handleToggleActive(b)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg cursor-pointer border-none transition ${
                          b.active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {b.active ? "✓ Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => startEdit(b)}
                        className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-blue-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomepageCMS;
