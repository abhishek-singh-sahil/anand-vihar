import { prisma } from "../config/db.js";

// Fetch reviews for a specific product
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.productReview.findMany({
      where: { productId, status: "approved" },
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// Add review to a product
export const addProductReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment, images } = req.body;
    const userId = req.user.id;
    const name = req.user.name;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required." });
    }

    // Check if user has purchased the item previously (verified purchase badge)
    const orderMatch = await prisma.order.findFirst({
      where: {
        userId,
        status: "delivered",
        items: {
          some: { productId }
        }
      }
    });
    const isVerifiedPurchase = !!orderMatch;

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId,
        name,
        rating: Number(rating),
        comment,
        images: images || [],
        status: "approved", // auto-approved for frictionless user experience
        isVerifiedPurchase
      }
    });

    res.status(201).json({ success: true, message: "Review added successfully!", review });
  } catch (error) {
    next(error);
  }
};

// Toggle like on a review
export const likeProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await prisma.productReview.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    let updatedLikes = [...review.likes];
    const index = updatedLikes.indexOf(userId);
    if (index === -1) {
      updatedLikes.push(userId);
    } else {
      updatedLikes.splice(index, 1);
    }

    const updated = await prisma.productReview.update({
      where: { id },
      data: { likes: updatedLikes }
    });

    res.status(200).json({ success: true, likes: updated.likes });
  } catch (error) {
    next(error);
  }
};

// Reply to a review
export const replyToProductReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const name = req.user.name;

    if (!text) {
      return res.status(400).json({ success: false, message: "Reply text is required." });
    }

    const review = await prisma.productReview.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    let repliesList = review.replies;
    if (typeof repliesList === "string") {
      repliesList = JSON.parse(repliesList);
    }
    if (!Array.isArray(repliesList)) {
      repliesList = [];
    }

    repliesList.push({
      _id: Math.random().toString(36).substr(2, 9),
      name,
      text,
      createdAt: new Date()
    });

    const updated = await prisma.productReview.update({
      where: { id },
      data: { replies: repliesList }
    });

    res.status(200).json({ success: true, replies: updated.replies });
  } catch (error) {
    next(error);
  }
};

// Admin list reviews for moderation
export const adminGetReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.productReview.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true }
    });

    const mapped = reviews.map(r => ({
      ...r,
      productName: r.product ? r.product.name : "Deleted Product"
    }));

    res.status(200).json({ success: true, reviews: mapped });
  } catch (error) {
    next(error);
  }
};

// Admin update review status
export const adminUpdateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved, pending, rejected

    const review = await prisma.productReview.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, message: "Review status updated", review });
  } catch (error) {
    next(error);
  }
};

// Admin delete review
export const adminDeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.productReview.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
