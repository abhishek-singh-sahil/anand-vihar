import fs from "fs";
import path from "path";

// Helper to determine extension from buffer magic numbers
const getExtension = (buffer, resourceType) => {
  if (buffer && buffer.length > 4) {
    // Check JPEG magic numbers: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return ".jpg";
    // Check PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return ".png";
    // Check GIF: 47 49 46 38
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return ".gif";
    // Check WEBP: RIFF ... WEBP
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return ".webp";
  }
  return resourceType === "video" ? ".mp4" : ".jpg";
};

/**
 * Upload buffer to local server storage
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @param {string} resourceType - image or video
 */
export const uploadToCloudinary = (fileBuffer, folder = "anand_vihar", resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    try {
      const UPLOADS_DIR = path.join(process.cwd(), "uploads");
      
      // Ensure local uploads directory exists
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }

      const ext = getExtension(fileBuffer, resourceType);
      const randomId = Math.random().toString(36).substring(2, 10);
      const filename = `${Date.now()}-${randomId}${ext}`;
      const filePath = path.join(UPLOADS_DIR, filename);

      // Write the file to disk
      fs.writeFileSync(filePath, fileBuffer);

      // Build the server file URL
      const baseUrl = process.env.BASE_URL || "http://localhost:5000";
      const secure_url = `${baseUrl}/uploads/${filename}`;

      resolve({
        secure_url,
        public_id: filename
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete asset from local server storage
 * @param {string} url 
 */
export const deleteFromCloudinary = async (url) => {
  try {
    if (!url) return;
    
    // Extract filename from URL (gets the last part after the slash)
    const parts = url.split("/");
    const filename = parts.pop();
    if (!filename) return;

    const filePath = path.join(process.cwd(), "uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted local file: ${filename}`);
    }
  } catch (error) {
    console.error("Local file delete failed:", error);
  }
};
