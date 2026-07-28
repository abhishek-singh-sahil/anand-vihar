import { prisma } from "../config/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getGalleryItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category && category !== "All") {
      where.category = category;
    }

    const dbItems = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    // Map fields so the frontend gets exactly what it expects
    const plainDbItems = dbItems.map(item => ({
      _id: item.id,
      title: item.caption,
      category: item.category,
      type: "image",
      url: item.image,
      createdAt: item.createdAt
    }));

    // Fetch approved testimonials media as well
    const testimonialMedia = [];
    const approvedReviews = await prisma.testimonial.findMany({
      where: { status: "approved" }
    });

    approvedReviews.forEach(t => {
      if (t.images && t.images.length > 0) {
        t.images.forEach((imgUrl, idx) => {
          testimonialMedia.push({
            _id: `${t.id}_img_${idx}`,
            title: `Review Photo - ${t.name}`,
            category: "Sweets",
            type: "image",
            url: imgUrl,
            createdAt: t.createdAt
          });
        });
      }
      if (t.video) {
        testimonialMedia.push({
          _id: `${t.id}_vid`,
          title: `Review Video - ${t.name}`,
          category: "Sweets",
          type: "video",
          url: t.video,
          createdAt: t.createdAt
        });
      }
    });

    const mergedItems = [...plainDbItems, ...testimonialMedia];
    mergedItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, items: mergedItems });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, message: "Title and Category are required" });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Media file is required" });
    }

    const uploadRes = await uploadToCloudinary(req.file.buffer, "anand_vihar_gallery", "image");
    const galleryItem = await prisma.gallery.create({
      data: {
        caption: title,
        category,
        image: uploadRes.secure_url
      }
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      galleryItem: {
        _id: galleryItem.id,
        title: galleryItem.caption,
        category: galleryItem.category,
        type: "image",
        url: galleryItem.image,
        createdAt: galleryItem.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.gallery.findUnique({ where: { id } });
    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }
    await deleteFromCloudinary(item.image);
    await prisma.gallery.delete({ where: { id } });
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
    const items = await prisma.gallery.findMany({
      where: { id: { in: ids } }
    });
    for (const item of items) {
      await deleteFromCloudinary(item.image);
    }
    await prisma.gallery.deleteMany({
      where: { id: { in: ids } }
    });
    res.status(200).json({ success: true, message: "Gallery items batch deleted successfully" });
  } catch (error) {
    next(error);
  }
};
