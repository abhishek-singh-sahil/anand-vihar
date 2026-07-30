import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const blogCategories = [
  "Recipes",
  "Sweets & Culture",
  "Festivals",
  "Health & Diet",
  "News & Events",
];

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(blogCategories[0]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/blogs?search=${search}&limit=100`);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch blogs list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleOpenCreate = () => {
    setEditingBlog(null);
    setTitle("");
    setCategory(blogCategories[0]);
    setContent("");
    setImage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setCategory(blog.category);
    setContent(blog.content);
    setImage(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      return toast.error("Please fill in title, category and content body");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      let res;
      if (editingBlog) {
        res = await api.put(`/blogs/${editingBlog.id || editingBlog._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        if (!image) {
          setSubmitting(false);
          return toast.error("Please upload a featured image");
        }
        res = await api.post("/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message || "Blog saved successfully!");
        setShowModal(false);
        fetchBlogs();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this blog article?")) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        toast.success("Blog article deleted");
        fetchBlogs();
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 font-sans space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Blogs Articles CRUD Panel</h2>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-sm cursor-pointer shadow-sm"
        >
          + Write New Blog
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
          />
          <button type="submit" className="absolute right-3 top-3 text-xs text-gray-400">
            🔍
          </button>
        </form>
      </div>

      {/* Blogs list */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 font-semibold">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-semibold">No articles found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold text-xs uppercase">
                <th className="py-4 px-2">Article</th>
                <th className="py-4 px-2">Category</th>
                <th className="py-4 px-2">Views</th>
                <th className="py-4 px-2">Likes</th>
                <th className="py-4 px-2">Comments</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id || blog._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 leading-tight">{blog.title}</h4>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-xs font-semibold text-gray-500">{blog.category}</td>
                  <td className="py-4 px-2 text-sm font-bold text-gray-700">{blog.views || 0}</td>
                  <td className="py-4 px-2 text-sm font-semibold text-red-400">❤️ {blog.likes?.length || 0}</td>
                  <td className="py-4 px-2 text-sm font-semibold text-gray-500">💬 {blog.comments?.length || 0}</td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(blog)}
                        className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-orange-50 text-gray-700 hover:text-[#ff9248] font-bold rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id || blog._id)}
                        className="px-2.5 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-lg transition cursor-pointer"
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

      {/* Editor Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-bold text-gray-800">{editingBlog ? "Edit Blog Article" : "Write Blog Article"}</h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Blog Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                  >
                    {blogCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Content (Rich Text supported via simple HTML tags)</label>
                <textarea
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Write your article here...</p><br/><h3>Subheading</h3><p>More paragraphs...</p>"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff9248] font-mono"
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
                  {submitting ? "Saving Article..." : "Save Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blogs;
