import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedVideoTypes = ["video/mp4", "video/mpeg", "video/quicktime", "video/webm"];

  if (
    allowedImageTypes.includes(file.mimetype) ||
    allowedVideoTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Only JPEG, PNG, WEBP images and MP4, WEBM, MOV videos are allowed."), false);
  }
};

// Configure size limits: 5MB for images, 30MB for videos
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 35 * 1024 * 1024, // max 35MB overall limit
  },
});
