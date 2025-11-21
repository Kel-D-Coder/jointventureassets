"use client";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiMapPin,
  FiClock,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useSearchRequests } from "@/hooks/useSearchRequests";
import { Spinner } from "@/components/Spinner";

export default function BrowseRequests() {
  const [searchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    data: requests,
    loading,
    error,
    searchRequests,
  } = useSearchRequests();

  // Fetch all requests initially
  useEffect(() => {
    searchRequests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch whenever filter changes
  useEffect(() => {
    if (selectedCategory === "All") {
      searchRequests();
    } else {
      const mappedType =
        selectedCategory === "Development"
          ? "development"
          : selectedCategory === "Partnership"
          ? "partnership"
          : selectedCategory === "Land"
          ? "land"
          : selectedCategory.toLowerCase();

      searchRequests(mappedType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const categories = ["All", "Land", "Development", "Partnership"];

  const filteredRequests =
    requests?.filter((req) =>
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Requests
          </h1>
          <p className="text-gray-600">
            Find business partners, investors, and opportunities
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-700 hover:text-red-600 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search requests..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
              <select
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, key) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
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
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No requests found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
