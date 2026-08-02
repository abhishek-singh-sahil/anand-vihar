import { prisma } from "../config/db.js";

/**
 * Extracts the 11-character YouTube video ID from various link structures.
 */
const extractYoutubeVideoId = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : "";
};

/**
 * Public: Get all YouTube videos.
 */
export const getVideos = async (req, res, next) => {
  try {
    const videos = await prisma.youtubeVideo.findMany({
      orderBy: { displayOrder: "asc" }
    });
    return res.status(200).json({ success: true, videos });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create a new YouTube video entry.
 */
export const createVideo = async (req, res, next) => {
  try {
    const { title, videoUrl, description, displayOrder } = req.body;
    if (!title || !videoUrl) {
      return res.status(400).json({ success: false, message: "Title and YouTube Video URL are required." });
    }

    const videoId = extractYoutubeVideoId(videoUrl);
    if (!videoId) {
      return res.status(400).json({ success: false, message: "Invalid YouTube URL format. Could not extract Video ID." });
    }

    const video = await prisma.youtubeVideo.create({
      data: {
        title,
        videoUrl,
        videoId,
        description: description || "",
        displayOrder: parseInt(displayOrder) || 0
      }
    });

    return res.status(201).json({ success: true, message: "Video added successfully.", video });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update a YouTube video entry.
 */
export const updateVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, videoUrl, description, displayOrder } = req.body;

    const dataToUpdate = {};
    if (title !== undefined) dataToUpdate.title = title;
    if (description !== undefined) dataToUpdate.description = description;
    if (displayOrder !== undefined) dataToUpdate.displayOrder = parseInt(displayOrder) || 0;

    if (videoUrl !== undefined) {
      const videoId = extractYoutubeVideoId(videoUrl);
      if (!videoId) {
        return res.status(400).json({ success: false, message: "Invalid YouTube URL format." });
      }
      dataToUpdate.videoUrl = videoUrl;
      dataToUpdate.videoId = videoId;
    }

    const video = await prisma.youtubeVideo.update({
      where: { id },
      data: dataToUpdate
    });

    return res.status(200).json({ success: true, message: "Video updated successfully.", video });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a YouTube video entry.
 */
export const deleteVideo = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.youtubeVideo.delete({
      where: { id }
    });
    return res.status(200).json({ success: true, message: "Video deleted successfully." });
  } catch (error) {
    next(error);
  }
};
