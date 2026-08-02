import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/* Public Layout */
import MainLayout from "../layouts/MainLayout";

/* Admin Layout */
import AdminLayout from "../layouts/AdminLayout";

/* Public Pages */
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Menu from "../pages/Menu/Menu";
import Offers from "../pages/Offers/Offers";
import Gallery from "../pages/Gallery/Gallery";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";

/* New Public Pages */
import VerifyOtp from "../pages/VerifyOtp/VerifyOtp";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Profile from "../pages/Profile/Profile";
import Testimonials from "../pages/Testimonials/Testimonials";
import Blogs from "../pages/Blogs/Blogs";
import CreateBlog from "../pages/Blogs/CreateBlog";
import BlogDetail from "../pages/Blogs/BlogDetail";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import Terms from "../pages/Terms/Terms";
import FAQ from "../pages/FAQ/FAQ";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Videos from "../pages/Videos/Videos";

/* Admin Pages */
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import Products from "../pages/admin/Products/Products";
import Categories from "../pages/admin/Categories/Categories";
import OrdersAdmin from "../pages/admin/Orders/Orders";
import Customers from "../pages/admin/Customers/Customers";
import TestimonialsAdmin from "../pages/admin/Testimonials/Testimonials";
import BlogsAdmin from "../pages/admin/Blogs/Blogs";
import GalleryAdmin from "../pages/admin/Gallery/Gallery";
import Settings from "../pages/admin/Settings/Settings";
import PinCodes from "../pages/admin/PinCodes/PinCodes";
import Coupons from "../pages/admin/Coupons/Coupons";
import HomepageCMS from "../pages/admin/HomepageCMS/HomepageCMS";
import Messages from "../pages/admin/Messages/Messages";
import VideosAdmin from "../pages/admin/Videos/Videos";

// Protect route wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-gray-500 font-semibold bg-[#FDFCFA]">
        Authenticating...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC WEBSITE ================= */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="menu" element={<Menu />} />
        <Route path="offers" element={<Offers />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="blogs" element={<Blogs />} />
        <Route
          path="blogs/create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route path="blogs/:slug" element={<BlogDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-otp" element={<VerifyOtp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        
        {/* User profile (protected) */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        {/* Product details page */}
        <Route path="product/:id" element={<ProductDetail />} />
        
        {/* Videos gallery page */}
        <Route path="videos" element={<Videos />} />

        {/* Footers pages */}
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms-conditions" element={<Terms />} />
        <Route path="faq" element={<FAQ />} />
      </Route>

      {/* ================= ADMIN (Protected) ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<OrdersAdmin />} />
        <Route path="customers" element={<Customers />} />
         <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="videos" element={<VideosAdmin />} />
        <Route path="blogs" element={<BlogsAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="settings" element={<Settings />} />
        <Route path="pincodes" element={<PinCodes />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="homepage-cms" element={<HomepageCMS />} />
        <Route path="messages" element={<Messages />} />
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;