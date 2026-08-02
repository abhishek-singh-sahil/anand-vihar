import { prisma } from "../config/db.js";

/**
 * Retrieves the global Google Reviews settings.
 * Creates a default settings entry if none exists.
 */
export const getSettings = async () => {
  let settings = await prisma.googleReviewsSettings.findUnique({
    where: { id: "settings" }
  });
  if (!settings) {
    settings = await prisma.googleReviewsSettings.create({
      data: { id: "settings" }
    });
  }
  return settings;
};

/**
 * Updates the global Google Reviews settings.
 */
export const updateSettings = async (data) => {
  return await prisma.googleReviewsSettings.update({
    where: { id: "settings" },
    data
  });
};

/**
 * Retrieves visible cached reviews, sorting featured reviews first.
 */
export const getVisibleReviews = async (limit = 6) => {
  return await prisma.googleReview.findMany({
    where: { isVisible: true },
    orderBy: [
      { isFeatured: "desc" },
      { displayOrder: "asc" },
      { reviewDate: "desc" }
    ],
    take: limit
  });
};

/**
 * Retrieves all cached reviews for the administrator view, with search, filtering, and pagination.
 */
export const getAllReviews = async (params = {}) => {
  const {
    search = "",
    rating,
    isVisible,
    isFeatured,
    page = 1,
    limit = 10
  } = params;

  const where = {};

  // Text search
  if (search) {
    where.OR = [
      { reviewerName: { contains: search, mode: "insensitive" } },
      { reviewText: { contains: search, mode: "insensitive" } }
    ];
  }

  // Rating filter
  if (rating !== undefined && rating !== "") {
    where.rating = parseInt(rating);
  }

  // Visibility filter
  if (isVisible !== undefined && isVisible !== "") {
    where.isVisible = isVisible === true || isVisible === "true";
  }

  // Featured filter
  if (isFeatured !== undefined && isFeatured !== "") {
    where.isFeatured = isFeatured === true || isFeatured === "true";
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [reviews, total] = await Promise.all([
    prisma.googleReview.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" },
        { displayOrder: "asc" },
        { reviewDate: "desc" }
      ],
      skip,
      take
    }),
    prisma.googleReview.count({ where })
  ]);

  // Gather dashboard metrics
  const [featuredCount, hiddenCount] = await Promise.all([
    prisma.googleReview.count({ where: { isFeatured: true } }),
    prisma.googleReview.count({ where: { isVisible: false } })
  ]);

  return {
    reviews,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      totalPages: Math.ceil(total / take)
    },
    metrics: {
      featuredCount,
      hiddenCount
    }
  };
};

/**
 * Deduplicates and updates/inserts review content based on unique Google reviewId.
 */
export const upsertReview = async (reviewData) => {
  const { reviewId } = reviewData;
  return await prisma.googleReview.upsert({
    where: { reviewId },
    update: {
      reviewerName: reviewData.reviewerName,
      reviewerPhoto: reviewData.reviewerPhoto,
      reviewerProfileUrl: reviewData.reviewerProfileUrl,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      reviewDate: reviewData.reviewDate,
      updatedDate: reviewData.updatedDate,
      language: reviewData.language,
      syncedAt: new Date()
    },
    create: {
      ...reviewData,
      isVisible: true,
      isFeatured: false,
      displayOrder: 0,
      syncedAt: new Date()
    }
  });
};

/**
 * Updates status fields of a review (e.g., isVisible, isFeatured, displayOrder).
 */
export const updateReview = async (id, data) => {
  return await prisma.googleReview.update({
    where: { id },
    data
  });
};
