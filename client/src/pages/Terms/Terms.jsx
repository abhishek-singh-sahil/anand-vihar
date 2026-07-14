import React from "react";
import { motion } from "framer-motion";

function Terms() {
  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 bg-[#FDFCFA]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100"
      >
        <h1 className="text-3xl font-extrabold text-[#013e37] mb-8 font-sans">Terms & Conditions</h1>
        
        <div className="space-y-6 text-gray-600 leading-relaxed font-sans">
          <p>
            Welcome to Anand Vihar. By browsing our branding page, requesting reservations, or uploading community reviews, you agree to comply with the terms specified herein.
          </p>

          <h3 className="text-xl font-bold text-gray-800">1. Table Reservations</h3>
          <p>
            Table bookings submitted through our reservation console are subject to physical table availability. The restaurant reserves the right to accept, reject, or modify booking slots depending on operational capacity. Status alerts are sent to the registered email.
          </p>

          <h3 className="text-xl font-bold text-gray-800">2. Testimonial Upload Policy</h3>
          <p>
            Visitors submitting reviews warrant that the texts, images, and videos are original and contain no illegal content. Testimonial videos must not exceed 15 seconds. All submissions go through admin review before publication.
          </p>

          <h3 className="text-xl font-bold text-gray-800">3. Intellectual Property</h3>
          <p>
            All branding materials, graphics, images, logos, and custom layout contents are the property of Anand Vihar Restaurant.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Terms;
