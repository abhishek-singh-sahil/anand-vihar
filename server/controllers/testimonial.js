import Testimonial from "../models/Testimonial.js";
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
      // Handles multiple images and single video
      const files = req.files;
      
      // Filter images and videos
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

    const testimonial = new Testimonial({
      name,
      city,
      phone,
      rating: Number(rating),
      review,
      images: imageUrls,
      video: videoUrl,
      status: "pending", // admin approval required
    });

    await testimonial.save();

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
    let query = { status: "approved" };

    if (featured === "true") {
      query.isFeatured = true;
    }

    let sortOption = { createdAt: -1 }; // default newest

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "highest") {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sort === "trending") {
      sortOption = { viewCount: -1, likesCount: -1 }; // sorting by views and likes count
    }

    // MongoDB aggregation to support sorting by likes array length if sorting by trending
    let testimonials;
    if (sort === "trending") {
      testimonials = await Testimonial.aggregate([
        { $match: query },
        {
          $addFields: {
            likesCount: { $size: "$likes" },
          },
        },
        { $sort: { isPinned: -1, viewCount: -1, likesCount: -1 } },
      ]);
    } else {
      testimonials = await Testimonial.find(query).sort({ isPinned: -1, ...sortOption });
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
    await Testimonial.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Toggle Like (Guest / User)
export const likeTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { identifier } = req.body; // IP address or user ID passed from client
    
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Client identifier is required" });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    const index = testimonial.likes.indexOf(identifier);
    if (index === -1) {
      testimonial.likes.push(identifier);
    } else {
      testimonial.likes.splice(index, 1);
    }

    await testimonial.save();
    res.status(200).json({ success: true, likes: testimonial.likes });
  } catch (error) {
    next(error);
  }
};

// Emoji reactions toggle
export const reactToTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reactionType, identifier } = req.body; // thumbsUp, heart, clap, laugh

    if (!["thumbsUp", "heart", "clap", "laugh"].includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction type" });
    }
    
    if (!identifier) {
      return res.status(400).json({ success: false, message: "Client identifier is required" });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    // Toggle reaction
    if (!testimonial.emojiReactions[reactionType]) {
      testimonial.emojiReactions[reactionType] = [];
    }

    const index = testimonial.emojiReactions[reactionType].indexOf(identifier);
    if (index === -1) {
      // Remove identifier from other reactions to allow only one reaction type per user
      ["thumbsUp", "heart", "clap", "laugh"].forEach(type => {
        if (testimonial.emojiReactions[type]) {
          testimonial.emojiReactions[type] = testimonial.emojiReactions[type].filter(id => id !== identifier);
        }
      });
      testimonial.emojiReactions[reactionType].push(identifier);
    } else {
      testimonial.emojiReactions[reactionType].splice(index, 1);
    }

    // Mark modifications so Mongoose saves nested objects
    testimonial.markModified("emojiReactions");
    await testimonial.save();

    res.status(200).json({ success: true, emojiReactions: testimonial.emojiReactions });
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

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    testimonial.comments.push({ name, text });
    await testimonial.save();

    res.status(201).json({ success: true, comments: testimonial.comments });
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

    const testimonial = await Testimonial.findById(testimonialId);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    const comment = testimonial.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.replies.push({ name, text });
    await testimonial.save();

    res.status(201).json({ success: true, comments: testimonial.comments });
  } catch (error) {
    next(error);
  }
};

// Admin Testimonial Actions
export const adminGetTestimonials = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { review: { $regex: search, $options: "i" } },
      ];
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
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

    const testimonial = new Testimonial({
      name,
      city,
      rating: Number(rating),
      review,
      images: imageUrls,
      video: videoUrl,
      isPinned: isPinned === "true" || isPinned === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      status: "approved", // admin created is pre-approved
    });

    await testimonial.save();
    res.status(201).json({ success: true, message: "Testimonial created by admin successfully", testimonial });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, city, rating, review, isPinned, isFeatured, status } = req.body;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    if (name) testimonial.name = name;
    if (city) testimonial.city = city;
    if (rating) testimonial.rating = Number(rating);
    if (review) testimonial.review = review;
    if (status) testimonial.status = status;
    if (isPinned !== undefined) testimonial.isPinned = isPinned === "true" || isPinned === true;
    if (isFeatured !== undefined) testimonial.isFeatured = isFeatured === "true" || isFeatured === true;

    if (req.files) {
      const files = req.files;
      const imageFiles = files.filter(f => f.mimetype.startsWith("image/"));
      const videoFiles = files.filter(f => f.mimetype.startsWith("video/"));

      if (imageFiles.length > 0) {
        // Delete old images
        for (const img of testimonial.images) {
          await deleteFromCloudinary(img);
        }
        testimonial.images = [];
        for (const img of imageFiles) {
          const uploadRes = await uploadToCloudinary(img.buffer, "anand_vihar_testimonials", "image");
          testimonial.images.push(uploadRes.secure_url);
        }
      }

      if (videoFiles.length > 0) {
        if (testimonial.video) {
          await deleteFromCloudinary(testimonial.video);
        }
        const vid = videoFiles[0];
        const uploadRes = await uploadToCloudinary(vid.buffer, "anand_vihar_testimonials_video", "video");
        testimonial.video = uploadRes.secure_url;
      }
    }

    await testimonial.save();
    res.status(200).json({ success: true, message: "Testimonial updated successfully", testimonial });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    // Clean up assets from Cloudinary
    for (const img of testimonial.images) {
      await deleteFromCloudinary(img);
    }
    if (testimonial.video) {
      await deleteFromCloudinary(testimonial.video);
    }

    await Testimonial.findByIdAndDelete(id);
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

    await Testimonial.updateMany({ _id: { $in: ids } }, { $set: { status: "approved" } });
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

    const testimonials = await Testimonial.find({ _id: { $in: ids } });
    for (const testm of testimonials) {
      for (const img of testm.images) {
        await deleteFromCloudinary(img);
      }
      if (testm.video) {
        await deleteFromCloudinary(testm.video);
      }
    }

    await Testimonial.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Testimonials batch deleted successfully" });
  } catch (error) {
    next(error);
  }
};
