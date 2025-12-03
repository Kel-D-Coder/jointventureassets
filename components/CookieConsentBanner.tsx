"use client";

import { useState, useEffect } from "react";
import { hasCookie, setCookie } from "cookies-next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = hasCookie("cookieConsent");
    if (!consent) {
      setShowBanner(true);
      // Small delay to allow for initial render
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    setIsVisible(false);
    // Wait for exit animation to complete before removing from DOM
    setTimeout(() => {
      setShowBanner(false);
      setCookie("cookieConsent", "true", { 
        path: "/", 
        maxAge: 60 * 60 * 24 * 365 
      });
    }, 300);
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                We value your privacy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies. 
                <a 
                  href="/privacy-policy" 
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Cookie Policy
                </a>
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={accept}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Accept All
              </button>
              <button
                onClick={accept}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
