import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function BlogDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const fetchBlogDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/blogs/slug/${slug}`);
      if (response.data.success) {
        const blogData = response.data.blog;
        setBlog(blogData);
        setRelated(response.data.relatedBlogs);
        setLikesCount(blogData.likes.length);
        
        if (user) {
          setHasLiked(blogData.likes.includes(user.id || user._id));
        }
      }
    } catch (error) {
      console.error("Could not fetch blog details:", error);
      toast.error("Blog post not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      return toast.error("Please login to like this article!");
    }

    try {
      const res = await api.put(`/blogs/${blog.id || blog._id}/like`);
      if (res.data.success) {
        setLikesCount(res.data.likesCount);
        setHasLiked(res.data.hasLiked);
        toast.success(res.data.hasLiked ? "Added to liked posts" : "Removed like");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/blogs/${blog.id || blog._id}/comment`, { text: commentText });
      if (res.data.success) {
        setBlog(prev => ({ ...prev, comments: res.data.comments }));
        setCommentText("");
        toast.success("Comment published!");
      }
    } catch (error) {
      toast.error("Could not add comment");
    }
  };

  const handleShare = () => {
    const text = `Check out this interesting article on Anand Vihar: "${blog.title}" at ${window.location.href}`;
    navigator.clipboard.writeText(text);
    toast.success("Article link copied to clipboard!");
  };

  if (loading) {
    return <div className="text-center py-32 font-semibold text-gray-500 font-sans">Loading article...</div>;
  }

  if (!blog) {
    return <div className="text-center py-32 font-semibold text-gray-500 font-sans">Article not found</div>;
  }

  return (
    <div className="max-w-[900px] mx-auto py-12 px-6 bg-[#FDFCFA] font-sans">
      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Category & Title */}
        <div className="mb-6">
          <span className="bg-orange-50 text-[#ff9248] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#013e37] tracking-tight mt-4 leading-tight">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4 py-2 border-b border-gray-100">
            <span className="flex items-center gap-1.5">👤 By {blog.author?.name || "Admin"}</span>
            <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>👁 {blog.views} Views</span>
            <button
              onClick={handleShare}
              className="ml-auto flex items-center gap-1 hover:text-[#ff9248] font-semibold text-xs cursor-pointer"
            >
              🔗 Share Article
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-sm aspect-video mb-8 bg-gray-100">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Body */}
        <div
          className="prose max-w-none text-gray-700 leading-relaxed font-sans text-base space-y-6 mb-12"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Likes / Actions Area */}
        <div className="flex gap-4 items-center py-4 border-t border-b border-gray-100 mb-12">
          <button
            onClick={handleLike}
            className={`px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition cursor-pointer text-sm ${
              hasLiked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{likesCount} Likes</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Comments ({blog.comments?.length || 0})</h3>

          {/* Comment list */}
          <div className="space-y-4 mb-8">
            {blog.comments?.length === 0 ? (
              <p className="text-gray-500 text-sm font-medium">No comments yet. Share your thoughts!</p>
            ) : (
              blog.comments.map((c) => (
                <div key={c._id} className="bg-white p-5 rounded-2xl border border-gray-100 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 text-[#ff9248] font-bold flex items-center justify-center shrink-0">
                    {c.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="flex gap-3 items-center">
                      <h4 className="font-bold text-sm text-gray-800">{c.name}</h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1.5 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit Comment form */}
          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <label className="block text-sm font-bold text-gray-700">Add a public comment</label>
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write your comment here..."
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#013e37] text-white rounded-xl text-sm font-semibold hover:bg-opacity-95 cursor-pointer shadow-sm"
              >
                Submit Comment
              </button>
            </form>
          ) : (
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 text-center text-sm font-semibold text-gray-600">
              Please <Link to="/login" className="text-[#ff9248] underline">login</Link> to add comments and like this post.
            </div>
          )}
        </div>

        {/* Related Posts Section */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 pt-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div key={rel._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] text-gray-400 block mb-1">
                      {new Date(rel.createdAt).toLocaleDateString()}
                    </span>
                    <Link to={`/blogs/${rel.slug}`}>
                      <h4 className="font-bold text-gray-800 hover:text-[#ff9248] text-sm leading-snug line-clamp-2">
                        {rel.title}
                      </h4>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.article>
    </div>
  );
}

export default BlogDetail;
