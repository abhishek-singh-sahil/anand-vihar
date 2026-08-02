import * as repo from "../repositories/googleReviewRepository.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import https from "https";

/**
 * Promise-based HTTPS request helper.
 */
const makeRequest = (url, method = "GET", body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      method,
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        "Accept": "application/json",
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
        req.write(new URLSearchParams(body).toString());
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
};

/**
 * Generates Google OAuth redirection URL.
 */
export const getOAuthUrl = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    throw new Error("GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI not configured in server environment.");
  }

  const scopes = "https://www.googleapis.com/auth/business.manage";
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(
    scopes
  )}&access_type=offline&prompt=consent`;
};

/**
 * Exchanges OAuth authorization code for Google Access/Refresh tokens.
 */
export const exchangeCodeForTokens = async (code) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth credentials missing from environment.");
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const params = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code"
  };

  const response = await makeRequest(tokenUrl, "POST", params, {
    "Content-Type": "application/x-www-form-urlencoded"
  });

  if (response.status !== 200) {
    throw new Error(`Token exchange failed with status ${response.status}: ${JSON.stringify(response.body)}`);
  }

  const tokens = response.body;
  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token || ""; // Only returned on first consent
  const expiresSeconds = tokens.expires_in || 3600;
  const tokenExpiry = new Date(Date.now() + expiresSeconds * 1000);

  // Retrieve Business Profile Information to map Account ID and Location ID
  const { accountId, locationId, businessName } = await fetchAccountAndLocationDetails(accessToken);

  const encryptedAccess = encrypt(accessToken);
  const encryptedRefresh = refreshToken ? encrypt(refreshToken) : undefined;

  const updateData = {
    accessToken: encryptedAccess,
    tokenExpiry,
    googleAccountId: accountId,
    googleLocationId: locationId,
    businessName,
    isConnected: true
  };

  if (encryptedRefresh) {
    updateData.refreshToken = encryptedRefresh;
  }

  return await repo.updateSettings(updateData);
};

/**
 * Queries account and location properties using access token.
 */
const fetchAccountAndLocationDetails = async (accessToken) => {
  const headers = { Authorization: `Bearer ${accessToken}` };
  
  // 1. Fetch Accounts
  const accountUrl = "https://mybusinessbusinessinformation.googleapis.com/v1/accounts";
  const accountRes = await makeRequest(accountUrl, "GET", null, headers);
  if (accountRes.status !== 200) {
    throw new Error(`Failed to fetch Business accounts: ${JSON.stringify(accountRes.body)}`);
  }

  const accounts = accountRes.body.accounts || [];
  if (accounts.length === 0) {
    throw new Error("No Google Business accounts linked to this Google Profile.");
  }

  const account = accounts[0];
  const accountName = account.name; // e.g. "accounts/123456"

  // 2. Fetch Locations
  const locationUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title,storefrontAddress`;
  const locationRes = await makeRequest(locationUrl, "GET", null, headers);
  if (locationRes.status !== 200) {
    throw new Error(`Failed to fetch Business locations: ${JSON.stringify(locationRes.body)}`);
  }

  const locations = locationRes.body.locations || [];
  if (locations.length === 0) {
    throw new Error("No storefront locations found in this Business account.");
  }

  const location = locations[0];
  const locationName = location.name; // e.g. "accounts/123/locations/456"
  const businessName = location.title || "My Business Store";

  const accountId = accountName.split("/")[1];
  const locationId = locationName.split("/")[3];

  return { accountId, locationId, businessName };
};

/**
 * Handles automatic refresh of OAuth tokens if expired.
 */
export const refreshTokensIfExpired = async () => {
  const settings = await repo.getSettings();
  if (!settings.isConnected || !settings.refreshToken) return null;

  // Check if token is expired or expiring in next 5 minutes
  const isExpiring = settings.tokenExpiry && new Date(settings.tokenExpiry).getTime() - Date.now() < 5 * 60 * 1000;
  if (!isExpiring && settings.accessToken) {
    return decrypt(settings.accessToken);
  }

  console.log("⏳ Google Access Token is expired. Refreshing...");

  const decryptedRefresh = decrypt(settings.refreshToken);
  if (!decryptedRefresh) {
    throw new Error("Refresh token decryption failed.");
  }

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const params = {
    refresh_token: decryptedRefresh,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token"
  };

  const response = await makeRequest(tokenUrl, "POST", params, {
    "Content-Type": "application/x-www-form-urlencoded"
  });

  if (response.status !== 200) {
    // If the grant is invalid (disconnected by user), mark settings as disconnected
    if (response.status === 400 && response.body?.error === "invalid_grant") {
      await repo.updateSettings({ isConnected: false });
    }
    throw new Error(`Refresh token failed: ${JSON.stringify(response.body)}`);
  }

  const newTokens = response.body;
  const newAccessToken = newTokens.access_token;
  const expiresSeconds = newTokens.expires_in || 3600;
  const tokenExpiry = new Date(Date.now() + expiresSeconds * 1000);

  await repo.updateSettings({
    accessToken: encrypt(newAccessToken),
    tokenExpiry
  });

  return newAccessToken;
};

