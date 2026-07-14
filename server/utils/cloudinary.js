import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

// Configure Cloudinary dynamically when called to avoid ES Module dotenv import timing issues
const configureCloudinary = () => {
  if (isConfigured) return true;
  
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== "dummy_cloudinary_cloud_name" &&
    process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_name"
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    isConfigured = true;
    return true;
  }
  return false;
};

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @param {string} resourceType - image or video
 */
export const uploadToCloudinary = (fileBuffer, folder = "anand_vihar", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    const configured = configureCloudinary();

    // If not configured, mock upload URL
    if (!configured) {
      console.warn("⚠️ Mocking Cloudinary upload due to missing configuration.");
      const randomId = Math.random().toString(36).substring(7);
      const ext = resourceType === "video" ? "mp4" : "jpg";
      return resolve({
        secure_url: `/assets/mock-uploads/${folder}/${randomId}.${ext}`,
        public_id: `${folder}/${randomId}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete asset from Cloudinary
 * @param {string} url 
 */
export const deleteFromCloudinary = async (url) => {
  try {
    if (!url || !url.includes("cloudinary.com")) return;
    
    const configured = configureCloudinary();
    if (!configured) return;
    
    // Extract public_id from url
    const parts = url.split("/");
    const filenameWithExt = parts.pop();
    const folder = parts.pop(); // e.g. anand_vihar
    const publicId = `${folder}/${filenameWithExt.split(".")[0]}`;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
};
