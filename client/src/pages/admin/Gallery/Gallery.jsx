import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const galleryCategories = ["Restaurant", "Sweets", "Interior", "Kitchen", "Festival", "Events"];

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(galleryCategories[0]);
  const [type, setType] = useState("image"); // image, video
  const [mediaFile, setMediaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      let url = "/gallery?onlyGallery=true";
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch gallery items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedCategory]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !type) {
      return toast.error("Please fill in title, category, and media type");
    }
    if (!mediaFile) {
      return toast.error("Please upload a media file");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("type", type);
    formData.append("media", mediaFile);

    try {
      const res = await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Gallery item uploaded successfully!");
        setShowModal(false);
        setTitle("");
        setCategory(galleryCategories[0]);
        setType("image");
        setMediaFile(null);
        fetchGallery();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this gallery item?")) return;
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.data.success) {
        toast.success("Gallery item deleted");
        fetchGallery();
      }
    } catch (error) {
      toast.error("Deletion failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} gallery items?`)) return;

    try {
      const res = await api.post("/gallery/bulk-delete", { ids: selectedIds });
      if (res.data.success) {
        toast.success("Selected items deleted");
        setSelectedIds([]);
        fetchGallery();
      }
    } catch (error) {
      toast.error("Bulk deletion failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gallery Media CRUD Panel</h2>
        
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Bulk Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
          >
            + Upload Media File
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex justify-between items-center border-b border-gray-50 pb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {galleryCategories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Grid Thumbnail View */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading media gallery...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No media items found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="relative group rounded-2xl overflow-hidden shadow-sm aspect-square bg-gray-50 border border-gray-100 flex flex-col justify-between">
              {item.type === "video" ? (
                <div className="w-full h-full relative bg-black">
                  <video src={item.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-lg">
                    ▶ Video
                  </div>
                </div>
              ) : (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              )}

              {/* Hover selection and delete bar */}
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end">
                <div className="min-w-0">
                  <h5 className="text-white text-xs font-bold truncate leading-none mb-1">{item.title}</h5>
                  <span className="text-[9px] text-[#ffefb3] font-semibold uppercase tracking-wider">{item.category}</span>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[9px] font-bold transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Media Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Upload Media File</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Media Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] cursor-pointer"
                  >
                    {galleryCategories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] cursor-pointer"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Upload File</label>
                <input
                  type="file"
                  accept={type === "video" ? "video/*" : "image/*"}
                  onChange={(e) => setMediaFile(e.target.files[0])}
                  required
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-500 font-semibold text-sm cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Uploading Media..." : "Upload File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
