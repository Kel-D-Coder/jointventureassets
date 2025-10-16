"use client"

import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow flex items-center px-4 sm:px-8 py-3 relative">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="bg-gray-900 text-white rounded-lg px-3 py-2 font-bold text-sm">
          JVA
        </div>
        <span className="font-bold text-gray-900 text-lg">
          Joint Venture Assets
        </span>
      </div>
      {/* Centered Navigation Links */}
      <div className="hidden md:flex flex-1 justify-center items-center gap-10">
        <Link href="/" className="text-gray-700 hover:text-yellow-500 font-medium">
          Home
        </Link>
        <Link href="how-it-works" className="text-gray-700 hover:text-yellow-500 font-medium">
          How It Works
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-yellow-500 font-medium">
          Contact
        </Link>
      </div>
      {/* Actions Right */}
      <div className="hidden md:flex items-center gap-3">
        <Link href="/login" className="text-gray-700 hover:text-yellow-500 font-medium">
          Login
        </Link>
        <Link
          href="#get-started"
          className="bg-gray-900 hover:bg-yellow-400 text-white hover:text-gray-900 font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>
      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-gray-900 text-2xl ml-auto"
        aria-label="Open menu"
        onClick={() => setMenuOpen(true)}
      >
        <FiMenu />
      </button>
      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-white shadow-lg flex flex-col px-4 py-4 animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-900 text-white rounded-lg px-3 py-2 font-bold text-sm">
                JVA
              </div>
              <span className="font-bold text-gray-900 text-lg">
                Joint Venture Assets
              </span>
            </div>
            <button
              className="text-gray-900 text-2xl"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <FiX />
            </button>
          </div>
          <Link href="/" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="#how-it-works" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="/contact" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/login" className="py-2 text-gray-900 hover:text-yellow-500 font-medium" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link
            href="#get-started"
            className="py-2 mt-2 bg-gray-900 hover:bg-yellow-400 text-white hover:text-gray-900 font-semibold px-5 rounded-lg transition-colors text-center"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
      {/* Optional: Add slide-in animation */}
      <style jsx>{`
        .animate-slide-in {
          animation: slide-in 0.2s ease;
        }
        @keyframes slide-in {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
}