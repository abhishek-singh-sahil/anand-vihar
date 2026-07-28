import { prisma } from "../config/db.js";

// Get all PIN code zones (with search, pagination, filter)
export const getPinCodeZones = async (req, res) => {
  try {
    const { search, active, page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { areaName: { contains: search, mode: "insensitive" } }
      ];
    }
    if (active !== undefined) {
      where.active = active === "true";
    }

    const zones = await prisma.pinCodeZone.findMany({
      where,
      skip,
      take: parseInt(limit),
      orderBy: { code: "asc" }
    });

    const total = await prisma.pinCodeZone.count({ where });

    return res.status(200).json({
      success: true,
      data: zones,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error in getPinCodeZones:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving delivery zones." });
  }
};

// Create a single PIN code zone
export const createPinCodeZone = async (req, res) => {
  try {
    const { code, areaName = "", deliveryCharge, deliveryTime = "Same Day", active = true } = req.body;
    if (!code || deliveryCharge === undefined) {
      return res.status(400).json({ success: false, message: "PIN Code and Delivery Charge are required." });
    }

    const existing = await prisma.pinCodeZone.findUnique({
      where: { code: String(code) }
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "PIN Code already exists." });
    }

    const zone = await prisma.pinCodeZone.create({
      data: {
        code: String(code),
        areaName,
        deliveryCharge: parseFloat(deliveryCharge),
        deliveryTime,
        active: Boolean(active)
      }
    });

    return res.status(201).json({ success: true, message: "Delivery zone created successfully.", data: zone });
  } catch (error) {
    console.error("Error in createPinCodeZone:", error);
    return res.status(500).json({ success: false, message: "Server error creating delivery zone." });
  }
};

// Bulk add/import PIN code zones (supports raw paste "PIN - CHARGE" format)
export const bulkCreatePinCodeZones = async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText) {
      return res.status(400).json({ success: false, message: "Please provide the text data to parse." });
    }

    const lines = rawText.split(/\r?\n/);
    const parsedData = [];

    // Parse each line: e.g. "825409 - 40", "825410-60", "825411  -  80" or CSV "825409, 40"
    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Match "PIN - CHARGE" or "PIN, CHARGE" or "PIN CHARGE"
      const match = line.match(/^(\d+)\s*[-,\s]\s*(\d+(?:\.\d+)?)(?:\s*-\s*(.+))?$/) || 
                    line.match(/^(\d+)\s+([0-9.]+)(?:\s+(.+))?$/);
                    
      if (match) {
        const code = match[1].trim();
        const charge = parseFloat(match[2]);
        const areaName = match[3] ? match[3].trim() : "";
        if (code && !isNaN(charge)) {
          parsedData.push({ code, charge, areaName });
        }
      }
    }

    if (parsedData.length === 0) {
      return res.status(400).json({ success: false, message: "No valid PIN Code records could be parsed. Expected format: 'PIN - CHARGE' or 'PIN, CHARGE' per line." });
    }

    // Upsert each parsed record to prevent collisions
    let upsertCount = 0;
    for (const record of parsedData) {
      await prisma.pinCodeZone.upsert({
        where: { code: record.code },
        update: {
          deliveryCharge: record.charge,
          areaName: record.areaName || undefined,
          active: true
        },
        create: {
          code: record.code,
          areaName: record.areaName,
          deliveryCharge: record.charge,
          deliveryTime: "Same Day",
          active: true
        }
      });
      upsertCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${upsertCount} PIN Code delivery zones.`
    });
  } catch (error) {
    console.error("Error in bulkCreatePinCodeZones:", error);
    return res.status(500).json({ success: false, message: "Server error processing bulk import." });
  }
};

// Update a PIN code zone
export const updatePinCodeZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, areaName, deliveryCharge, deliveryTime, active } = req.body;

    const data = {};
    if (code !== undefined) data.code = String(code);
    if (areaName !== undefined) data.areaName = areaName;
    if (deliveryCharge !== undefined) data.deliveryCharge = parseFloat(deliveryCharge);
    if (deliveryTime !== undefined) data.deliveryTime = deliveryTime;
    if (active !== undefined) data.active = Boolean(active);

    const updated = await prisma.pinCodeZone.update({
      where: { id },
      data
    });

    return res.status(200).json({ success: true, message: "Delivery zone updated.", data: updated });
  } catch (error) {
    console.error("Error in updatePinCodeZone:", error);
    return res.status(500).json({ success: false, message: "Server error updating delivery zone." });
  }
};

// Delete a PIN code zone
export const deletePinCodeZone = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pinCodeZone.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Delivery zone deleted successfully." });
  } catch (error) {
    console.error("Error in deletePinCodeZone:", error);
    return res.status(500).json({ success: false, message: "Server error deleting delivery zone." });
  }
};

// Lookup single PIN code charge (For Checkout)
export const checkPinCodeAvailability = async (req, res) => {
  try {
    const { code } = req.params;
    const zone = await prisma.pinCodeZone.findUnique({
      where: { code: String(code) }
    });

    if (!zone || !zone.active) {
      return res.status(404).json({
        success: false,
        message: "Sorry, Delivery is not available in your area."
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: zone.code,
        areaName: zone.areaName,
        deliveryCharge: zone.deliveryCharge,
        deliveryTime: zone.deliveryTime
      }
    });
  } catch (error) {
    console.error("Error in checkPinCodeAvailability:", error);
    return res.status(500).json({ success: false, message: "Server error checking PIN Code." });
  }
};

// Get all active PIN codes for public dropdown lists
export const getPublicPinCodes = async (req, res) => {
  try {
    const zones = await prisma.pinCodeZone.findMany({
      where: { active: true },
      orderBy: { code: "asc" }
    });
    return res.status(200).json({ success: true, data: zones });
  } catch (error) {
    console.error("Error in getPublicPinCodes:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving delivery areas." });
  }
};
