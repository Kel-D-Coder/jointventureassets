'use client';

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white text-gray-800 text-sm font-medium px-3 py-2 rounded-lg shadow-md mb-2 whitespace-nowrap relative"
      >
        Need to chat?
        <div className="absolute bottom-0 right-4 w-3 h-3 bg-white transform rotate-45 translate-y-1/2"></div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { 
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 10
          } 
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <a
          href="https://wa.me/23408140431570" // Replace with your WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-8 h-8" />
        </a>
      </motion.div>
    </div>
  );
}