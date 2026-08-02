import { prisma } from "../config/db.js";

// Get current system settings
export const getSettings = async (req, res, next) => {
  try {
    const list = await prisma.setting.findMany();
    const settingsObj = {};
    
    list.forEach(item => {
      if (item.value === "true") {
        settingsObj[item.key] = true;
      } else if (item.value === "false") {
        settingsObj[item.key] = false;
      } else {
        settingsObj[item.key] = item.value;
      }
    });

    // Provide default fallback values if empty
    if (settingsObj.reservationsEnabled === undefined) settingsObj.reservationsEnabled = false; // default off for sweet shop
    if (settingsObj.orderingEnabled === undefined) settingsObj.orderingEnabled = true; // default on for e-commerce
    if (settingsObj.whatsappNumber === undefined) settingsObj.whatsappNumber = "+919934190109";
    if (settingsObj.shopName === undefined) settingsObj.shopName = "Anand Vihar Sweet Shop";
    if (settingsObj.homeNotificationText === undefined) settingsObj.homeNotificationText = "";
    if (settingsObj.homeNotificationEnabled === undefined) settingsObj.homeNotificationEnabled = false;

    return res.status(200).json({
      success: true,
      settings: settingsObj,
    });
  } catch (error) {
    next(error);
  }
};

// Update settings (Admin only)
export const updateSettings = async (req, res, next) => {
  try {
    const body = req.body;
    
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        const valStr = String(body[key]);
        await prisma.setting.upsert({
          where: { key },
          update: { value: valStr },
          create: { key, value: valStr }
        });
      }
    }

    const list = await prisma.setting.findMany();
    const settingsObj = {};
    list.forEach(item => {
      if (item.value === "true") {
        settingsObj[item.key] = true;
      } else if (item.value === "false") {
        settingsObj[item.key] = false;
      } else {
        settingsObj[item.key] = item.value;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings: settingsObj,
    });
  } catch (error) {
    next(error);
  }
};
