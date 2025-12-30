"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

import banner2 from "../assets/IMG-20251018-WA0010.jpg";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { FiCalendar, FiCheckCircle, FiChevronRight, FiClock, FiDollarSign, FiMapPin, FiSearch, FiUser, FiXCircle } from "react-icons/fi";
import axios from "axios";
import Path from "./Path";
import ThreeStepProcess from "./ThreeStepProcess";
import WhyJVA from "./WhyJVA";


interface IRequest {
  _id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  timeline: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
}

export default function HomeClient() {
    const [listingType, setListingType] = useState('Sell');
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<IRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [text] = useTypewriter({
      words: ["Innovation", "Capital & Vision" ],
      loop: 1,
      delaySpeed: 100,
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
          case "pending":
            return <FiClock className="mr-1 text-yellow-500" />;
          case "accepted":
            return <FiCheckCircle className="mr-1 text-green-500" />;
          case "rejected":
            return <FiXCircle className="mr-1 text-red-500" />;
          default:
            return <FiClock className="mr-1 text-gray-400" />;
        }
    };

    const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


    const handleSearch = async () => {
        // if (!searchText.trim()) return;
    
        try {
          setLoading(true);
          setError(null);
          
          const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/search`, {
            location: searchText.trim(),
            type: listingType.toLowerCase(),
          });
    
          setResults(response.data.results);
          setLoading(false);
        } catch (err: unknown) {
          setLoading(false);
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || 'An error occurred while searching.');
          } else {
            setError('An error occurred while searching.');
          }
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="w-full">
      <h1 className="sr-only">
        Joint Venture Assets – Real Estate Joint Venture Platform
      </h1>
      {/* Hero Section with background image */}
      <section className="relative w-full min-h-[72vh] flex items-center justify-center overflow-hidden">
        <Image
          src={banner2}
          alt="Hero background"
            fill
            className="object-cover w-full h-full"
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
                  href="/register"
                  className="inline-flex items-center gap-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  Get Started Today
                  <FiChevronRight />
                </a>
                <a
                  href="/how-it-works"
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
            {['Land', 'Develop'].map((type) => (
              <button
                key={type}
                onClick={() => setListingType(type)}
                className={`
                  flex-1 md:flex-none px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap hover:cursor-pointer
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

          {/* Location/Search Input: flexible width (flex-1) */}
          <div className="flex items-center gap-3 bg-white rounded-full border border-gray-200 px-4 py-3 shadow-inner flex-1 min-w-[200px] hover:border-yellow-400 transition-colors">
            <FiSearch className="text-yellow-500 text-lg shrink-0 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location"
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Search Button: full width on mobile, auto width on desktop, attention grabbing */}
          <button
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-yellow-600 transition-all shadow-lg hover:shadow-xl w-full md:w-auto shrink-0 hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
    </div>


      </motion.div>

      </div>
    </div>
  </section>
  <section className="max-w-6xl mx-auto px-6 lg:px-24 py-8">
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {results.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Search results
            </h2>
            <ul className="space-y-3">
              {results.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                          request.status,
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="capitalize ml-1">{request.status}</span>
                      </span>
                    </div>
  
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {request.title}
                    </h3>
  
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {request.description}
                    </p>
  
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiDollarSign className="mr-2" />
                        <span>Budget: {request.budget}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin className="mr-2" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-2" />
                        <span>Duration: {request.timeline}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiUser className="mr-2" />
                        <span>Posted by: {request.fullName}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-2" />
                        <span>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  </motion.div>
              ))}
            </ul>
          </div>
        ) : (
          <>
        <Path />
        <ThreeStepProcess />
        <WhyJVA />
        </>
        )}
      </section>
</div>
  );
}