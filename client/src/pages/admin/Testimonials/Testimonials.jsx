import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  Star, RefreshCw, Save, ShieldAlert, Check, EyeOff, Pin, 
  ArrowUpDown, Search, Filter, HelpCircle, LogOut, CheckCircle, 
  XCircle, ChevronLeft, ChevronRight, MessageSquare, AlertCircle
} from "lucide-react";
import api from "../../../services/api";

function Testimonials() {
  const [activeTab, setActiveTab] = useState("list");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    enabled: true,
    googleAccountId: "",
    googleLocationId: "",
    googlePlaceId: "",
    googleMapsUrl: "",
    googleReviewUrl: "",
    syncInterval: 24,
    limitCount: 6,
    showPhoto: true,
    showDate: true,
    showRating: true,
    showOverallRating: true,
    showTotalReviews: true,
    enableWriteBtn: true,
    enableViewAllBtn: true,
    averageRating: 0.0,
    totalReviews: 0,
    lastSyncedAt: null,
    businessName: "",
    isConnected: false
  });

  // Filter & Pagination states
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Metrics states
  const [metrics, setMetrics] = useState({
    featuredCount: 0,
    hiddenCount: 0
  });

  // Read URL query params on redirect callback from Google OAuth
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "connected") {
      toast.success("Linked to Google Business Profile successfully!");
      // Clean query params
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get("error")) {
      toast.error(`Google Connection failed: ${params.get("error")}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch reviews cache list based on filters
  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = `/testimonials/admin?page=${page}&limit=8&search=${search}&rating=${ratingFilter}&isVisible=${visibilityFilter}&isFeatured=${featuredFilter}`;
      const res = await api.get(url);
      if (res.data.success) {
        setReviews(res.data.reviews || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
        setMetrics(res.data.metrics || { featuredCount: 0, hiddenCount: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cached reviews list");
    } finally {
      setLoading(false);
    }
  };

  // Fetch configuration parameters
  const fetchSettings = async () => {
    try {
      const res = await api.get("/testimonials/admin/settings");
      if (res.data.success) {
        setSettings(res.data.settings || {});
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Load configuration and data
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [page, ratingFilter, visibilityFilter, featuredFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReviews();
  };

  // Connect Google Profile OAuth redirect
  const handleConnectGoogle = async () => {
    try {
      const res = await api.get("/testimonials/admin/google/oauth/url");
      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error("Failed to generate Google connection request link");
    }
  };

  // Disconnect Google Account OAuth
  const handleDisconnectGoogle = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Google Business account? OAuth tokens will be deleted.")) return;
    try {
      const res = await api.post("/testimonials/admin/google/oauth/disconnect");
      if (res.data.success) {
        toast.success("Disconnected from Google Business Profile successfully.");
        fetchSettings();
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to disconnect from Google");
    }
  };

  // Save Config Fields
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await api.put("/testimonials/admin/settings", settings);
      if (res.data.success) {
        toast.success("Settings updated successfully!");
        setSettings(res.data.settings);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save configurations");
    } finally {
      setSavingSettings(false);
    }
  };

  // Trigger manual synchronization API
  const handleSyncNow = async () => {
    if (!settings.isConnected) {
      return toast.error("Please connect your Google Account before syncing!");
    }
    setSyncing(true);
    try {
      const res = await api.post("/testimonials/admin/sync");
      if (res.data.success) {
        toast.success(res.data.message || "Google reviews cached successfully!");
        fetchSettings();
        fetchReviews();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Sync execution failed.");
    } finally {
      setSyncing(false);
    }
  };

  // Toggle Visibility and Featured states in reviews list
  const handleUpdateReviewField = async (id, payload) => {
    try {
      const res = await api.put(`/testimonials/admin/reviews/${id}`, payload);
      if (res.data.success) {
        toast.success("Review parameters updated!");
        setReviews(prev =>
          prev.map(r => (r.id === id ? { ...r, ...res.data.review } : r))
        );
        // Refresh metrics counter
        fetchReviews();
      }
    } catch (error) {
      toast.error("Update request failed.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-[#FDFCFA] min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#013e37]">Google Reviews Console</h1>
          <p className="text-sm text-gray-500 mt-1">Manage official Google Business Profile API OAuth reviews synchronizations and cache visibility controls.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSyncNow}
            disabled={syncing || !settings.isConnected}
            className="flex items-center gap-2 bg-[#ff9248] hover:bg-[#ea5a00] active:scale-95 text-white font-bold px-5 py-3 rounded-xl shadow-sm text-sm border-none cursor-pointer disabled:opacity-50 transition-all shrink-0"
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync Reviews"}
          </button>
        </div>
      </div>

      {/* Section 6: Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Average Rating</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-black text-[#013e37]">{settings.averageRating ? settings.averageRating.toFixed(1) : "0.0"}</span>
            <Star className="text-yellow-400 fill-yellow-400 align-middle shrink-0" size={16} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Google Reviews</span>
          <span className="text-3xl font-black text-[#013e37] mt-2">{settings.totalReviews || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Featured Reviews</span>
          <span className="text-3xl font-black text-orange-500 mt-2">{metrics.featuredCount || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Hidden Reviews</span>
          <span className="text-3xl font-black text-gray-400 mt-2">{metrics.hiddenCount || 0}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-xs font-bold text-gray-400 uppercase">Last Synced</span>
          <span className="text-xs font-bold text-[#013e37] mt-2 block leading-snug">
            {settings.lastSyncedAt ? new Date(settings.lastSyncedAt).toLocaleString() : "Never"}
          </span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 mb-8 gap-4">
        <button
          onClick={() => setActiveTab("list")}
          className={`pb-3 text-sm font-bold border-t-0 border-x-0 border-b-2 border-solid cursor-pointer transition-all bg-transparent px-2 ${
            activeTab === "list"
              ? "border-[#ff9248] text-[#ff9248]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Review Manager ({totalCount})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 text-sm font-bold border-t-0 border-x-0 border-b-2 border-solid cursor-pointer transition-all bg-transparent px-2 ${
            activeTab === "settings"
              ? "border-[#ff9248] text-[#ff9248]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          API & Settings Console
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "list" ? (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-4 items-center justify-between">
              
              <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search reviewer name or comments..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#013e37] text-white font-semibold px-5 py-2.5 rounded-xl text-sm border-none cursor-pointer hover:bg-[#024a42] transition-colors"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Rating Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-1">Rating</span>
                  <select
                    value={ratingFilter}
                    onChange={(e) => {
                      setRatingFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9248] text-gray-600 bg-white"
                  >
                    <option value="">All Stars</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Visibility Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-1">Visibility</span>
                  <select
                    value={visibilityFilter}
                    onChange={(e) => {
                      setVisibilityFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9248] text-gray-600 bg-white"
                  >
                    <option value="">All statuses</option>
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                {/* Featured Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase mr-1">Featured</span>
                  <select
                    value={featuredFilter}
                    onChange={(e) => {
                      setFeaturedFilter(e.target.value);
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ff9248] text-gray-600 bg-white"
                  >
                    <option value="">All reviews</option>
                    <option value="true">Featured</option>
                    <option value="false">Standard</option>
                  </select>
                </div>
              </div>

            </form>
          </div>

          {/* Section 5: Review Manager Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {reviews.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <AlertCircle className="mx-auto mb-3 text-gray-300" size={32} />
                <p className="font-semibold text-sm">No Google Reviews found in local cache database.</p>
                <p className="text-xs mt-1">Refine your search term or trigger 'Sync Reviews' to download Business reviews.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase border-b border-gray-100">
                      <th className="p-4 pl-6">Reviewer Info</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Review comment</th>
                      <th className="p-4 text-center">Featured State</th>
                      <th className="p-4 text-center">Visibility</th>
                      <th className="p-4 text-center" style={{ width: "110px" }}>Display Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {reviews.map((rev) => (
                      <tr key={rev.id} className="hover:bg-gray-50/40 transition-colors">
                        
                        {/* Profile Details */}
                        <td className="p-4 pl-6 flex items-center gap-3">
                          {rev.reviewerPhoto ? (
                            <img
                              src={rev.reviewerPhoto}
                              alt={rev.reviewerName}
                              className="h-10 w-10 rounded-full object-cover border border-gray-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-orange-50 text-[#ff9248] flex items-center justify-center font-bold text-sm shrink-0">
                              {rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : "?"}
                            </div>
                          )}
                          <div className="min-w-0">
                            {rev.reviewerProfileUrl ? (
                              <a
                                href={rev.reviewerProfileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#013e37] hover:underline block truncate"
                              >
                                {rev.reviewerName}
                              </a>
                            ) : (
                              <span className="font-bold text-[#013e37] block truncate">{rev.reviewerName}</span>
                            )}
                            <span className="text-[10px] text-gray-400 block mt-0.5 font-semibold">
                              {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString() : ""}
                            </span>
                          </div>
                        </td>

                        {/* Rating stars */}
                        <td className="p-4 shrink-0">
                          <div className="flex text-yellow-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </td>

                        {/* Comments */}
                        <td className="p-4 max-w-xs truncate text-gray-600 italic">
                          {rev.reviewText ? `"${rev.reviewText}"` : <span className="text-gray-300 italic">No text review</span>}
                        </td>

                        {/* Featured State Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleUpdateReviewField(rev.id, { isFeatured: !rev.isFeatured })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition flex items-center gap-1.5 mx-auto ${
                              rev.isFeatured
                                ? "bg-orange-50 text-[#ff9248] hover:bg-orange-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            <Pin size={11} className={rev.isFeatured ? "fill-[#ff9248]" : ""} />
                            {rev.isFeatured ? "Featured" : "Standard"}
                          </button>
                        </td>

                        {/* Visibility Status Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleUpdateReviewField(rev.id, { isVisible: !rev.isVisible })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer transition flex items-center gap-1.5 mx-auto ${
                              rev.isVisible
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            {rev.isVisible ? (
                              <>
                                <Check size={11} /> Show
                              </>
                            ) : (
                              <>
                                <EyeOff size={11} /> Hide
                              </>
                            )}
                          </button>
                        </td>

                        {/* Display Index */}
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            value={rev.displayOrder}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setReviews(prev =>
                                prev.map(r => (r.id === rev.id ? { ...r, displayOrder: val } : r))
                              );
                            }}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              handleUpdateReviewField(rev.id, { displayOrder: val });
                            }}
                            className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center font-bold text-xs"
                            min="0"
                          />
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination block */}
            {totalPages > 1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold">
                  Showing page {page} of {totalPages} ({totalCount} total reviews)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 border border-gray-200 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 border border-gray-200 bg-white rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: Connection & Section 2, 3, 4 forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Connection Status */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#013e37] text-base mb-4">Section 1: OAuth Connection Status</h3>
              <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  {settings.isConnected ? (
                    <CheckCircle className="text-green-500 shrink-0" size={32} />
                  ) : (
                    <XCircle className="text-gray-300 shrink-0" size={32} />
                  )}
                  <div>
                    <span className="font-bold text-sm text-[#013e37] block">
                      {settings.isConnected ? `Connected: ${settings.businessName || "Linked Store"}` : "Not Connected"}
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      {settings.isConnected 
                        ? `Linked on Google account. Tokens synced.` 
                        : "Required to fetch reviews via Google My Business."}
                    </span>
                  </div>
                </div>

                {settings.isConnected ? (
                  <button
                    onClick={handleDisconnectGoogle}
                    type="button"
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors"
                  >
                    <LogOut size={12} />
                    Disconnect Account
                  </button>
                ) : (
                  <button
                    onClick={handleConnectGoogle}
                    type="button"
                    className="flex items-center gap-1.5 bg-[#013e37] hover:bg-[#024a42] text-white font-bold px-4 py-2.5 rounded-xl text-xs border-none cursor-pointer transition-colors"
                  >
                    Connect Google Account
                  </button>
                )}
              </div>
            </div>

            {/* Section 2: Business Info, Section 3: Sync & Section 4: Display Controls */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* Enabled globally */}
                <div className="flex items-center justify-between pb-4 border-0 border-b border-solid border-gray-100">
                  <div>
                    <label className="font-bold text-sm text-[#013e37] block">Enable Reviews Display Globally</label>
                    <span className="text-xs text-gray-400 mt-0.5">Show or hide Google reviews feed elements across client pages.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>

                {/* Section 2: Business Information */}
                <div>
                  <h4 className="font-bold text-sm text-[#013e37] uppercase tracking-wide border-0 border-b border-solid border-gray-100 pb-2 mb-4">
                    Section 2: Business Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Business Store Name</label>
                        <input
                          type="text"
                          value={settings.businessName || ""}
                          onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                          placeholder="Anand Vihar Sweet Shop"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Google Place ID</label>
                        <input
                          type="text"
                          value={settings.googlePlaceId || ""}
                          onChange={(e) => setSettings({ ...settings, googlePlaceId: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                          placeholder="ChIJxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Google Location ID</label>
                        <input
                          type="text"
                          value={settings.googleLocationId || ""}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none text-sm font-semibold text-gray-400 cursor-not-allowed"
                          placeholder="Auto-populated on connection"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Google Business Account ID</label>
                        <input
                          type="text"
                          value={settings.googleAccountId || ""}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none text-sm font-semibold text-gray-400 cursor-not-allowed"
                          placeholder="Auto-populated on connection"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Google Maps Store URL</label>
                        <input
                          type="url"
                          value={settings.googleMapsUrl || ""}
                          onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                          placeholder="https://maps.google.com/?cid=..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Google Write Review URL</label>
                        <input
                          type="url"
                          value={settings.googleReviewUrl || ""}
                          onChange={(e) => setSettings({ ...settings, googleReviewUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                          placeholder="https://search.google.com/local/writereview?placeid=..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Synchronization config */}
                <div className="pt-4">
                  <h4 className="font-bold text-sm text-[#013e37] uppercase tracking-wide border-0 border-b border-solid border-gray-100 pb-2 mb-4">
                    Section 3: Synchronization Configs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Refresh Sync Interval</label>
                      <select
                        value={settings.syncInterval}
                        onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) || 24 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] text-sm font-semibold bg-white"
                      >
                        <option value={1}>1 Hour</option>
                        <option value={3}>3 Hours</option>
                        <option value={6}>6 Hours</option>
                        <option value={12}>12 Hours</option>
                        <option value={24}>24 Hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Maximum Displayed Reviews Limit</label>
                      <input
                        type="number"
                        value={settings.limitCount}
                        onChange={(e) => setSettings({ ...settings, limitCount: parseInt(e.target.value) || 6 })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent text-sm font-semibold"
                        min="1"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Display Controls */}
                <div className="pt-4">
                  <h4 className="font-bold text-sm text-[#013e37] uppercase tracking-wide border-0 border-b border-solid border-gray-100 pb-2 mb-4">
                    Section 4: Review Display Controls
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.showPhoto}
                        onChange={(e) => setSettings({ ...settings, showPhoto: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Reviewer Photo
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.showDate}
                        onChange={(e) => setSettings({ ...settings, showDate: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Review Date
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.showRating}
                        onChange={(e) => setSettings({ ...settings, showRating: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Star Rating
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.showOverallRating}
                        onChange={(e) => setSettings({ ...settings, showOverallRating: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Overall Rating Badge
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.showTotalReviews}
                        onChange={(e) => setSettings({ ...settings, showTotalReviews: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Total Reviews Stats
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={settings.enableWriteBtn}
                        onChange={(e) => setSettings({ ...settings, enableWriteBtn: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show Write Review Button
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer select-none col-span-2">
                      <input
                        type="checkbox"
                        checked={settings.enableViewAllBtn}
                        onChange={(e) => setSettings({ ...settings, enableViewAllBtn: e.target.checked })}
                        className="rounded text-[#ff9248] focus:ring-[#ff9248] h-4 w-4"
                      />
                      Show View All Reviews Button
                    </label>

                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex items-center justify-center gap-2 bg-[#013e37] hover:bg-[#024a42] active:scale-95 text-white font-bold w-full py-3.5 rounded-xl shadow-sm text-sm border-none cursor-pointer disabled:opacity-50 transition-all mt-6"
                >
                  <Save size={16} />
                  {savingSettings ? "Saving configuration..." : "Save Configuration"}
                </button>

              </form>
            </div>

          </div>

          {/* Sidebar Guidelines */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#013e37] text-base mb-4 flex items-center gap-1.5">
                <HelpCircle size={16} className="text-[#ff9248]" />
                OAuth Setup Steps
              </h3>
              <ul className="text-xs text-gray-600 space-y-3 pl-4 list-decimal leading-relaxed font-semibold">
                <li>
                  Create a Google Cloud Project at <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#ff9248] hover:underline">Google Console</a>.
                </li>
                <li>
                  Enable <strong>Google Business Profile API</strong> in APIs library.
                </li>
                <li>
                  Configure <strong>OAuth Consent Screen</strong> details and scopes.
                </li>
                <li>
                  Go to <strong>Credentials</strong>, create a Web Application Client ID. Set redirect URI to matches redirect callback parameter.
                </li>
                <li>
                  Configure the parameters inside your backend <code>.env</code> settings variables.
                </li>
                <li>
                  Click <strong>Connect Google Account</strong> above, sign-in, and select the location.
                </li>
                <li>
                  Click <strong>Sync Reviews</strong> to fetch and cache business reviews.
                </li>
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Testimonials;
