import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

function Dashboard() {
  const { settings, updateSystemSettings } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/analytics/stats");
      if (response.data.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Could not fetch analytics statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 font-bold text-gray-500 font-sans">Loading Dashboard...</div>;
  }

  const { stats, visitorData, mostViewedBlogs, mostPopularTestimonials } = data;

  const statCards = [
    { name: "Total Users", val: stats.totalUsers, desc: "Registered accounts", color: "border-l-blue-500 text-blue-600", link: "/admin/customers" },
    { name: "Total Orders", val: stats.totalOrders, desc: `${stats.pendingOrders || 0} Pending / ${stats.completedOrders || 0} Delivered`, color: "border-l-orange-500 text-orange-500", link: "/admin/orders" },
    { name: "Unread Messages", val: stats.unreadMessages, desc: "Form inquiries", color: "border-l-red-500 text-red-500", link: "/admin/messages" },
    { name: "Total Revenue", val: `₹${stats.totalRevenue?.toLocaleString("en-IN") || 0}`, desc: "Sum of completed orders", color: "border-l-teal-500 text-teal-600" },
    { name: "Blogs Published", val: stats.totalBlogs, desc: `${stats.blogViews} Total Views`, color: "border-l-purple-500 text-purple-600", link: "/admin/blogs" },
    { name: "Testimonials Submitted", val: stats.totalTestimonials, desc: `${stats.pendingTestimonials} Pending approval`, color: "border-l-indigo-500 text-indigo-600", link: "/admin/testimonials" },
  ];

  return (
    <div className="space-y-10 font-sans">
      {/* Dynamic System Toggles (Reservations & Online Orders) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">
        <div>
          <h4 className="font-bold text-gray-800 text-base">Store Feature Controls</h4>
          <p className="text-xs text-gray-400 mt-1">Start or stop core website features dynamically.</p>
        </div>
        
        <div className="flex flex-wrap gap-6 items-center">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings?.reservationsEnabled}
                onChange={async (e) => {
                  try {
                    await updateSystemSettings({ reservationsEnabled: e.target.checked });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#013e37]"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Table Reservations: {settings?.reservationsEnabled ? "🟢 Active" : "🔴 Stopped"}
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings?.orderingEnabled}
                onChange={async (e) => {
                  try {
                    await updateSystemSettings({ orderingEnabled: e.target.checked });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#013e37]"></div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Online Ordering / Cart: {settings?.orderingEnabled ? "🟢 Active" : "🔴 Stopped"}
            </span>
          </label>
        </div>
      </div>

      {/* Metrics Cards list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const CardContent = (
            <div className={`h-full bg-white p-6 rounded-2xl border-l-4 shadow-sm border border-gray-100 flex flex-col justify-between ${card.color}`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
                  {card.name}
                </span>
                <h2 className="text-3xl font-extrabold text-gray-800 leading-none">{card.val}</h2>
              </div>
              <span className="text-xs text-gray-500 font-medium mt-4 block">{card.desc}</span>
            </div>
          );

          return card.link ? (
            <Link key={idx} to={card.link} className="no-underline block h-full select-none cursor-pointer">
              {CardContent}
            </Link>
          ) : (
            <div key={idx} className="h-full select-none">
              {CardContent}
            </div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Visitors Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-lg mb-6">Website Visitor Performance</h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData}>
                <defs>
                  <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9248" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff9248" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="visitors" stroke="#ff9248" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-lg mb-6">Weekly Orders Trend</h4>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#013e37" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid for Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed Blogs */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h4 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3">Popular Blogs</h4>
          <div className="divide-y divide-gray-50">
            {mostViewedBlogs.map((b, idx) => (
              <div key={b.id} className="py-3 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-grow">
                  <h5 className="font-bold text-sm text-gray-800 truncate group-hover:text-[#ff9248] transition">
                    <Link to={`/blogs/${b.slug}`}>{b.title}</Link>
                  </h5>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{b.category}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-gray-800">{b.views}</span>
                  <span className="text-[10px] text-gray-400 block font-semibold">Views</span>
                </div>
              </div>
            ))}
            {mostViewedBlogs.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-500 font-medium">No blogs published yet</p>
            )}
          </div>
        </div>

        {/* Most Popular Testimonials */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h4 className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-3">Top Testimonials</h4>
          <div className="divide-y divide-gray-50">
            {mostPopularTestimonials.map((t, idx) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-grow">
                  <h5 className="font-bold text-sm text-gray-800 leading-tight">{t.name}</h5>
                  <p className="text-xs text-gray-500 line-clamp-1 mt-1">"{t.review}"</p>
                </div>
                <div className="flex gap-4 shrink-0 items-center">
                  <div className="text-right">
                    <span className="text-yellow-400 font-bold">★ {t.rating}</span>
                  </div>
                  <div className="text-right min-w-[50px]">
                    <span className="font-bold text-xs text-gray-800">{t.likes?.length || 0} Likes</span>
                  </div>
                </div>
              </div>
            ))}
            {mostPopularTestimonials.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-500 font-medium">No approved testimonials</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
