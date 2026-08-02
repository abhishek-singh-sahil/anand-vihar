import React, { useState, useEffect } from "react";
import { Play, X, Search, Info } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/videos");
        if (res.data.success) {
          setVideos(res.data.videos || []);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load video catalog.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Filter video elements locally based on text matching
  const filtered = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FDFCFA] font-sans pb-16">
      
      {/* Sleek Minimal Header */}
      <div className="bg-[#013e37] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-400 via-red-500 to-[#013e37]" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ff9248] px-3.5 py-1 text-xs font-bold text-white uppercase tracking-wider mb-4">
            <FaYoutube size={12} className="fill-white" />
            Watch & Learn
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#ffefb3]">
            Our Video Gallery
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed font-medium">
            Take a look at our recipes, sweet preparation methods, and kitchen practices.
          </p>
        </div>
      </div>

      {/* Search Input Control */}
      <div className="max-w-xl mx-auto px-4 mt-10">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos by title or description..."
            className="w-full pl-5 pr-12 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] text-sm font-semibold shadow-sm bg-white"
          />
          <div className="absolute right-4 inset-y-0 flex items-center text-gray-400">
            <Search size={18} />
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="max-w-6xl mx-auto px-4 mt-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mb-3" />
            <p className="font-bold text-sm">Loading videos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto px-6">
            <FaYoutube size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="font-bold text-[#013e37] text-base">No matching videos found</h3>
            <p className="text-xs text-gray-500 mt-1">Try searching for another keyword or title.</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                onClick={() => setActiveVideo(video)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Layer */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-900 shrink-0">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 sm:bg-black/30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform scale-100 sm:scale-90 sm:group-hover:scale-100 transition-transform duration-300">
                      <Play size={18} className="fill-white translate-x-0.5 sm:size-[20px]" />
                    </div>
                  </div>
                </div>

                {/* Video Info Panel */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-gray-800 line-clamp-2 leading-snug group-hover:text-[#ff9248] transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed font-medium">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Playing Modal Dialog */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-950 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border border-zinc-800"
            >
              
              {/* Close Overlay Trigger */}
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border-none cursor-pointer transition-all z-25 active:scale-95 shadow-md"
              >
                <X size={18} />
              </button>

              {/* YouTube Responsive iframe container with controls=1 and playsinline=1 for mobile devices */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&controls=1&playsinline=1&rel=0`}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Information Row */}
              <div className="p-6 bg-zinc-900 text-white text-left">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#ffefb3] tracking-tight leading-snug">
                  {activeVideo.title}
                </h2>
                
                {activeVideo.description && (
                  <div className="mt-4 p-4 rounded-2xl bg-zinc-800/45 text-xs sm:text-sm text-zinc-300 leading-relaxed font-semibold">
                    <div className="flex items-center gap-1.5 text-zinc-400 font-bold mb-1.5">
                      <Info size={13} /> Description
                    </div>
                    {activeVideo.description}
                  </div>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Videos;
