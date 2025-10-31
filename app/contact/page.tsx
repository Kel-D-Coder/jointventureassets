"use client";

import { motion, Variants } from "framer-motion";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const cardVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Contact() {
  return (
    <motion.div
      className="bg-gray-50 min-h-screen py-16 px-4 flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-2 text-center"
        variants={itemVariants}
      >
        Contact Us
      </motion.h1>
      <motion.p
        className="text-gray-700 text-base sm:text-lg mb-10 text-center max-w-xl"
        variants={itemVariants}
      >
        Ready to start your joint venture journey? Get in touch with our team for expert guidance and consultation.
      </motion.p>
      <motion.div
        className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl"
        variants={itemVariants}
      >
        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-6">
          <motion.div
            className="bg-white rounded-xl shadow p-7"
            variants={cardVariants}
            whileHover={{ boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)" }}
          >
            <h2 className="font-bold text-lg text-gray-900 mb-4">Get in Touch</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiPhone className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-700 text-sm">+234 803 123 4567<br />+234 701 234 5678</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiMail className="text-gray-900 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Email</div>
                  <div className="text-gray-700 text-sm">
                    info@jointventureassets.com<br />
                    partnerships@jointventureassets.com
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiMapPin className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Office</div>
                  <div className="text-gray-700 text-sm">
                    123 Victoria Island,<br />Lagos, Nigeria
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <FiClock className="text-gray-900 text-xl" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Business Hours</div>
                  <div className="text-gray-700 text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Why Contact Card */}
          <motion.div
            className="bg-gray-900 rounded-xl p-6 mt-6 text-white shadow flex flex-col gap-3"
            variants={cardVariants}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="font-bold text-lg mb-2">Why Contact Joint Venture Assets?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Expert guidance on individual, group, and government partnerships
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Free initial consultation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Access to vetted individual, cooperative, and government partners
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">&#10003;</span>
                Full project management for all partnership types
              </li>
            </ul>
          </motion.div>
        </div>
        {/* Contact Form */}
        <div className="flex-1">
          <motion.form
            className="bg-white rounded-xl shadow p-7 flex flex-col gap-5"
            variants={cardVariants}
            whileHover={{ boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.15)" }}
          >
            <h2 className="font-bold text-lg text-gray-900 mb-2">Send us a Message</h2>
            <div className="flex flex-col gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="name" className="font-medium text-gray-700">Full Name *</label>
                <input id="name" type="text" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="email" className="font-medium text-gray-700">Email Address *</label>
                <input id="email" type="email" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="phone" className="font-medium text-gray-700">Phone Number</label>
                <input id="phone" type="tel" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400" />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="type" className="font-medium text-gray-700">Consultation Type</label>
                <select id="type" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400">
                  <option>General Inquiry</option>
                  <option>Landowner Consultation</option>
                  <option>Investor/Developer Consultation</option>
                  <option>Mandate Consultation</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="font-medium text-gray-700">Subject *</label>
              <input id="subject" type="text" required className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400" placeholder="e.g. Joint Venture Consultation Request" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="font-medium text-gray-700">Message *</label>
              <textarea id="message" required rows={4} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400" placeholder="Tell us about your project, requirements, or questions..." />
            </div>
            <motion.button
              type="submit"
              className="bg-gray-900 hover:bg-yellow-400 text-white hover:text-gray-900 font-semibold px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 hover:cursor-pointer"
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              initial="rest"
              animate="rest"
            >
              <motion.span
                variants={{
                  rest: { rotate: 0, y: 0 },
                  hover: {
                    rotate: [0, -15, 15, -10, 10, 0],
                    y: [0, -3, 0],
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                    },
                  },
                }}
              >
                &#9993;
              </motion.span>
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
}