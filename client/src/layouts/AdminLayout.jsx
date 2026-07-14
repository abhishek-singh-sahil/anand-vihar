import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FaChartBar,
  FaUtensils,
  FaTags,
  FaCalendarCheck,
  FaUsers,
  FaCommentDots,
  FaBookOpen,
  FaImages,
  FaCog,
  FaArrowLeft,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function AdminLayout() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "Menu Items", path: "/admin/products", icon: <FaUtensils /> },
    { name: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { name: "Reservations", path: "/admin/reservations", icon: <FaCalendarCheck /> },
    { name: "Users List", path: "/admin/customers", icon: <FaUsers /> },
    { name: "Testimonials", path: "/admin/testimonials", icon: <FaCommentDots /> },
    { name: "Blogs Manager", path: "/admin/blogs", icon: <FaBookOpen /> },
    { name: "Gallery Media", path: "/admin/gallery", icon: <FaImages /> },
    { name: "Settings", path: "/admin/settings", icon: <FaCog /> },
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex font-sans">
      {/* Mobile Sidebar overlay toggler */}
      <div className="lg:hidden fixed top-4 left-4 z-[999]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-[#013e37] text-white rounded-2xl shadow-md focus:outline-none cursor-pointer"
        >
          {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Left Sidebar Drawer */}
      <aside
        className={`w-64 bg-[#013e37] text-white flex flex-col justify-between fixed lg:sticky top-0 h-screen z-[99] transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#ff9248] flex items-center justify-center font-bold text-lg text-white">
              AV
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-[#ffefb3] tracking-wide leading-none">Anand Vihar</h2>
              <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest mt-1 block">Admin Hub</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[#ff9248] text-white shadow-md shadow-[#ff9248]/20"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition"
          >
            <FaArrowLeft />
            <span>Main Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition bg-transparent border-none text-left cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Side Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
          <div className="pl-12 lg:pl-0">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl capitalize">
              {location.pathname.split("/").pop()} Portal
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-gray-800 leading-none">{user?.name}</span>
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
                {user?.role} Mode
              </span>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-200 bg-gray-50 flex items-center justify-center font-bold text-sm text-[#ff9248]">
              {user?.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name.charAt(0)
              )}
            </div>
          </div>
        </header>

        {/* Dashboard page outlet */}
        <main className="p-6 sm:p-10 flex-grow max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
