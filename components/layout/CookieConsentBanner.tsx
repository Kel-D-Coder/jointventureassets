"use client";

import { useState, useEffect } from "react";
import { hasCookie, setCookie } from "cookies-next";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi"

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
          className="fixed bottom-4 left-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/10 bg-ink p-5 text-white shadow-2xl sm:bottom-6 sm:left-6"
          role="region"
          aria-label="Cookie consent"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg">We value your privacy</h3>
            <button onClick={accept} className="-mt-1 -mr-1 grid h-8 w-8 place-items-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white" aria-label="Close">
              <FiX aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            We use cookies to improve your browsing experience and understand how the site is used. By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
          </p>
          <button onClick={accept} className="mt-4 w-full rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-gold/85 sm:w-auto">
            Accept cookies
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
