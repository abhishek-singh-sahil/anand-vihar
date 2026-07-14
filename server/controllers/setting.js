import Setting from "../models/Setting.js";

// Get current system settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        reservationsEnabled: true,
        orderingEnabled: true,
      });
    }
    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

// Update settings (Admin only)
export const updateSettings = async (req, res, next) => {
  try {
    const { reservationsEnabled, orderingEnabled } = req.body;
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (typeof reservationsEnabled === "boolean") {
      settings.reservationsEnabled = reservationsEnabled;
    }
    if (typeof orderingEnabled === "boolean") {
      settings.orderingEnabled = orderingEnabled;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};
