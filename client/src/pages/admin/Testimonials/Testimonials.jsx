import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      let url = `/testimonials?search=${search}`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      const res = await api.get(url);
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not load testimonials list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTestimonials();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      // Testimonial controller uses PUT /admin/:id for admin updates
      const res = await api.put(`/testimonials/admin/${id}`, { status });
      if (res.data.success) {
        toast.success(`Review marked as ${status}`);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const handleTogglePinned = async (item) => {
    try {
      const res = await api.put(`/testimonials/admin/${item._id}`, { isPinned: !item.isPinned });
      if (res.data.success) {
        toast.success(item.isPinned ? "Review unpinned" : "Review pinned");
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const res = await api.put(`/testimonials/admin/${item._id}`, { isFeatured: !item.isFeatured });
      if (res.data.success) {
        toast.success(item.isFeatured ? "Removed from featured" : "Marked as featured");
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this testimonial review?")) return;
    try {
      const res = await api.delete(`/testimonials/admin/${id}`);
      if (res.data.success) {
        toast.success("Review deleted");
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await api.post("/testimonials/bulk-approve", { ids: selectedIds });
      if (res.data.success) {
        toast.success("Selected reviews approved successfully");
        setSelectedIds([]);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Batch approval failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} review records?`)) return;

    try {
      const res = await api.post("/testimonials/bulk-delete", { ids: selectedIds });
      if (res.data.success) {
        toast.success("Selected reviews deleted");
        setSelectedIds([]);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Batch deletion failed");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name || !city || !review) {
      return toast.error("Please fill in name, city and review text");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("rating", rating);
    formData.append("review", review);
    formData.append("isPinned", isPinned);
    formData.append("isFeatured", isFeatured);
    
    Array.from(mediaFiles).forEach(file => {
      formData.append("media", file);
    });

    try {
      const res = await api.post("/testimonials/admin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Testimonial review added by admin!");
        setShowModal(false);
        // Reset states
        setName("");
        setCity("");
        setRating(5);
        setReview("");
        setIsPinned(false);
        setIsFeatured(false);
        setMediaFiles([]);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create testimonial");
    } finally {
      setSubmitting(false);
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
        <h2 className="text-2xl font-bold text-gray-800">Testimonials Moderation CRUD Panel</h2>
        
        <div className="flex flex-wrap gap-2">
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={handleBulkApprove}
                className="px-3.5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Approve Selected ({selectedIds.length})
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3.5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-sm cursor-pointer"
          >
            + Add Testimonial
          </button>
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search reviews, name, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <button type="submit" className="absolute right-3 top-3 text-xs text-gray-400">
            🔍
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 px-3 py-2 text-xs rounded-xl border border-gray-200 outline-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading reviews...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No reviews found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2 w-10">Select</th>
                <th className="py-4 px-2">Author</th>
                <th className="py-4 px-2">Review</th>
                <th className="py-4 px-2">Rating</th>
                <th className="py-4 px-2">Moderation</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => toggleSelect(item._id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">{item.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">{item.city}</span>
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-600 max-w-xs leading-relaxed">
                    <p className="line-clamp-2">"{item.review}"</p>
                    <div className="flex gap-2 mt-1">
                      {item.images?.length > 0 && <span className="text-blue-500 font-bold">📷 {item.images.length} Images</span>}
                      {item.video && <span className="text-purple-500 font-bold">🎥 Video</span>}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-sm text-yellow-400 font-bold">★ {item.rating}</td>
                  <td className="py-4 px-2">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleTogglePinned(item)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase cursor-pointer ${
                          item.isPinned ? "bg-orange-100 text-[#ff9248]" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        Pin
                      </button>
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase cursor-pointer ${
                          item.isFeatured ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        Feature
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : item.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-1.5">
                      {item.status !== "approved" && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, "approved")}
                          className="px-2 py-1 text-xs bg-green-50 hover:bg-green-100 text-green-700 font-bold rounded-lg transition cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {item.status !== "rejected" && (
                        <button
                          onClick={() => handleStatusUpdate(item._id, "rejected")}
                          className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-lg transition cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Testimonial Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Add Testimonial Review</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Review Text</label>
                <textarea
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Upload Media files</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setMediaFiles(e.target.files)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>

              <div className="flex gap-4 bg-gray-50 p-4 rounded-2xl">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
                  📌 Pin to Top
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                  ⭐ Feature Review
                </label>
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
                  {submitting ? "Uploading..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Testimonials;
