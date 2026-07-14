import Blog from "../models/Blog.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Public: Get list of blogs
export const getBlogs = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 6 } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "popular") {
      sortOption = { views: -1, createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const blogs = await Blog.find(query)
      .populate("author", "name profilePic")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limitNum);

    res.status(200).json({
      success: true,
      blogs,
      pagination: {
        totalBlogs,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get details of a single blog by slug
export const getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    // Find blog and increment views
    const blog = await Blog.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("author", "name profilePic");

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    // Get related blogs (same category, excluding current)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      _id: { $ne: blog._id },
    })
      .select("title slug image createdAt")
      .limit(3);

    res.status(200).json({ success: true, blog, relatedBlogs });
  } catch (error) {
    next(error);
  }
};

// User Toggle Like (auth required)
export const likeBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    const index = blog.likes.indexOf(userId);
    if (index === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes.splice(index, 1);
    }

    await blog.save();
    res.status(200).json({ success: true, likesCount: blog.likes.length, hasLiked: index === -1 });
  } catch (error) {
    next(error);
  }
};

// User Comment (auth required)
export const addCommentToBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    const name = req.user.name;

    if (!text) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    blog.comments.push({
      user: userId,
      name,
      text,
    });

    await blog.save();
    res.status(201).json({ success: true, comments: blog.comments });
  } catch (error) {
    next(error);
  }
};

// Admin CRUD Operations
export const createBlog = async (req, res, next) => {
  try {
    const { title, category, content } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Featured image is required for new blogs" });
    }

    let slug = generateSlug(title);
    
    // Handle duplicate slug
    const slugExists = await Blog.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const uploadRes = await uploadToCloudinary(req.file.buffer, "anand_vihar_blogs", "image");

    const blog = new Blog({
      title,
      slug,
      category,
      content,
      author: req.user.id,
      image: uploadRes.secure_url,
    });

    await blog.save();
    res.status(201).json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden. You are not authorized to update this blog." });
    }

    if (title) {
      blog.title = title;
      // Regenerate slug
      let slug = generateSlug(title);
      const slugExists = await Blog.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
      blog.slug = slug;
    }

    if (category) blog.category = category;
    if (content) blog.content = content;

    if (req.file) {
      await deleteFromCloudinary(blog.image);
      const uploadRes = await uploadToCloudinary(req.file.buffer, "anand_vihar_blogs", "image");
      blog.image = uploadRes.secure_url;
    }

    await blog.save();
    res.status(200).json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden. You are not authorized to delete this blog." });
    }

    await deleteFromCloudinary(blog.image);
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
