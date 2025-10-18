"use client";
import Image from "next/image";
import { FiSearch, FiMapPin, FiChevronRight } from "react-icons/fi";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import Path from "@/components/Path";
import ThreeStepProcess from "@/components/ThreeStepProcess";
import WhyJVA from "@/components/WhyJVA";
import { motion } from "framer-motion";

import banner2 from "../assets/Importance-of-Real-Estate-Market-Analysis-1024x683.jpg";
import { useState } from "react";

export default function Home() {
  const [listingType, setListingType] = useState('Sell');
  const [text] = useTypewriter({
    words: ["Innovation", "Capital & Vision" ],
    loop: 1,
    delaySpeed: 100,
  });

  return (
    <>
      <div className="w-full">
        {/* Hero Section with background image */}
        <section className="relative w-full min-h-[72vh] flex items-center justify-center overflow-hidden">
          <Image
            src={banner2}
            alt="Hero background"
            fill
            className="object-cover w-full h-full scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" />

          <div className="relative z-20 max-w-6xl w-full px-6 lg:px-24 mt-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                Where Land Meets{" "}
                <span className="text-yellow-400">
                  {text}
                  <Cursor cursorColor="#facc15" cursorStyle />
                </span>
              </h1>

              <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-8">
                Connect landowners, individual & group investors, cooperatives,
                government entities, and mandates for profitable real estate
                joint ventures. We manage the process, you reap the rewards.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <a
                  href="#get-started"
                  className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  Get Started Today
                  <FiChevronRight />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-3 border border-white text-white font-medium py-3 px-6 rounded-full hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Learn How It Works
                  <FiChevronRight />
                </a>
              </div>

              {/* Glass search / CTA card overlay */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className=" flex flex-col items-center pt-10 px-2">

      {/* Main Search Bar Container - Fully Responsive */}
      <div className="w-full flex justify-center px-4 mb-10">
        {/* Card Styling: backdrop-blur, rounded corners, shadow, flexible layout */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full max-w-6xl border border-gray-100 transition-all duration-300">

          {/* Sell / Rent Toggle: full width on mobile, auto width on desktop */}
          <div className="flex items-center justify-between bg-gray-100 rounded-full p-1 w-full md:w-auto shrink-0">
            {['Sell', 'Rent'].map((type) => (
              <button
                key={type}
                onClick={() => setListingType(type)}
                className={`
                  flex-1 md:flex-none px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap
                  ${listingType === type
                    ? 'bg-yellow-500 text-gray-900 shadow-md'
                    : 'text-gray-700 hover:bg-white/70'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Property Type Input: flexible width (flex-1) */}
          <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200 px-4 py-3 shadow-inner flex-1 min-w-[180px] hover:border-yellow-400 transition-colors">
            <FiMapPin className="text-yellow-500 text-lg shrink-0 w-5 h-5" />
            <input
              type="text"
              placeholder="Property type"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
            />
          </div>

          {/* Location/Search Input: flexible width (flex-1) */}
          <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200 px-4 py-3 shadow-inner flex-1 min-w-[200px] hover:border-yellow-400 transition-colors">
            <FiSearch className="text-yellow-500 text-lg shrink-0 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
            />
          </div>

          {/* Search Button: full width on mobile, auto width on desktop, attention grabbing */}
          <button
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl w-full md:w-auto shrink-0"
          >
            Search
          </button>
        </div>
      </div>
    </div>


              </motion.div>

            </div>
          </div>
        </section>
      </div>

      <Path />
      <ThreeStepProcess />
      <WhyJVA />
    </>
  );
}