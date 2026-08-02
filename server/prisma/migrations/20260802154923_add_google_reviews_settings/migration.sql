-- CreateTable
CREATE TABLE "GoogleReviewsSettings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "googleAccountId" TEXT NOT NULL DEFAULT '',
    "googleLocationId" TEXT NOT NULL DEFAULT '',
    "googlePlaceId" TEXT NOT NULL DEFAULT '',
    "googleMapsUrl" TEXT NOT NULL DEFAULT '',
    "googleReviewUrl" TEXT NOT NULL DEFAULT '',
    "syncInterval" INTEGER NOT NULL DEFAULT 24,
    "limitCount" INTEGER NOT NULL DEFAULT 6,
    "showPhoto" BOOLEAN NOT NULL DEFAULT true,
    "showDate" BOOLEAN NOT NULL DEFAULT true,
    "showRating" BOOLEAN NOT NULL DEFAULT true,
    "showOverallRating" BOOLEAN NOT NULL DEFAULT true,
    "showTotalReviews" BOOLEAN NOT NULL DEFAULT true,
    "enableWriteBtn" BOOLEAN NOT NULL DEFAULT true,
    "enableViewAllBtn" BOOLEAN NOT NULL DEFAULT true,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "lastSyncedAt" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL DEFAULT '',
    "refreshToken" TEXT NOT NULL DEFAULT '',
    "tokenExpiry" TIMESTAMP(3),
    "businessName" TEXT NOT NULL DEFAULT '',
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReviewsSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerPhoto" TEXT NOT NULL DEFAULT '',
    "reviewerProfileUrl" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "reviewDate" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleReview_reviewId_key" ON "GoogleReview"("reviewId");
