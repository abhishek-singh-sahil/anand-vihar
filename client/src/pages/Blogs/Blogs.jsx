import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const blogCategories = [
  "All",
  "Recipes",
  "Sweets & Culture",
  "Festivals",
  "Health & Diet",
  "News & Events",
];

function Blogs() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/blogs?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=6`
      );
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Could not fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6 bg-[#FDFCFA] font-sans">
      {/* Blog Hero Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#013e37] mb-4">Anand Vihar Chronicles</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-6">
          Explore recipes, traditional sweet tales, festive celebrations, and updates from the heart of our kitchen.
        </p>
        {isAuthenticated && (
          <Link
            to="/blogs/create"
            className="inline-flex items-center gap-2 bg-[#013e37] hover:bg-[#025347] text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition shadow hover:shadow-md cursor-pointer"
          >
            ✍ Write A Blog Post
          </Link>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pill Filters */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-thin">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
                category === cat ? "bg-[#ff9248] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort actions */}
        <div className="flex gap-3 w-full md:w-auto items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64 pl-4 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#ff9248] focus:border-transparent"
            />
            <button type="submit" className="absolute right-3 top-3 text-gray-400 text-xs">
              🔍
            </button>
          </form>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl outline-none cursor-pointer"
          >
            <option value="latest">Newest</option>
            <option value="popular">Popular</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {/* Blogs Articles List */}
      {loading ? (
        <div className="text-center py-20 font-semibold text-gray-500">Loading food chronicles...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 font-semibold text-gray-500">
          No articles found matching the filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <motion.article
                key={blog.id || blog._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-md transition duration-300"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 bg-[#013e37] text-[#ffefb3] text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-gray-400 mb-2 flex gap-4">
                      <span>👤 {blog.author?.name || "Admin"}</span>
                      <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link to={`/blogs/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-gray-800 leading-tight mb-3 hover:text-[#ff9248] transition">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                      {blog.content.replace(/<[^>]*>/g, "")}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between text-xs font-semibold text-gray-400">
                  <div className="flex gap-4">
                    <span>👁 {blog.views} views</span>
                    <span>❤️ {blog.likes?.length || 0} likes</span>
                  </div>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="text-[#013e37] hover:text-[#ff9248] font-bold"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm font-bold text-gray-700 mx-2">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold rounded-xl text-gray-600 disabled:opacity-50 hover:bg-gray-50 cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Blogs;
