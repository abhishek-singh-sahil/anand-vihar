import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

function Testimonials() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Visitor identifier (IP or local random uuid stored in localStorage to prevent double likes/reactions)
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    let id = localStorage.getItem("testimonialVisitorId");
    if (!id) {
      id = "visitor_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("testimonialVisitorId", id);
    }
    setVisitorId(id);
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get(`/testimonials/approved?sort=${sort}`);
      if (response.data.success) {
        setTestimonials(response.data.testimonials);
      }
    } catch (error) {
      console.error("Could not fetch testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [sort]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verify format and size (30MB max)
    if (file.size > 30 * 1024 * 1024) {
      return toast.error("Video file is too large (max 30MB)");
    }

    // Client-side video duration validation (max 15 seconds)
    const videoEl = document.createElement("video");
    videoEl.preload = "metadata";
    videoEl.src = URL.createObjectURL(file);
    videoEl.onloadedmetadata = () => {
      window.URL.revokeObjectURL(videoEl.src);
      if (videoEl.duration > 15.5) {
        toast.error("Video duration cannot exceed 15 seconds!");
        setVideo(null);
        e.target.value = "";
      } else {
        setVideo(file);
      }
    };
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !city || !review || !rating) {
      return toast.error("Please fill in all required fields");
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("phone", phone);
    formData.append("rating", rating);
    formData.append("review", review);

    images.forEach(img => {
      formData.append("media", img);
    });

    if (video) {
      formData.append("media", video);
    }

    try {
      const response = await api.post("/testimonials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Review submitted! It will appear once approved by admin.");
        // Reset form
        setName("");
        setCity("");
        setPhone("");
        setRating(5);
        setReview("");
        setImages([]);
        setVideo(null);
        setShowSubmitForm(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await api.put(`/testimonials/${id}/like`, { identifier: visitorId });
      if (response.data.success) {
        setTestimonials(prev =>
          prev.map(t => (t._id === id ? { ...t, likes: response.data.likes } : t))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReact = async (id, reactionType) => {
    try {
      const response = await api.put(`/testimonials/${id}/react`, {
        reactionType,
        identifier: visitorId,
      });
      if (response.data.success) {
        setTestimonials(prev =>
          prev.map(t => (t._id === id ? { ...t, emojiReactions: response.data.emojiReactions } : t))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleIncrementView = async (id) => {
    try {
      await api.put(`/testimonials/${id}/view`);
      // Update local state views count
      setTestimonials(prev =>
        prev.map(t => (t._id === id ? { ...t, viewCount: t.viewCount + 1 } : t))
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-6 bg-[#FDFCFA]">
      {/* Header Banner */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#013e37] font-sans mb-4">Guest Testimonials</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Hear from our beloved customers who have experienced the magic of Anand Vihar's sweets and traditional dining.
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="px-6 py-3 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-semibold transition-all shadow-md cursor-pointer"
          >
            {showSubmitForm ? "Close Form" : "✍ Submit Your Testimonial"}
          </button>

          <div className="bg-white px-4 py-2 border border-gray-100 rounded-xl shadow-sm flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer border-none"
            >
              <option value="newest">Newest First</option>
              <option value="trending">Trending & Popular</option>
              <option value="highest">Highest Rated</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submission Form Dialog */}
      <AnimatePresence>
        {showSubmitForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-[#013e37] mb-6">Write a Review</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                      placeholder="Jhumri Telaiya"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating *</label>
                    <div className="flex gap-2.5 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl outline-none focus:outline-none"
                        >
                          {star <= rating ? "★" : "☆"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Review *</label>
                  <textarea
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                    placeholder="Tell us about your experience..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Images (Max 5)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload Video (Max 15s limit) *</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff9248] hover:file:bg-orange-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials List Grid */}
      {loading ? (
        <div className="text-center py-20 font-semibold text-gray-500">Loading customer stories...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20 font-semibold text-gray-500">
          No reviews visible. Be the first to write a review!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard
              key={t._id}
              testimonial={t}
              visitorId={visitorId}
              onLike={handleLike}
              onReact={handleReact}
              onView={handleIncrementView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Inner Card Component for detail rendering, comments, replies & sliders
function TestimonialCard({ testimonial, visitorId, onLike, onReact, onView }) {
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(testimonial.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  // Trigger view increment once on mount
  useEffect(() => {
    onView(testimonial._id);
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentName || !commentText) return;

    try {
      const res = await api.post(`/testimonials/${testimonial._id}/comment`, {
        name: commentName,
        text: commentText,
      });
      if (res.data.success) {
        setComments(res.data.comments);
        setCommentText("");
        toast.success("Comment added!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!commentName || !replyText) return;

    try {
      const res = await api.post(`/testimonials/${testimonial._id}/comment/${commentId}/reply`, {
        name: commentName,
        text: replyText,
      });
      if (res.data.success) {
        setComments(res.data.comments);
        setReplyText("");
        setReplyToId(null);
        toast.success("Reply added!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    const text = `Read ${testimonial.name}'s review on Anand Vihar: "${testimonial.review}"`;
    navigator.clipboard.writeText(text);
    toast.success("Review copied to clipboard for sharing!");
  };

  const hasLiked = testimonial.likes.includes(visitorId);
  const activeReaction = Object.keys(testimonial.emojiReactions || {}).find(key =>
    testimonial.emojiReactions[key]?.includes(visitorId)
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {testimonial.isPinned && (
        <span className="absolute top-4 right-4 bg-orange-100 text-[#ff9248] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          📌 Pinned
        </span>
      )}
      
      <div>
        {/* Rating & User Profile */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center font-bold text-xl text-[#ff9248]">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 leading-tight">{testimonial.name}</h4>
            <p className="text-xs text-gray-500 font-medium">{testimonial.city}</p>
          </div>
          <div className="ml-auto flex text-yellow-400 text-sm">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>

        {/* Review Description */}
        <p className="text-gray-600 leading-relaxed mb-6 font-sans">"{testimonial.review}"</p>

        {/* Media Attachments */}
        {testimonial.images && testimonial.images.length > 0 && (
          <div className="relative mb-6 rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 border border-gray-50">
            <img
              src={testimonial.images[imageIndex]}
              alt={`upload-${imageIndex}`}
              className="w-full h-full object-cover"
            />
            {testimonial.images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex(prev => (prev === 0 ? testimonial.images.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md font-bold text-sm cursor-pointer flex items-center justify-center"
                >
                  &lt;
                </button>
                <button
                  onClick={() => setImageIndex(prev => (prev === testimonial.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md font-bold text-sm cursor-pointer flex items-center justify-center"
                >
                  &gt;
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {testimonial.images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-2 h-2 rounded-full ${imageIndex === idx ? "bg-[#ff9248]" : "bg-white/55"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {testimonial.video && (
          <div className="mb-6 rounded-2xl overflow-hidden aspect-video bg-black border border-gray-900">
            <video src={testimonial.video} controls className="w-full h-full object-contain" />
          </div>
        )}
      </div>

      {/* Interactions Action Bar */}
      <div>
        <div className="flex flex-wrap gap-4 items-center py-4 border-t border-b border-gray-50 mb-4 text-xs font-semibold text-gray-500">
          {/* Likes Toggle */}
          <button
            onClick={() => onLike(testimonial._id)}
            className={`flex items-center gap-1.5 transition cursor-pointer py-1 px-2 rounded-lg ${
              hasLiked ? "text-red-500 bg-red-50" : "hover:text-[#ff9248] hover:bg-orange-50/50"
            }`}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{testimonial.likes?.length || 0} Likes</span>
          </button>

          {/* Emoji reactions picker */}
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-xl">
            {[
              { type: "thumbsUp", emoji: "👍" },
              { type: "heart", emoji: "💖" },
              { type: "clap", emoji: "👏" },
              { type: "laugh", emoji: "😂" },
            ].map(rx => {
              const count = testimonial.emojiReactions?.[rx.type]?.length || 0;
              const hasReacted = testimonial.emojiReactions?.[rx.type]?.includes(visitorId);
              return (
                <button
                  key={rx.type}
                  onClick={() => onReact(testimonial._id, rx.type)}
                  className={`px-1.5 py-0.5 rounded transition hover:scale-115 flex items-center gap-0.5 cursor-pointer ${
                    hasReacted ? "bg-orange-100" : ""
                  }`}
                  title={rx.type}
                >
                  <span>{rx.emoji}</span>
                  {count > 0 && <span className="text-[10px] text-gray-600">{count}</span>}
                </button>
              );
            })}
          </div>

          {/* Views count */}
          <span className="ml-auto text-[11px] font-medium text-gray-400">👁 {testimonial.viewCount || 0} Views</span>

          {/* Share */}
          <button onClick={handleShare} className="hover:text-[#ff9248] cursor-pointer" title="Copy Share Link">
            🔗 Share
          </button>
        </div>

        {/* Comment Expand Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-xs text-[#013e37] hover:text-[#ff9248] font-bold cursor-pointer mb-2 block"
        >
          {showComments ? "Collapse Comments" : `💬 View Comments (${comments.length})`}
        </button>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-4 pt-2">
            <div className="max-h-52 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {comments.map((c) => (
                <div key={c._id} className="text-xs bg-gray-50 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-800">{c.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{c.text}</p>
                  
                  {/* Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="pl-4 mt-2 border-l border-orange-200 space-y-2">
                      {c.replies.map((r, rIdx) => (
                        <div key={rIdx} className="bg-white/60 p-2 rounded-lg">
                          <div className="flex justify-between">
                            <span className="font-bold text-orange-800">{r.name}</span>
                            <span className="text-[9px] text-gray-400">
                              {new Date(r.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add reply trigger */}
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => setReplyToId(replyToId === c._id ? null : c._id)}
                      className="text-[10px] font-bold text-orange-400 hover:text-[#ff9248]"
                    >
                      Reply
                    </button>
                    {replyToId === c._id && (
                      <div className="flex gap-1.5 flex-grow items-center">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Your reply..."
                          className="flex-grow px-2 py-1 rounded bg-white border border-gray-200 text-[10px] focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddReply(c._id)}
                          className="px-2 py-1 bg-[#ff9248] text-white text-[9px] rounded font-bold"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex flex-col gap-2 pt-2 border-t border-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Your Name *"
                  required
                  className="w-1/3 px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a public comment... *"
                  required
                  className="flex-grow px-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#ff9248]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#013e37] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-opacity-95"
                >
                  Comment
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Testimonials;
