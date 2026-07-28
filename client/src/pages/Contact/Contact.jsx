import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import api from "../../services/api";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      return toast.error("Please fill in name, email and message");
    }

    setSubmitting(true);
    try {
      const response = await api.post("/contact/message", {
        name,
        email,
        phone,
        subject,
        message,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Message sent successfully!");
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-16 px-6 bg-[#FDFCFA] font-sans">
      <div className="text-center mb-16">
        <span className="badge mb-4">✦ Contact Us ✦</span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#013e37]">Get In Touch</h1>
        <p className="text-gray-500 max-w-xl mx-auto mt-4">
          Have questions about our sweet varieties, catering menus, or special events? Send us a message or call directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Send A Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9934190109"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Catering request, Reservation inquiry"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Your Message *</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Type your message details here..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff9248] focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#ff9248] hover:bg-[#ea5a00] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Info Details card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-2xl font-bold text-[#013e37]">Shop Information</h3>
            
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>📍 Address:</strong><br />
                Anand Vihar Sweet Shop, Near HDFC Bank, Jhanda Chowk, Jhumri Telaiya, Koderma, Jharkhand - 825409
              </p>
              <p>
                <strong>📞 Phone:</strong> <a href="tel:+919934190109" className="text-[#ff9248] hover:underline font-bold">+91 9934190109</a>
              </p>
              <p>
                <strong>✉ Email:</strong> <a href="mailto:info@anandvihar.com" className="text-[#ff9248] hover:underline font-bold">info@anandvihar.com</a>
              </p>
              <p>
                <strong>🕒 Working Hours:</strong><br />
                Mon - Sun: 8:00 AM to 10:30 PM
              </p>
            </div>

            {/* Calling and WhatsApp buttons */}
            <div className="flex gap-4">
              <a
                href="https://wa.me/919934190109"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-center text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                💬 WhatsApp Us
              </a>
              <a
                href="tel:+919934190109"
                className="flex-1 py-3 bg-[#013e37] hover:bg-[#025347] text-white rounded-xl font-semibold text-center text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                📞 Call Directly
              </a>
            </div>
          </div>

          {/* Map wrapper card */}
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm aspect-video bg-gray-100">
            <iframe
              title="Anand Vihar Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.9602521764654!2d85.5186001759556!3d24.43470437820757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f373b9e403d15d%3A0xe9ea026e6ef1b6b5!2sJhanda%20Chowk%2C%20Jhumri%20Telaiya%2C%20Jharkhand%20825409!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
