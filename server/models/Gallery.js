import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: [true, "Type is required"],
    },
    url: {
      type: String,
      required: [true, "Media URL is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Restaurant", "Sweets", "Interior", "Kitchen", "Festival", "Events"],
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;
