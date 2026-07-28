import { prisma } from "../config/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Visitor submission (no login required)
export const submitTestimonial = async (req, res, next) => {
  try {
    const { name, city, phone, rating, review } = req.body;

    if (!name || !city || !rating || !review) {
      return res.status(400).json({ success: false, message: "Name, City, Rating and Review text are required" });
    }

    let imageUrls = [];
    let videoUrl = "";

    if (req.files) {
      const files = req.files;
      const imageFiles = files.filter(f => f.mimetype.startsWith("image/"));
      const videoFiles = files.filter(f => f.mimetype.startsWith("video/"));

      // Upload images
      for (const img of imageFiles) {
        const uploadRes = await uploadToCloudinary(img.buffer, "anand_vihar_testimonials", "image");
        imageUrls.push(uploadRes.secure_url);
      }

      // Upload video
      if (videoFiles.length > 0) {
        const vid = videoFiles[0];
        const uploadRes = await uploadToCloudinary(vid.buffer, "anand_vihar_testimonials_video", "video");
        videoUrl = uploadRes.secure_url;
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        city,
        phone: phone || "",
        rating: Number(rating),
        review,
        images: imageUrls,
        video: videoUrl,
        status: "pending", // admin approval required
      }
    });

    res.status(201).json({
      success: true,
      message: "Testimonial submitted successfully. It will be visible once approved by admin.",
      testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// View approved testimonials
export const getApprovedTestimonials = async (req, res, next) => {
  try {
    const { sort, featured } = req.query;
    const query = { status: "approved" };

    if (featured === "true") {
      query.isFeatured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where: query
    });

    // Client-side sort to mirror MongoDB query logic
    if (sort === "trending") {
      testimonials.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        const scoreA = a.viewCount + (a.likes ? a.likes.length : 0);
        const scoreB = b.viewCount + (b.likes ? b.likes.length : 0);
        return scoreB - scoreA;
      });
    } else {
      testimonials.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        if (sort === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        } else if (sort === "highest") {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          // default newest
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    next(error);
  }
};

// Increment view count
export const incrementViewCount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Toggle Like
export const likeTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { identifier } = req.body;
    
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Client identifier is required" });
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    let updatedLikes = [...testimonial.likes];
    const index = updatedLikes.indexOf(identifier);
    if (index === -1) {
      updatedLikes.push(identifier);
    } else {
      updatedLikes.splice(index, 1);
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { likes: updatedLikes }
    });

    res.status(200).json({ success: true, likes: updatedTestimonial.likes });
  } catch (error) {
    next(error);
  }
};

// Emoji reactions toggle
export const reactToTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reactionType, identifier } = req.body;

    if (!["thumbsUp", "heart", "clap", "laugh"].includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }
    
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Client identifier is required" });
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    let reactions = testimonial.emojiReactions;
    if (typeof reactions === "string") {
      reactions = JSON.parse(reactions);
    }
    if (!reactions || typeof reactions !== "object") {
      reactions = { thumbsUp: [], heart: [], clap: [], laugh: [] };
    }

    // Toggle reaction
    if (!reactions[reactionType]) {
      reactions[reactionType] = [];
    }

    const index = reactions[reactionType].indexOf(identifier);
    if (index === -1) {
      // Remove identifier from other reactions (single reaction limit per user)
      ["thumbsUp", "heart", "clap", "laugh"].forEach(type => {
        if (reactions[type]) {
          reactions[type] = reactions[type].filter(item => item !== identifier);
        }
      });
      reactions[reactionType].push(identifier);
    } else {
      reactions[reactionType].splice(index, 1);
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { emojiReactions: reactions }
    });

    res.status(200).json({ success: true, emojiReactions: updated.emojiReactions });
  } catch (error) {
    next(error);
  }
};

// Add comment to Testimonial
export const addCommentToTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ success: false, message: "Name and comment text are required" });
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    let commentsList = testimonial.comments;
    if (typeof commentsList === "string") {
      commentsList = JSON.parse(commentsList);
    }
    if (!Array.isArray(commentsList)) {
      commentsList = [];
    }

    commentsList.push({
      _id: Math.random().toString(36).substr(2, 9),
      name,
      text,
      createdAt: new Date(),
      replies: []
    });

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { comments: commentsList }
    });

    res.status(201).json({ success: true, comments: updated.comments });
  } catch (error) {
    next(error);
  }
};

