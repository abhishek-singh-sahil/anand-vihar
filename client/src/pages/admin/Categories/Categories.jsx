import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const [form, setForm] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    isFeatured: false,
    status: true,
    metaTitle: "",
    metaDescription: "",
    slug: ""
  });
  const [categoryImage, setCategoryImage] = useState(null);
  const [editCategoryImage, setEditCategoryImage] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menu/categories");
      if (res.data.success) setCategories(res.data.categories);
    } catch (error) {
      toast.error("Could not fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("displayOrder", form.displayOrder);
      formData.append("isFeatured", form.isFeatured);
      formData.append("status", form.status);
      formData.append("metaTitle", form.metaTitle);
      formData.append("metaDescription", form.metaDescription);
      formData.append("slug", form.slug);
      if (categoryImage) {
        formData.append("image", categoryImage);
      }

      const res = await api.post("/menu/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Category created!");
        setForm({ name: "", description: "", displayOrder: 0, isFeatured: false, status: true, metaTitle: "", metaDescription: "", slug: "" });
        setCategoryImage(null);
        // Reset file input
        document.getElementById("categoryImageInput").value = "";
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id || cat._id);
    setEditForm({
      name: cat.name,
      description: cat.description || "",
      displayOrder: cat.displayOrder || 0,
      isFeatured: cat.isFeatured || false,
      status: cat.status !== false,
      metaTitle: cat.metaTitle || "",
      metaDescription: cat.metaDescription || "",
      slug: cat.slug || ""
    });
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("displayOrder", editForm.displayOrder);
      formData.append("isFeatured", editForm.isFeatured);
      formData.append("status", editForm.status);
      formData.append("metaTitle", editForm.metaTitle);
      formData.append("metaDescription", editForm.metaDescription);
      formData.append("slug", editForm.slug);
      if (editCategoryImage) {
        formData.append("image", editCategoryImage);
      }

      const res = await api.put(`/menu/categories/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        toast.success("Category updated!");
        setEditingId(null);
        setEditCategoryImage(null);
        fetchCategories();
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const id = cat.id || cat._id;
      const res = await api.put(`/menu/categories/${id}`, { status: !cat.status });
      if (res.data.success) {
        toast.success(`Category ${cat.status ? "hidden" : "shown"}`);
        fetchCategories();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleToggleFeatured = async (cat) => {
    try {
      const id = cat.id || cat._id;
      const res = await api.put(`/menu/categories/${id}`, { isFeatured: !cat.isFeatured });
      if (res.data.success) {
        toast.success(`Featured ${cat.isFeatured ? "removed" : "set"}`);
        fetchCategories();
      }
    } catch {
      toast.error("Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/menu/categories/${id}`);
      toast.success("Deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]";

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 h-fit">
          <h3 className="text-xl font-bold text-gray-800">Add Category</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Traditional Sweets"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description..."
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
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">URL Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Meta Title (SEO)</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="SEO title for this category"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Meta Description (SEO)</label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                placeholder="SEO description..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category Image</label>
              <input
                id="categoryImageInput"
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.checked })}
                  className="accent-[#ff9248]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="accent-[#ff9248]"
                />
                Featured
              </label>
            </div>
            <button type="submit" className="w-full py-3 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-bold text-sm cursor-pointer">
              Create Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-xl font-bold text-gray-800">All Categories ({categories.length})</h3>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No categories yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map((cat) => {
                const id = cat.id || cat._id;
                const isEditing = editingId === id;
                return (
                  <div key={id} className="py-4">
                    {isEditing ? (
                      <div className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Name</label>
                            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Display Order</label>
                            <input type="number" value={editForm.displayOrder} onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value) || 0 })} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Slug</label>
                            <input value={editForm.slug} onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Meta Title</label>
                            <input value={editForm.metaTitle} onChange={(e) => setEditForm({ ...editForm, metaTitle: e.target.value })} className={inputClass} />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                          <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Meta Description</label>
                          <textarea rows={2} value={editForm.metaDescription} onChange={(e) => setEditForm({ ...editForm, metaDescription: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Replace Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditCategoryImage(e.target.files[0])}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                          />
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                            <input type="checkbox" checked={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.checked })} className="accent-[#ff9248]" />
                            Active
                          </label>
                          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                            <input type="checkbox" checked={editForm.isFeatured} onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })} className="accent-[#ff9248]" />
                            Featured
                          </label>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button onClick={saveEdit} className="px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-xl cursor-pointer border-none hover:bg-green-200">Save</button>
                          <button onClick={() => setEditingId(null)} className="px-4 py-1.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-xl cursor-pointer border-none hover:bg-gray-200">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#ff9248] flex items-center justify-center font-bold text-xs shrink-0">No Img</div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800 text-base">{cat.name}</span>
                              {cat.isFeatured && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>}
                              {!cat.status && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Hidden</span>}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400 font-semibold">
                              {cat.slug && <span>/{cat.slug}</span>}
                              <span>Order: {cat.displayOrder}</span>
                              <span>{cat._count?.products ?? 0} items</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => handleToggleStatus(cat)} className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer border-none ${cat.status ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {cat.status ? "✓ Active" : "Hidden"}
                          </button>
                          <button onClick={() => handleToggleFeatured(cat)} className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer border-none ${cat.isFeatured ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                            {cat.isFeatured ? "★ Featured" : "Set Featured"}
                          </button>
                          <button onClick={() => startEdit(cat)} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-blue-100">Edit</button>
                          <button onClick={() => handleDelete(id)} className="px-3 py-1 bg-red-50 text-red-500 text-xs font-bold rounded-lg cursor-pointer border-none hover:bg-red-100">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
