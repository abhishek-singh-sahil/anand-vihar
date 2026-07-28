import { prisma } from "../config/db.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// ============================================================================
// CATEGORIES CONTROLLERS
// ============================================================================

export const getCategories = async (req, res, next) => {
  try {
    const { search, active, featured } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }
    if (active !== undefined) {
      where.status = active === "true";
    }
    if (featured !== undefined) {
      where.isFeatured = featured === "true";
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description = "", status = true, displayOrder = 0, isFeatured = false, metaTitle = "", metaDescription = "", slug } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const exists = await prisma.category.findUnique({ where: { slug: generatedSlug } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category with this name or slug already exists" });
    }

    let imageUrl = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_categories", "image");
      imageUrl = uploadResult.secure_url;
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        image: imageUrl,
        status: status === "true" || status === true,
        displayOrder: parseInt(displayOrder) || 0,
        isFeatured: isFeatured === "true" || isFeatured === true,
        slug: generatedSlug,
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || description
      }
    });

    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, displayOrder, isFeatured, metaTitle, metaDescription, slug } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status === "true" || status === true;
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === "true" || isFeatured === true;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    
    if (slug) {
      updateData.slug = slug;
    } else if (name) {
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    }

    if (req.file) {
      if (category.image) {
        await deleteFromCloudinary(category.image).catch(() => {});
      }
      const uploadResult = await uploadToCloudinary(req.file.buffer, "anand_vihar_categories", "image");
      updateData.image = uploadResult.secure_url;
    }

    const updated = await prisma.category.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ success: true, message: "Category updated successfully", category: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.image) {
      await deleteFromCloudinary(category.image).catch(() => {});
    }

    await prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// PRODUCTS / MENU ITEMS CONTROLLERS
// ============================================================================

