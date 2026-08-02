import * as repo from "../repositories/googleReviewRepository.js";
import * as service from "../services/googleReviewService.js";

/**
 * Public endpoint to fetch visible cached reviews mapped to client testimonials format.
 */
export const getApprovedReviews = async (req, res, next) => {
  try {
    const settings = await repo.getSettings();
    if (!settings.enabled) {
      return res.status(200).json({ success: true, testimonials: [], settings });
    }

    const reviews = await repo.getVisibleReviews(settings.limitCount);
    
    // Map GoogleReview schema to Testimonial structure expected by the client
    const testimonials = reviews.map(r => ({
      id: r.id,
      name: r.reviewerName,
      city: r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : "Google Reviewer",
      rating: r.rating,
      review: r.reviewText,
      images: [],
      video: "",
      profilePic: r.reviewerPhoto,
      profileUrl: r.reviewerProfileUrl,
      isFeatured: r.isFeatured,
      displayOrder: r.displayOrder,
      createdAt: r.reviewDate
    }));

    res.status(200).json({ 
      success: true, 
      testimonials,
      settings: {
        enabled: settings.enabled,
        averageRating: settings.averageRating,
        totalReviews: settings.totalReviews,
        googleMapsUrl: settings.googleMapsUrl,
        googleReviewUrl: settings.googleReviewUrl,
        showPhoto: settings.showPhoto,
        showDate: settings.showDate,
        showRating: settings.showRating,
        showOverallRating: settings.showOverallRating,
        showTotalReviews: settings.showTotalReviews,
        enableWriteBtn: settings.enableWriteBtn,
        enableViewAllBtn: settings.enableViewAllBtn
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public endpoint to get Google settings metadata.
 */
export const getReviewsSettings = async (req, res, next) => {
  try {
    const settings = await repo.getSettings();
    res.status(200).json({
      success: true,
      settings: {
        enabled: settings.enabled,
        averageRating: settings.averageRating,
        totalReviews: settings.totalReviews,
        googleMapsUrl: settings.googleMapsUrl,
        googleReviewUrl: settings.googleReviewUrl,
        showPhoto: settings.showPhoto,
        showDate: settings.showDate,
        showRating: settings.showRating,
        showOverallRating: settings.showOverallRating,
        showTotalReviews: settings.showTotalReviews,
        enableWriteBtn: settings.enableWriteBtn,
        enableViewAllBtn: settings.enableViewAllBtn
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to list cached reviews with text search, rating, and status filters.
 */
export const adminGetReviews = async (req, res, next) => {
  try {
    const { search, rating, isVisible, isFeatured, page, limit } = req.query;
    
    const data = await repo.getAllReviews({
      search,
      rating,
      isVisible,
      isFeatured,
      page,
      limit
    });

    res.status(200).json({
      success: true,
      reviews: data.reviews,
      pagination: data.pagination,
      metrics: data.metrics
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to read Google Reviews configurations.
 */
export const adminGetSettings = async (req, res, next) => {
  try {
    const settings = await repo.getSettings();
    
    // Hide token content for safety
    const safeSettings = { ...settings };
    if (safeSettings.accessToken) safeSettings.accessToken = "••••••••";
    if (safeSettings.refreshToken) safeSettings.refreshToken = "••••••••";

    res.status(200).json({ success: true, settings: safeSettings });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to update settings. Restricted to Super Admin.
 */
export const adminUpdateSettings = async (req, res, next) => {
  try {
    // Super Admin security validation
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Super Admin permissions required." });
    }

    const {
      enabled,
      googleAccountId,
      googleLocationId,
      googlePlaceId,
      googleMapsUrl,
      googleReviewUrl,
      syncInterval,
      limitCount,
      showPhoto,
      showDate,
      showRating,
      showOverallRating,
      showTotalReviews,
      enableWriteBtn,
      enableViewAllBtn
    } = req.body;

    const dataToUpdate = {};
    if (enabled !== undefined) dataToUpdate.enabled = enabled === true || enabled === "true";
    if (googleAccountId !== undefined) dataToUpdate.googleAccountId = googleAccountId;
    if (googleLocationId !== undefined) dataToUpdate.googleLocationId = googleLocationId;
    if (googlePlaceId !== undefined) dataToUpdate.googlePlaceId = googlePlaceId;
    if (googleMapsUrl !== undefined) dataToUpdate.googleMapsUrl = googleMapsUrl;
    if (googleReviewUrl !== undefined) dataToUpdate.googleReviewUrl = googleReviewUrl;
    if (syncInterval !== undefined) dataToUpdate.syncInterval = parseInt(syncInterval) || 24;
    if (limitCount !== undefined) dataToUpdate.limitCount = parseInt(limitCount) || 6;
    
    if (showPhoto !== undefined) dataToUpdate.showPhoto = showPhoto === true || showPhoto === "true";
    if (showDate !== undefined) dataToUpdate.showDate = showDate === true || showDate === "true";
    if (showRating !== undefined) dataToUpdate.showRating = showRating === true || showRating === "true";
    if (showOverallRating !== undefined) dataToUpdate.showOverallRating = showOverallRating === true || showOverallRating === "true";
    if (showTotalReviews !== undefined) dataToUpdate.showTotalReviews = showTotalReviews === true || showTotalReviews === "true";
    
    if (enableWriteBtn !== undefined) dataToUpdate.enableWriteBtn = enableWriteBtn === true || enableWriteBtn === "true";
    if (enableViewAllBtn !== undefined) dataToUpdate.enableViewAllBtn = enableViewAllBtn === true || enableViewAllBtn === "true";

    const updated = await repo.updateSettings(dataToUpdate);

    res.status(200).json({ success: true, message: "Settings updated successfully", settings: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to toggle cached review visibility, pinning status, or reordering.
 */
export const adminUpdateReview = async (req, res, next) => {
  try {
    // Super Admin security validation
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Super Admin permissions required." });
    }

    const { id } = req.params;
    const { isVisible, isFeatured, displayOrder } = req.body;

    const updateData = {};
    if (isVisible !== undefined) updateData.isVisible = isVisible === true || isVisible === "true";
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === true || isFeatured === "true";
    if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder) || 0;

    const updated = await repo.updateReview(id, updateData);
    res.status(200).json({ success: true, message: "Review updated successfully", review: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to trigger a reviews sync immediately.
 */
export const adminSyncNow = async (req, res, next) => {
  try {
    // Super Admin security validation
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Super Admin permissions required." });
    }

    const syncRes = await service.fetchAndSyncReviews();
    if (syncRes.success) {
      res.status(200).json({ success: true, message: syncRes.message, stats: syncRes.stats });
    } else {
      res.status(400).json({ success: false, message: syncRes.message });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Admin endpoint to generate Google OAuth consent URL.
 */
export const adminGetGoogleOAuthUrl = async (req, res, next) => {
  try {
    const url = service.getOAuthUrl();
    res.status(200).json({ success: true, url });
  } catch (error) {
    next(error);
  }
};

/**
 * Public Google OAuth Redirect Callback.
 */
export const googleOAuthCallback = async (req, res, next) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  try {
    const { code, error } = req.query;

    if (error) {
      console.error("Google OAuth error parameter received:", error);
      return res.redirect(`${clientUrl}/admin/testimonials?error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return res.redirect(`${clientUrl}/admin/testimonials?error=NoCodeProvided`);
    }

    // Exchange auth code for tokens
    await service.exchangeCodeForTokens(code);

    // Sync reviews immediately in background
    service.fetchAndSyncReviews().catch(console.error);

    res.redirect(`${clientUrl}/admin/testimonials?success=connected`);
  } catch (error) {
    console.error("Google OAuth callback exchange failed:", error.message);
    res.redirect(`${clientUrl}/admin/testimonials?error=${encodeURIComponent(error.message)}`);
  }
};

/**
 * Admin endpoint to disconnect the Google Business Account.
 */
export const adminDisconnectGoogle = async (req, res, next) => {
  try {
    // Super Admin security validation
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized. Super Admin permissions required." });
    }

    await service.disconnectGoogleAccount();
    res.status(200).json({ success: true, message: "Google Business account disconnected successfully." });
  } catch (error) {
    next(error);
  }
};
