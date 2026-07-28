import { prisma } from "../config/db.js";
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
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    let orderBy = { createdAt: "desc" };
    if (sort === "popular") {
      orderBy = { views: "desc" };
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        comments: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const totalBlogs = await prisma.blog.count({ where });
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
    const blog = await prisma.blog.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        comments: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    // Get related blogs (same category, excluding current)
    const relatedBlogs = await prisma.blog.findMany({
      where: {
        category: blog.category,
        NOT: { id: blog.id }
      },
      select: {
        title: true,
        slug: true,
        image: true,
        createdAt: true
      },
      take: 3
    });

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

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    let updatedLikes = [...blog.likes];
    const index = updatedLikes.indexOf(userId);
    if (index === -1) {
      updatedLikes.push(userId);
    } else {
      updatedLikes.splice(index, 1);
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { likes: updatedLikes }
    });

    res.status(200).json({ success: true, likesCount: updatedBlog.likes.length, hasLiked: index === -1 });
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

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    await prisma.blogComment.create({
      data: {
        blogId: id,
        userId,
        name,
        text
      }
    });

    const comments = await prisma.blogComment.findMany({
      where: { blogId: id },
      orderBy: { createdAt: "desc" }
    });

    res.status(201).json({ success: true, comments });
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
    const slugExists = await prisma.blog.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const uploadRes = await uploadToCloudinary(req.file.buffer, "anand_vihar_blogs", "image");

    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        category,
        content,
        image: uploadRes.secure_url,
      }
    });

    res.status(201).json({ success: true, message: "Blog created successfully", blog });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    const updateData = {};
    if (title) {
      updateData.title = title;
      let slug = generateSlug(title);
      const slugExists = await prisma.blog.findFirst({
        where: { slug, NOT: { id } }
      });
      if (slugExists) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
      updateData.slug = slug;
    }

    if (category) updateData.category = category;
    if (content) updateData.content = content;

    if (req.file) {
      await deleteFromCloudinary(blog.image);
      const uploadRes = await uploadToCloudinary(req.file.buffer, "anand_vihar_blogs", "image");
      updateData.image = uploadRes.secure_url;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    await deleteFromCloudinary(blog.image);
    await prisma.blog.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
