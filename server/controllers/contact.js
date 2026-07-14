import Contact from "../models/Contact.js";
import Subscriber from "../models/Subscriber.js";
import { sendNewsletterConfirmationEmail, sendAdminNotificationEmail } from "../utils/email.js";

// Contact form submissions
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email, and message are required" });
    }

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();

    // Send admin notification email
    await sendAdminNotificationEmail(
      `New Message: ${subject || "Contact Form Inquiry"}`,
      `You have received a new contact message from ${name} (${email}):\n\n"${message}"`
    );

    res.status(201).json({ success: true, message: "Your message has been sent successfully!" });
  } catch (error) {
    next(error);
  }
};

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const updateContactMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // read, unread
    
    const message = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message status updated successfully", contact: message });
  } catch (error) {
    next(error);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await Contact.findByIdAndDelete(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Newsletter
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const exists = await Subscriber.findOne({ email });
    if (exists) {
      if (exists.status === "unsubscribed") {
        exists.status = "active";
        await exists.save();
        await sendNewsletterConfirmationEmail(email);
        return res.status(200).json({ success: true, message: "Successfully resubscribed to newsletter!" });
      }
      return res.status(400).json({ success: false, message: "Email is already subscribed to newsletter" });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    await sendNewsletterConfirmationEmail(email);

    res.status(201).json({ success: true, message: "Thank you for subscribing to our newsletter!" });
  } catch (error) {
    next(error);
  }
};

export const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, subscribers });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscriber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscriber.findByIdAndDelete(id);
    if (!sub) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }
    res.status(200).json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    next(error);
  }
};
