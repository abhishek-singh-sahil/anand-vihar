import React from "react";
import { motion } from "framer-motion";

function PrivacyPolicy() {
  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 bg-[#FDFCFA]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
      >
        <h1 className="text-3xl font-extrabold text-[#013e37] mb-8 font-sans">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed font-sans">
          <p>
            Effective Date: July 14, 2026
          </p>
          <p>
            Welcome to Anand Vihar Restaurant & Sweet Shop. Your privacy is critical to us. This privacy statement explains how we gather, share, and protect information when you utilize our online services, website forms, reservations, and community feedback boards.
          </p>

          <h3 className="text-xl font-bold text-gray-800">1. Information We Collect</h3>
          <p>
            We collect personal information directly provided by you, such as your name, email address, phone number, and guest counts when submitting contact forms or booking restaurant reservations. In addition, when you submit testimonial reviews, we process rating scores, commentary texts, images, and videos.
          </p>

          <h3 className="text-xl font-bold text-gray-800">2. How We Use Collected Data</h3>
          <p>
            We use your data strictly to arrange restaurant table reservations, send email confirmations/updates, publish approved testimonials, circulate newsletter bulletins, and respond to business requests. We do not sell or lease your identity info to marketing companies.
          </p>

          <h3 className="text-xl font-bold text-gray-800">3. Data Security</h3>
          <p>
            We implement technical security guidelines including cookie encryption, JWT token management, data input sanitization, and SSL connection locks to shield your data. You can inspect, modify, or request deletion of your account profiles anytime.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PrivacyPolicy;
