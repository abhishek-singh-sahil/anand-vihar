import { prisma } from "../config/db.js";

// Ask a question (User)
export const askQuestion = async (req, res) => {
  try {
    const { productId, question, name } = req.body;
    const userId = req.user.id;

    if (!productId || !question || !name) {
      return res.status(400).json({ success: false, message: "Product, question text, and display name are required." });
    }

    const newQuestion = await prisma.productQuestion.create({
      data: {
        productId,
        userId,
        name,
        question,
        isPublic: false
      }
    });

    return res.status(201).json({ success: true, message: "Your question has been submitted and is pending moderation.", data: newQuestion });
  } catch (error) {
    console.error("Error in askQuestion:", error);
    return res.status(500).json({ success: false, message: "Server error submitting question." });
  }
};

// Answer a question (Admin)
export const answerQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, isPublic = true } = req.body;

    if (answer === undefined) {
      return res.status(400).json({ success: false, message: "Answer text is required." });
    }

    const updated = await prisma.productQuestion.update({
      where: { id },
      data: {
        answer,
        isPublic: Boolean(isPublic)
      }
    });

    return res.status(200).json({ success: true, message: "Question answered and updated.", data: updated });
  } catch (error) {
    console.error("Error in answerQuestion:", error);
    return res.status(500).json({ success: false, message: "Server error answering question." });
  }
};

// Get public questions for a single product (Public)
export const getProductQuestions = async (req, res) => {
  try {
    const { productId } = req.params;

    const questions = await prisma.productQuestion.findMany({
      where: {
        productId,
        isPublic: true
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Error in getProductQuestions:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving questions." });
  }
};

// Get all questions (Admin only)
export const getAllQuestionsForAdmin = async (req, res) => {
  try {
    const questions = await prisma.productQuestion.findMany({
      include: {
        product: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return res.status(200).json({ success: true, data: questions });
  } catch (error) {
    console.error("Error in getAllQuestionsForAdmin:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving questions for admin." });
  }
};

// Delete a question (Admin)
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.productQuestion.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Question deleted successfully." });
  } catch (error) {
    console.error("Error in deleteQuestion:", error);
    return res.status(500).json({ success: false, message: "Server error deleting question." });
  }
};
