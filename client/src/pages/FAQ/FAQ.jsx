import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "Where is Anand Vihar Restaurant & Sweet Shop located?",
    answer: "We are located at Anand Vihar Complex, Near Jhanda Chowk, Ranchi Patna Road, Jhumri Telaiya, Jharkhand - 825409. You can find our exact location on the Contact page interactive map.",
  },
  {
    question: "What are the restaurant's operational hours?",
    answer: "We are open Monday through Sunday, from 8:00 AM to 10:30 PM. Breakfast, lunch, dinner, and our sweet counters are open throughout these hours.",
  },
  {
    question: "How do I book a table reservation?",
    answer: "You can book a table by visiting our 'Reservation' page, filling out your name, contact details, guest count, and selected slot, and submitting the request. You will receive an email confirmation once the reservation is approved.",
  },
  {
    question: "Can I order food online or check out from the website?",
    answer: "No, this is a branding and customer engagement site. We do not support online food delivery or checkout purchases. Please visit our shop to enjoy our sweets and thalis fresh!",
  },
  {
    question: "How can I submit a video or image testimonial?",
    answer: "Anyone can submit a testimonial directly on our site without logging in. Visit the Testimonial section or form, fill in your details, and attach up to 5 images or a video (limit: 15 seconds max). It will appear on the site once approved by our administrator.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-[800px] mx-auto py-16 px-6 bg-[#FDFCFA] font-sans">
      <h1 className="text-4xl font-extrabold text-[#013e37] text-center mb-4">Frequently Asked Questions</h1>
      <p className="text-center text-gray-500 mb-12">Find answers to common questions about our shop, reservations, and feedback.</p>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left py-5 px-6 font-bold text-gray-800 flex justify-between items-center focus:outline-none hover:text-[#ff9248] transition-colors"
            >
              <span>{item.question}</span>
              <span className="text-xl text-gray-400">{activeIndex === index ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pb-5 px-6 text-gray-600 border-t border-gray-50 pt-3 leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
