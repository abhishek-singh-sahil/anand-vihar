import { prisma } from "../config/db.js";

// Get all offers
export const getOffers = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};
    if (active !== undefined) {
      where.active = active === "true";
    }

    const offers = await prisma.offer.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, data: offers });
  } catch (error) {
    console.error("Error in getOffers:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving offers." });
  }
};

// Create an offer
export const createOffer = async (req, res) => {
  try {
    const { title, description = "", type, value = 0.0, buyQty = 0, getQty = 0, targetType, targetId = null, active = true, startDate, endDate } = req.body;
    if (!title || !type || !targetType) {
      return res.status(400).json({ success: false, message: "Title, offer type, and target type are required." });
    }

    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        type,
        value: parseFloat(value),
        buyQty: parseInt(buyQty),
        getQty: parseInt(getQty),
        targetType,
        targetId,
        active: Boolean(active),
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null
      }
    });

    return res.status(201).json({ success: true, message: "Offer created successfully.", data: offer });
  } catch (error) {
    console.error("Error in createOffer:", error);
    return res.status(500).json({ success: false, message: "Server error creating offer." });
  }
};

// Update an offer
export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, value, buyQty, getQty, targetType, targetId, active, startDate, endDate } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (type !== undefined) data.type = type;
    if (value !== undefined) data.value = parseFloat(value);
    if (buyQty !== undefined) data.buyQty = parseInt(buyQty);
    if (getQty !== undefined) data.getQty = parseInt(getQty);
    if (targetType !== undefined) data.targetType = targetType;
    if (targetId !== undefined) data.targetId = targetId;
    if (active !== undefined) data.active = Boolean(active);
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;

    const updated = await prisma.offer.update({
      where: { id },
      data
    });

    return res.status(200).json({ success: true, message: "Offer updated.", data: updated });
  } catch (error) {
    console.error("Error in updateOffer:", error);
    return res.status(500).json({ success: false, message: "Server error updating offer." });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.offer.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Offer deleted successfully." });
  } catch (error) {
    console.error("Error in deleteOffer:", error);
    return res.status(500).json({ success: false, message: "Server error deleting offer." });
  }
};