// Reply to comment
export const addReplyToComment = async (req, res, next) => {
  try {
    const { testimonialId, commentId } = req.params;
    const { name, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ success: false, message: "Name and reply text are required" });
    }

    const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    let commentsList = testimonial.comments;
    if (typeof commentsList === "string") {
      commentsList = JSON.parse(commentsList);
    }
    if (!Array.isArray(commentsList)) {
      commentsList = [];
    }

    commentsList = commentsList.map(c => {
      if (c._id === commentId) {
        const replies = Array.isArray(c.replies) ? c.replies : [];
        replies.push({
          _id: Math.random().toString(36).substr(2, 9),
          name,
          text,
          createdAt: new Date()
        });
        return { ...c, replies };
      }
      return c;
    });

    const updated = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: { comments: commentsList }
    });

    res.status(201).json({ success: true, comments: updated.comments });
  } catch (error) {
    next(error);
  }
};

// Admin Testimonial Actions
export const adminGetTestimonials = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { review: { contains: search, mode: "insensitive" } },
      ];
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    next(error);
  }
};

export const adminCreateTestimonial = async (req, res, next) => {
  try {
    const { name, city, rating, review, isPinned, isFeatured } = req.body;

    let imageUrls = [];
    let videoUrl = "";

    if (req.files) {
      const files = req.files;
      const imageFiles = files.filter(f => f.mimetype.startsWith("image/"));
      const videoFiles = files.filter(f => f.mimetype.startsWith("video/"));

      for (const img of imageFiles) {
        const uploadRes = await uploadToCloudinary(img.buffer, "anand_vihar_testimonials", "image");
        imageUrls.push(uploadRes.secure_url);
      }

      if (videoFiles.length > 0) {
        const vid = videoFiles[0];
        const uploadRes = await uploadToCloudinary(vid.buffer, "anand_vihar_testimonials_video", "video");
        videoUrl = uploadRes.secure_url;
      }
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        city,
        rating: Number(rating),
        review,
        images: imageUrls,
        video: videoUrl,
        isPinned: isPinned === "true" || isPinned === true,
        isFeatured: isFeatured === "true" || isFeatured === true,
        status: "approved",
      }
    });

    res.status(201).json({ success: true, message: "Testimonial created by admin successfully", testimonial });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, city, rating, review, isPinned, isFeatured, status } = req.body;

    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (city) updateData.city = city;
    if (rating) updateData.rating = Number(rating);
    if (review) updateData.review = review;
    if (status) updateData.status = status;
    if (isPinned !== undefined) updateData.isPinned = isPinned === "true" || isPinned === true;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === "true" || isFeatured === true;

    if (req.files) {
      const files = req.files;
      const imageFiles = files.filter(f => f.mimetype.startsWith("image/"));
      const videoFiles = files.filter(f => f.mimetype.startsWith("video/"));

      if (imageFiles.length > 0) {
        for (const img of testimonial.images) {
          await deleteFromCloudinary(img);
        }
        updateData.images = [];
        for (const img of imageFiles) {
          const uploadRes = await uploadToCloudinary(img.buffer, "anand_vihar_testimonials", "image");
          updateData.images.push(uploadRes.secure_url);
        }
      }

      if (videoFiles.length > 0) {
        if (testimonial.video) {
          await deleteFromCloudinary(testimonial.video);
        }
        const vid = videoFiles[0];
        const uploadRes = await uploadToCloudinary(vid.buffer, "anand_vihar_testimonials_video", "video");
        updateData.video = uploadRes.secure_url;
      }
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, message: "Testimonial updated successfully", testimonial: updated });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    for (const img of testimonial.images) {
      await deleteFromCloudinary(img);
    }
    if (testimonial.video) {
      await deleteFromCloudinary(testimonial.video);
    }

    await prisma.testimonial.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const adminBulkApprove = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of testimonial IDs" });
    }

    await prisma.testimonial.updateMany({
      where: { id: { in: ids } },
      data: { status: "approved" }
    });
    res.status(200).json({ success: true, message: "Testimonials approved in batch successfully" });
  } catch (error) {
    next(error);
  }
};

export const adminBulkDelete = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of testimonial IDs" });
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { id: { in: ids } }
    });

    for (const testm of testimonials) {
      for (const img of testm.images) {
        await deleteFromCloudinary(img);
      }
      if (testm.video) {
        await deleteFromCloudinary(testm.video);
      }
    }

    await prisma.testimonial.deleteMany({
      where: { id: { in: ids } }
    });

    res.status(200).json({ success: true, message: "Testimonials batch deleted successfully" });
  } catch (error) {
    next(error);
  }
};
