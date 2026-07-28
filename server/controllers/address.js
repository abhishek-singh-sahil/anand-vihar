import { prisma } from "../config/db.js";

export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" }
    });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, phone, state, city, pinCode, houseNumber, street, landmark, isDefault } = req.body;

    if (!fullName || !phone || !state || !city || !pinCode || !houseNumber || !street) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    // If setting as default, unset all others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    // Check if this is the first address, set default if so
    const count = await prisma.address.count({ where: { userId } });
    const shouldBeDefault = count === 0 ? true : !!isDefault;

    const address = await prisma.address.create({
      data: {
        userId,
        fullName,
        phone,
        state,
        city,
        pinCode,
        houseNumber,
        street,
        landmark: landmark || "",
        isDefault: shouldBeDefault
      }
    });

    res.status(201).json({ success: true, message: "Address added successfully", address });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { fullName, phone, state, city, pinCode, houseNumber, street, landmark, isDefault } = req.body;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, NOT: { id } },
        data: { isDefault: false }
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        fullName: fullName !== undefined ? fullName : existing.fullName,
        phone: phone !== undefined ? phone : existing.phone,
        state: state !== undefined ? state : existing.state,
        city: city !== undefined ? city : existing.city,
        pinCode: pinCode !== undefined ? pinCode : existing.pinCode,
        houseNumber: houseNumber !== undefined ? houseNumber : existing.houseNumber,
        street: street !== undefined ? street : existing.street,
        landmark: landmark !== undefined ? landmark : existing.landmark,
        isDefault: isDefault !== undefined ? !!isDefault : existing.isDefault
      }
    });

    res.status(200).json({ success: true, message: "Address updated successfully", address: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await prisma.address.delete({ where: { id } });

    // If we deleted the default, set another one as default if it exists
    if (existing.isDefault) {
      const remaining = await prisma.address.findFirst({
        where: { userId }
      });
      if (remaining) {
        await prisma.address.update({
          where: { id: remaining.id },
          data: { isDefault: true }
        });
      }
    }

    res.status(200).json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false }
    });

    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    res.status(200).json({ success: true, message: "Default address set successfully", address: updated });
  } catch (error) {
    next(error);
  }
};
