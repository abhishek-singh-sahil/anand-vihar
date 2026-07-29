import { prisma } from "../config/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Public: Get all active banners
export const getBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" }
    });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all banners (active and inactive)
export const getAdminBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { displayOrder: "asc" }
    });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    next(error);
  }
};

// Admin: Create a banner
export const createBanner = async (req, res, next) => {
  try {
    const { title = "", description = "", link = "", device = "desktop", displayOrder = 0, active = true } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Banner image file is required" });
    }

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_banners", "image");
    const imageUrl = uploadResult.secure_url;

    const banner = await prisma.banner.create({
      data: {
        title,
        description,
        image: imageUrl,
        link,
        device,
        displayOrder: parseInt(displayOrder) || 0,
        active: active === "true" || active === true
      }
    });

    res.status(201).json({ success: true, message: "Banner created successfully", banner });
  } catch (error) {
    next(error);
  }
};

// Admin: Update a banner
export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, link, device, displayOrder, active } = req.body;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (link !== undefined) updateData.link = link;
    if (device !== undefined) updateData.device = device;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder) || 0;
    if (active !== undefined) updateData.active = active === "true" || active === true;

    // Optional image replacement
    if (req.file) {
      // Delete old image from Cloudinary
      if (banner.image) {
        await deleteFromCloudinary(banner.image).catch(() => {});
      }
      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_banners", "image");
      updateData.image = uploadResult.secure_url;
    }

    const updatedBanner = await prisma.banner.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, message: "Banner updated successfully", banner: updatedBanner });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete a banner
export const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Delete image from Cloudinary
    if (banner.image) {
      await deleteFromCloudinary(banner.image).catch(() => {});
    }

    await prisma.banner.delete({ where: { id } });

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    next(error);
  }
};