export const getMenuItems = async (req, res, next) => {
  try {
    const { 
      search, 
      category, 
      bestseller, 
      featured, 
      trending, 
      newArrival, 
      festivalSpecial, 
      limitedEdition, 
      comingSoon,
      available,
      minPrice,
      maxPrice,
      page = 1,
      limit = 100
    } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } }
      ];
    }

    if (category && category !== "All") {
      // Find category by name or ID
      where.categories = {
        some: {
          OR: [
            { id: category },
            { name: category }
          ]
        }
      };
    }

    if (bestseller !== undefined) where.isBestSeller = bestseller === "true";
    if (featured !== undefined) where.isFeatured = featured === "true";
    if (trending !== undefined) where.isTrending = trending === "true";
    if (newArrival !== undefined) where.isNewArrival = newArrival === "true";
    if (festivalSpecial !== undefined) where.isFestivalSpecial = festivalSpecial === "true";
    if (limitedEdition !== undefined) where.isLimitedEdition = limitedEdition === "true";
    if (comingSoon !== undefined) where.isComingSoon = comingSoon === "true";
    if (available !== undefined) where.available = available === "true";

    // Filtering by Price Variant Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            gte: minPrice !== undefined ? parseFloat(minPrice) : 0,
            lte: maxPrice !== undefined ? parseFloat(maxPrice) : 999999
          }
        }
      };
    }

    const products = await prisma.product.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { name: "asc" },
      include: { 
        categories: { select: { id: true, name: true } },
        variants: { where: { active: true }, orderBy: { price: "asc" } }
      }
    });

    const total = await prisma.product.count({ where });

    // Map database results to frontend structure for backwards compatibility
    const items = products.map(p => {
      // Pick the default variant (cheapest active one)
      const defaultVariant = p.variants[0] || { price: 0.0, stock: 0, weight: "N/A" };
      return {
        _id: p.id,
        name: p.name,
        description: p.description,
        price: defaultVariant.price,
        discount: defaultVariant.discount || 0.0,
        stock: defaultVariant.stock || 0,
        weight: defaultVariant.weight,
        image: p.image,
        gallery: p.gallery,
        video: p.video,
        categories: p.categories.map(c => c.name),
        categoryIds: p.categories.map(c => c.id),
        veg: p.isPureVeg,
        bestseller: p.isBestSeller,
        popular: p.isFeatured,
        isNew: p.isNewArrival,
        available: p.available,
        variants: p.variants,
        
        // Extended attributes
        ingredients: p.ingredients,
        shelfLife: p.shelfLife,
        storageInstructions: p.storageInstructions,
        prepType: p.prepType,
        fssaiNumber: p.fssaiNumber,
        manufacturer: p.manufacturer,
        manufactureDate: p.manufactureDate,
        expiryDate: p.expiryDate,
        countryOfOrigin: p.countryOfOrigin,
        tags: p.tags,
        
        // SEO
        slug: p.slug,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,

        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      };
    });

    res.status(200).json({
      success: true,
      items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get details for a single product (including variants, Q&A, and reviews)
export const getMenuItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
        variants: { where: { active: true }, orderBy: { price: "asc" } },
        reviews: { where: { status: "approved" }, orderBy: { createdAt: "desc" } }
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categories, // stringified JSON array or comma separated category IDs
      tags, // stringified JSON array of tags
      bestseller,
      featured,
      trending,
      newArrival,
      festivalSpecial,
      limitedEdition,
      comingSoon,
      available,
      
      // Attributes
      ingredients = "",
      shelfLife = "",
      storageInstructions = "",
      prepType = "",
      isPureVeg = true,
      fssaiNumber = "",
      manufacturer = "",
      manufactureDate = "",
      expiryDate = "",
      countryOfOrigin = "India",

      // SEO
      slug,
      metaTitle = "",
      metaDescription = "",

      // Variants
      variants // stringified JSON array of [{ weight, price, discount, stock, sku }]
    } = req.body;

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Product name and description are required" });
    }

    // Check images uploads
    let mainImageUrl = "";
    const galleryUrls = [];

    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, "anand_vihar_products", "image");
        mainImageUrl = uploadResult.secure_url;
        galleryUrls.push(mainImageUrl);
      }
      if (req.files.gallery) {
        for (const file of req.files.gallery) {
          const uploadResult = await uploadToCloudinary(file.buffer, "anand_vihar_products", "image");
          galleryUrls.push(uploadResult.secure_url);
        }
      }
    }

    if (!mainImageUrl) {
      return res.status(400).json({ success: false, message: "Main image is required for products" });
    }

    // Parse category IDs
    let catIds = [];
    if (categories) {
      try {
        catIds = JSON.parse(categories);
      } catch {
        catIds = categories.split(",").map(c => c.trim());
      }
    }

    // Parse Tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map(t => t.trim());
      }
    }

    // Parse Variants
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = JSON.parse(variants);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid variants JSON format." });
      }
    }

    if (parsedVariants.length === 0) {
      return res.status(400).json({ success: false, message: "At least one weight variant is required." });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).substring(2, 6);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        image: mainImageUrl,
        gallery: galleryUrls,
        slug: generatedSlug,
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || description.substring(0, 150),
        isBestSeller: bestseller === "true" || bestseller === true,
        isFeatured: featured === "true" || featured === true,
        isTrending: trending === "true" || trending === true,
        isNewArrival: newArrival === "true" || newArrival === true,
        isFestivalSpecial: festivalSpecial === "true" || festivalSpecial === true,
        isLimitedEdition: limitedEdition === "true" || limitedEdition === true,
        isComingSoon: comingSoon === "true" || comingSoon === true,
        available: available === "true" || available === true || available === undefined,

        // Attributes
        ingredients,
        shelfLife,
        storageInstructions,
        prepType,
        isPureVeg: isPureVeg === "true" || isPureVeg === true || isPureVeg === undefined,
        fssaiNumber,
        manufacturer,
        manufactureDate,
        expiryDate,
        countryOfOrigin,
        tags: parsedTags,

        // Categories relation
        categories: {
          connect: catIds.map(id => ({ id }))
        },

        // Variants nested creation
        variants: {
          create: parsedVariants.map(v => ({
            weight: v.weight,
            price: parseFloat(v.price),
            discount: parseFloat(v.discount || 0.0),
            stock: parseInt(v.stock || 0),
            sku: v.sku || "",
            active: true
          }))
        }
      },
      include: {
        categories: true,
        variants: true
      }
    });

    res.status(201).json({ success: true, message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      categories,
      tags,
      bestseller,
      featured,
      trending,
      newArrival,
      festivalSpecial,
      limitedEdition,
      comingSoon,
      available,

      // Attributes
      ingredients,
      shelfLife,
      storageInstructions,
      prepType,
      isPureVeg,
      fssaiNumber,
      manufacturer,
      manufactureDate,
      expiryDate,
      countryOfOrigin,

      // SEO
      slug,
      metaTitle,
      metaDescription,

      // Variants
      variants
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true }
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (bestseller !== undefined) updateData.isBestSeller = bestseller === "true" || bestseller === true;
    if (featured !== undefined) updateData.isFeatured = featured === "true" || featured === true;
    if (trending !== undefined) updateData.isTrending = trending === "true" || trending === true;
    if (newArrival !== undefined) updateData.isNewArrival = newArrival === "true" || newArrival === true;
    if (festivalSpecial !== undefined) updateData.isFestivalSpecial = festivalSpecial === "true" || festivalSpecial === true;
    if (limitedEdition !== undefined) updateData.isLimitedEdition = limitedEdition === "true" || limitedEdition === true;
    if (comingSoon !== undefined) updateData.isComingSoon = comingSoon === "true" || comingSoon === true;
    if (available !== undefined) updateData.available = available === "true" || available === true;

    // Attributes
    if (ingredients !== undefined) updateData.ingredients = ingredients;
    if (shelfLife !== undefined) updateData.shelfLife = shelfLife;
    if (storageInstructions !== undefined) updateData.storageInstructions = storageInstructions;
    if (prepType !== undefined) updateData.prepType = prepType;
    if (isPureVeg !== undefined) updateData.isPureVeg = isPureVeg === "true" || isPureVeg === true;
    if (fssaiNumber !== undefined) updateData.fssaiNumber = fssaiNumber;
    if (manufacturer !== undefined) updateData.manufacturer = manufacturer;
    if (manufactureDate !== undefined) updateData.manufactureDate = manufactureDate;
    if (expiryDate !== undefined) updateData.expiryDate = expiryDate;
    if (countryOfOrigin !== undefined) updateData.countryOfOrigin = countryOfOrigin;

    // SEO
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (slug !== undefined) updateData.slug = slug;

    // Categories relation
    if (categories !== undefined) {
      let catIds = [];
      try {
        catIds = JSON.parse(categories);
      } catch {
        catIds = categories.split(",").map(c => c.trim()).filter(Boolean);
      }
      updateData.categories = {
        set: catIds.map(id => ({ id }))
      };
    }

    // Tags
    if (tags !== undefined) {
      let parsedTags = [];
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      }
      updateData.tags = parsedTags;
    }

    // Images updates
    if (req.files) {
      const newGallery = [];
      if (req.files.image && req.files.image[0]) {
        // delete old main image from Cloudinary
        await deleteFromCloudinary(product.image).catch(() => {});
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, "anand_vihar_products", "image");
        updateData.image = uploadResult.secure_url;
        newGallery.push(uploadResult.secure_url);
      }

      if (req.files.gallery) {
        for (const file of req.files.gallery) {
          const uploadResult = await uploadToCloudinary(file.buffer, "anand_vihar_products", "image");
          newGallery.push(uploadResult.secure_url);
        }
      }

      if (newGallery.length > 0) {
        updateData.gallery = newGallery;
      }
    }

    // Update variants
    if (variants !== undefined) {
      let parsedVariants = [];
      try {
        parsedVariants = JSON.parse(variants);
      } catch {
        return res.status(400).json({ success: false, message: "Invalid variants JSON format." });
      }

      if (parsedVariants.length > 0) {
        // Drop existing variants and write new ones
        await prisma.productVariant.deleteMany({
          where: { productId: id }
        });

        updateData.variants = {
          create: parsedVariants.map(v => ({
            weight: v.weight,
            price: parseFloat(v.price),
            discount: parseFloat(v.discount || 0.0),
            stock: parseInt(v.stock || 0),
            sku: v.sku || "",
            active: true
          }))
        };
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        variants: true
      }
    });

    res.status(200).json({ success: true, message: "Product updated successfully", product: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Clean images
    await deleteFromCloudinary(product.image).catch(() => {});
    for (const img of product.gallery) {
      if (img !== product.image) {
        await deleteFromCloudinary(img).catch(() => {});
      }
    }

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteMenuItems = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, message: "Please provide an array of item IDs" });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: ids } }
    });

    for (const p of products) {
      await deleteFromCloudinary(p.image).catch(() => {});
    }

    await prisma.product.deleteMany({
      where: { id: { in: ids } }
    });

    res.status(200).json({ success: true, message: "Products bulk deleted successfully" });
  } catch (error) {
    next(error);
  }
};
