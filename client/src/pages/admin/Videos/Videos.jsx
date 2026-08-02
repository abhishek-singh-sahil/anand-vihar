import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, Save, X, ExternalLink, ArrowUpDown } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import api from "../../../services/api";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos");
      if (res.data.success) {
        setVideos(res.data.videos || []);
      }
    } catch (error) {
      toast.error("Failed to fetch videos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleResetForm = () => {
    setEditingId(null);
    setTitle("");
    setVideoUrl("");
    setDescription("");
    setDisplayOrder(0);
  };

  const handleEditClick = (video) => {
    setEditingId(video.id);
    setTitle(video.title);
    setVideoUrl(video.videoUrl);
    setDescription(video.description || "");
    setDisplayOrder(video.displayOrder || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      return toast.error("Title and Video URL are required.");
    }

    setSubmitting(true);
    const payload = {
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      description: description.trim(),
      displayOrder: parseInt(displayOrder) || 0
    };

    try {
      if (editingId) {
        // Edit mode
        const res = await api.put(`/videos/admin/${editingId}`, payload);
        if (res.data.success) {
          toast.success("Video updated successfully!");
          fetchVideos();
          handleResetForm();
        }
      } else {
        // Add mode
        const res = await api.post("/videos/admin", payload);
        if (res.data.success) {
          toast.success("Video added successfully!");
          fetchVideos();
          handleResetForm();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this YouTube video link?")) return;

    try {
      const res = await api.delete(`/videos/admin/${id}`);
      if (res.data.success) {
        toast.success("Video deleted from system.");
        fetchVideos();
      }
    } catch (error) {
      toast.error("Failed to delete video.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#FDFCFA] min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#013e37]">YouTube Videos Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Manage videos displayed on the customer video gallery catalog.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CRUD Form card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-extrabold text-[#013e37] text-lg mb-5 flex items-center gap-2">
              <FaYoutube className="text-[#ff9248]" size={20} />
              {editingId ? "Edit YouTube Video" : "Add YouTube Video"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Video Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Preparation of Kalakand Sweet"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">YouTube Video Link</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description about the video recipe..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                {editingId ? (
                  <>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#013e37] hover:bg-[#024a42] text-white font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {submitting ? "Saving..." : "Update Video"}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#ff9248] hover:bg-[#ea5a00] text-white font-bold py-3 rounded-xl text-sm border-none cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                  >
                    <Plus size={16} />
                    {submitting ? "Saving..." : "Save Video"}
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

        {/* Video List Table panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-extrabold text-[#013e37] text-base">Active Video Listings</h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {videos.length} videos
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-3" />
                <p className="font-semibold text-sm">Loading video list...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <FaYoutube className="mx-auto text-gray-200 mb-3" size={32} />
                <p className="font-semibold text-sm">No videos registered in the system.</p>
                <p className="text-xs mt-1">Use the entry form to add your first YouTube video.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="p-4 pl-6">Preview & Title</th>
                      <th className="p-4" style={{ width: "120px" }}>Display Order</th>
                      <th className="p-4 text-center" style={{ width: "120px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 text-sm">
                    {videos.map((video) => (
                      <tr key={video.id} className="hover:bg-gray-50/40 transition-colors">
                        
                        {/* Preview and details */}
                        <td className="p-4 pl-6 flex items-start gap-3.5">
                          <div className="w-24 aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100 relative shrink-0">
                            <img
                              src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-sm text-[#013e37] block leading-snug">
                              {video.title}
                            </span>
                            <span className="text-[11px] text-zinc-400 block mt-1 font-semibold truncate max-w-sm">
                              {video.description || "No description set"}
                            </span>
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 hover:underline mt-1.5 shrink-0"
                            >
                              Open on YouTube <ExternalLink size={10} />
                            </a>
                          </div>
                        </td>

                        {/* Display Index */}
                        <td className="p-4">
                          <span className="font-bold text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                            {video.displayOrder}
                          </span>
                        </td>

                        {/* Edit/Delete Actions */}
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(video)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition border-none bg-transparent"
                              title="Edit Video"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(video.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition border-none bg-transparent"
                              title="Delete Video"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Videos;
