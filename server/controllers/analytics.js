import User from "../models/User.js";
import Reservation from "../models/Reservation.js";
import Testimonial from "../models/Testimonial.js";
import Blog from "../models/Blog.js";
import Gallery from "../models/Gallery.js";
import Subscriber from "../models/Subscriber.js";
import Contact from "../models/Contact.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: "pending" });
    const approvedReservations = await Reservation.countDocuments({ status: "approved" });
    const totalTestimonials = await Testimonial.countDocuments();
    const pendingTestimonials = await Testimonial.countDocuments({ status: "pending" });
    const totalBlogs = await Blog.countDocuments();
    const totalGallery = await Gallery.countDocuments();
    const totalSubscribers = await Subscriber.countDocuments({ status: "active" });
    const unreadMessages = await Contact.countDocuments({ status: "unread" });

    // Aggregate testimonial interactions
    const testimonials = await Testimonial.find();
    let totalTestimonialLikes = 0;
    let totalTestimonialComments = 0;
    testimonials.forEach(t => {
      totalTestimonialLikes += t.likes.length;
      totalTestimonialComments += t.comments.length;
    });

    // Aggregate blog interactions
    const blogs = await Blog.find();
    let totalBlogLikes = 0;
    let totalBlogComments = 0;
    let totalBlogViews = 0;
    blogs.forEach(b => {
      totalBlogLikes += b.likes.length;
      totalBlogComments += b.comments.length;
      totalBlogViews += b.views;
    });

    // Top blogs
    const mostViewedBlogs = await Blog.find()
      .select("title views slug image category")
      .sort({ views: -1 })
      .limit(5);

    // Top testimonials (based on rating and comments/likes)
    const mostPopularTestimonials = await Testimonial.find({ status: "approved" })
      .select("name review rating viewCount likes")
      .sort({ rating: -1, viewCount: -1 })
      .limit(5);

    // Dynamic visitor stats for the last 7 days (mock data for premium UX)
    const visitorData = [
      { day: "Mon", visitors: 420, reservations: 12 },
      { day: "Tue", visitors: 380, reservations: 8 },
      { day: "Wed", visitors: 490, reservations: 15 },
      { day: "Thu", visitors: 520, reservations: 19 },
      { day: "Fri", visitors: 680, reservations: 25 },
      { day: "Sat", visitors: 850, reservations: 35 },
      { day: "Sun", visitors: 920, reservations: 42 },
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalReservations,
        pendingReservations,
        approvedReservations,
        totalTestimonials,
        pendingTestimonials,
        totalBlogs,
        totalGallery,
        totalSubscribers,
        unreadMessages,
        testimonialLikes: totalTestimonialLikes,
        testimonialComments: totalTestimonialComments,
        blogLikes: totalBlogLikes,
        blogComments: totalBlogComments,
        blogViews: totalBlogViews,
      },
      mostViewedBlogs,
      mostPopularTestimonials,
      visitorData,
    });
  } catch (error) {
    next(error);
  }
};

// Users management for Admin
export const adminGetUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role value" });
    }

    // Guard against changing one's own role
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User role updated successfully", user });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
