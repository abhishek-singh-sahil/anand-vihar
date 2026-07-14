import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    reservationsEnabled: {
      type: Boolean,
      default: true,
    },
    orderingEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
