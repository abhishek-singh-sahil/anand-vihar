import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const blogCategories = [
  "Recipes",
  "Sweets & Culture",
  "Festivals",
  "Health & Diet",
  "News & Events",
];

function CreateBlog() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(blogCategories[0]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Guard routing
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to write a blog post");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      return toast.error("Please fill in title, category and content body");
    }
    if (!image) {
      return toast.error("Please upload a featured cover image");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const res = await api.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success("Blog article published successfully!");
        navigate("/blogs");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 font-sans bg-[#FDFCFA]">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#013e37]">Write A Blog Article</h2>
          <p className="text-sm text-gray-500 mt-1">Share your traditional recipes, sweet craftings, and thoughts with the community.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Blog Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. The Secrets of Perfect Kalakand"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] cursor-pointer"
              >
                {blogCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Featured Cover Image *</label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content Body *</label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your blog post content here. You can use standard paragraphs."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-500 font-semibold transition hover:bg-gray-55 cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold transition shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 text-sm"
            >
              {submitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;
