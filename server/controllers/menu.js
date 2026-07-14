import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Categories CRUD
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Menu Items CRUD
export const getMenuItems = async (req, res, next) => {
  try {
    const { search, category, veg, bestseller, popular, isNew, available } = req.query;
    
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (veg !== undefined) {
      query.veg = veg === "true";
    }

    if (bestseller !== undefined) {
      query.bestseller = bestseller === "true";
    }

    if (popular !== undefined) {
      query.popular = popular === "true";
    }

    if (isNew !== undefined) {
      query.isNew = isNew === "true";
    }

    if (available !== undefined) {
      query.available = available === "true";
    }

    const items = await MenuItem.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category, veg, bestseller, popular, isNew } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image upload is required for new menu items" });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_menu", "image");

    const menuItem = new MenuItem({
      name,
      description,
      price: Number(price),
      category,
      image: uploadResult.secure_url,
      veg: veg === "true" || veg === true,
      bestseller: bestseller === "true" || bestseller === true,
      popular: popular === "true" || popular === true,
      isNew: isNew === "true" || isNew === true,
    });

    await menuItem.save();

    res.status(201).json({ success: true, message: "Menu item created successfully", menuItem });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, veg, bestseller, popular, isNew, available } = req.body;

    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    if (name) item.name = name;
    if (description) item.description = description;
    if (price) item.price = Number(price);
    if (category) item.category = category;
    if (veg !== undefined) item.veg = veg === "true" || veg === true;
    if (bestseller !== undefined) item.bestseller = bestseller === "true" || bestseller === true;
    if (popular !== undefined) item.popular = popular === "true" || popular === true;
    if (isNew !== undefined) item.isNew = isNew === "true" || isNew === true;
    if (available !== undefined) item.available = available === "true" || available === true;

    if (req.file) {
      // Delete old image
      await deleteFromCloudinary(item.image);
      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_menu", "image");
      item.image = uploadResult.secure_url;
    }

    await item.save();

    res.status(200).json({ success: true, message: "Menu item updated successfully", item });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    await deleteFromCloudinary(item.image);
    await MenuItem.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Menu item deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteMenuItems = async (req, res, next) => {
  try {
    const { ids } = req.body; // array of ids
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of item IDs" });
    }

    const items = await MenuItem.find({ _id: { $in: ids } });
    for (const item of items) {
      await deleteFromCloudinary(item.image);
    }

    await MenuItem.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ success: true, message: "Menu items bulk deleted successfully" });
  } catch (error) {
    next(error);
  }
};