/**
 * Disconnects the Google Business account, wiping tokens.
 */
export const disconnectGoogleAccount = async () => {
  return await repo.updateSettings({
    isConnected: false,
    accessToken: "",
    refreshToken: "",
    tokenExpiry: null,
    businessName: "",
    googleAccountId: "",
    googleLocationId: ""
  });
};

const starRatingMap = {
  "ONE": 1,
  "TWO": 2,
  "THREE": 3,
  "FOUR": 4,
  "FIVE": 5
};

/**
 * Pulls reviews from Google Business Profile API and caches them.
 */
export const fetchAndSyncReviews = async () => {
  try {
    const settings = await repo.getSettings();
    if (!settings.isConnected) {
      return { success: false, message: "Google Business Profile not connected." };
    }

    const accessToken = await refreshTokensIfExpired();
    if (!accessToken) {
      return { success: false, message: "Could not retrieve access token." };
    }

    const accountId = settings.googleAccountId;
    const locationId = settings.googleLocationId;

    console.log(`⏳ Fetching Google Business reviews for account ${accountId}, location ${locationId}...`);

    // Fetch reviews from official Google My Business Reviews API
    const url = `https://mybusinessreviews.googleapis.com/v1/accounts/${accountId}/locations/${locationId}/reviews`;
    const response = await makeRequest(url, "GET", null, {
      Authorization: `Bearer ${accessToken}`
    });

    if (response.status !== 200) {
      throw new Error(`Google Reviews API returned status ${response.status}: ${JSON.stringify(response.body)}`);
    }

    const reviews = response.body.reviews || [];
    const averageRating = response.body.averageRating || 0.0;
    const totalReviews = response.body.totalReviewCount || 0;

    let upsertCount = 0;
    for (const r of reviews) {
      const reviewDate = r.createTime ? new Date(r.createTime) : new Date();
      const updatedDate = r.updateTime ? new Date(r.updateTime) : null;
      
      const rating = starRatingMap[r.starRating] || 5;

      const reviewData = {
        reviewId: r.reviewId,
        reviewerName: r.reviewer?.displayName || "Google Reviewer",
        reviewerPhoto: r.reviewer?.profilePhotoUrl || "",
        reviewerProfileUrl: r.reviewer?.profilePhotoUrl ? r.reviewer.profilePhotoUrl : "",
        rating,
        reviewText: r.comment || "",
        reviewDate,
        updatedDate,
        language: "en"
      };

      await repo.upsertReview(reviewData);
      upsertCount++;
    }

    // Save statistics in settings
    await repo.updateSettings({
      averageRating,
      totalReviews,
      lastSyncedAt: new Date()
    });

    console.log(`✅ Google OAuth Reviews Sync complete. Synced ${upsertCount} records.`);
    return { success: true, message: `Synced successfully. Cached ${upsertCount} reviews.`, stats: { averageRating, totalReviews } };

  } catch (err) {
    console.error("❌ Google Reviews OAuth Sync failed:", err.message);
    return { success: false, message: err.message };
  }
};

let schedulerInterval = null;

/**
 * Starts background reviews auto-sync.
 */
export const startScheduler = () => {
  if (schedulerInterval) return;

  console.log("⏳ Starting Google Reviews Sync Scheduler (OAuth)...");

  // Initial eligibility check on boot
  const runInitialCheck = async () => {
    try {
      const settings = await repo.getSettings();
      if (!settings.enabled || !settings.isConnected) return;

      const lastSynced = settings.lastSyncedAt ? new Date(settings.lastSyncedAt) : null;
      const hoursSinceLastSync = lastSynced ? (new Date() - lastSynced) / (1000 * 60 * 60) : 9999;

      if (hoursSinceLastSync >= settings.syncInterval) {
        console.log(`🔄 Startup trigger: ${hoursSinceLastSync.toFixed(1)} hours since last sync. Syncing...`);
        await fetchAndSyncReviews();
      }
    } catch (err) {
      console.error("OAuth scheduler startup check error:", err.message);
    }
  };
  runInitialCheck();

  // Hourly sync eligibility runner
  schedulerInterval = setInterval(async () => {
    try {
      const settings = await repo.getSettings();
      if (!settings.enabled || !settings.isConnected) return;

      const lastSynced = settings.lastSyncedAt ? new Date(settings.lastSyncedAt) : null;
      const hoursSinceLastSync = lastSynced ? (new Date() - lastSynced) / (1000 * 60 * 60) : 9999;

      if (hoursSinceLastSync >= settings.syncInterval) {
        console.log(`🔄 Scheduled trigger: ${hoursSinceLastSync.toFixed(1)} hours since last sync. Syncing...`);
        await fetchAndSyncReviews();
      }
    } catch (err) {
      console.error("OAuth scheduler periodic check error:", err.message);
    }
  }, 60 * 60 * 1000); // Check once every hour
};
