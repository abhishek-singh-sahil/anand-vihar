import Gallery from "../models/Gallery.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

import Testimonial from "../models/Testimonial.js";

export const getGalleryItems = async (req, res, next) => {
  try {
    const { category, type } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    // 1. Fetch manual gallery items
    const dbItems = await Gallery.find(query).sort({ createdAt: -1 });

    // 2. Fetch approved testimonials media if category matches or category is All/empty
    let testimonialMedia = [];
    const isCatMatch = !category || category === "All" || category === "Restaurant";
    
    if (isCatMatch) {
      const approvedReviews = await Testimonial.find({ status: "approved" });
      
      approvedReviews.forEach(t => {
        // Add images
        if (t.images && t.images.length > 0) {
          t.images.forEach((imgUrl, idx) => {
            if (!type || type === "image") {
              testimonialMedia.push({
                _id: `${t._id}_img_${idx}`,
                title: `Review Photo - ${t.name}`,
                category: "Restaurant",
                type: "image",
                url: imgUrl,
                createdAt: t.createdAt
              });
            }
          });
        }
        
        // Add video
        if (t.video && (!type || type === "video")) {
          testimonialMedia.push({
            _id: `${t._id}_vid`,
            title: `Review Video - ${t.name}`,
            category: "Restaurant",
            type: "video",
            url: t.video,
            createdAt: t.createdAt
          });
        }
      });
    }

    // 3. Merge, convert schemas to plain objects first
    const plainDbItems = dbItems.map(item => item.toObject());
    const mergedItems = [...plainDbItems, ...testimonialMedia];

    // 4. Sort by date descending
    mergedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, items: mergedItems });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category, type } = req.body;

    if (!title || !category || !type) {
      return res.status(400).json({ success: false, message: "Title, Category, and Type are required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Media file is required" });
    }

    const folder = type === "video" ? "anand_vihar_gallery_video" : "anand_vihar_gallery";
    const uploadRes = await uploadToCloudinary(req.file.buffer, folder, type);

    const galleryItem = new Gallery({
      title,
      category,
      type,
      url: uploadRes.secure_url,
    });

    await galleryItem.save();
    res.status(201).json({ success: true, message: "Gallery item created successfully", galleryItem });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    await deleteFromCloudinary(item.url);
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteGalleryItems = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of gallery IDs" });
    }

    const items = await Gallery.find({ _id: { $in: ids } });
    for (const item of items) {
      await deleteFromCloudinary(item.url);
    }

    await Gallery.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Gallery items batch deleted successfully" });
  } catch (error) {
    next(error);
  }
};
