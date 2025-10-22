"use client";

import { motion } from "framer-motion";
import { FaUser, FaCalculator, FaLandmark } from "react-icons/fa";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = [
  {
    id: 1,
    title: "Individual",
    description: "Private individual or small business owner",
    icon: <FaUser size={28} className="text-yellow-600" />,
    color: "bg-yellow-50",
  },
  {
    id: 2,
    title: "Cooperative",
    description: "Cooperative society, association, or group organization",
    icon: <FaCalculator size={28} className="text-yellow-600" />,
    color: "bg-yellow-50",
  },
  {
    id: 3,
    title: "Government",
    description: "Government agency, ministry, or public institution",
    icon: <FaLandmark size={28} className="text-yellow-600" />,
    color: "bg-yellow-50",
  },
];

const RoleCategory = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const handleCategoryClick = () => {
    // Navigate to register form with role and step parameters
    router.push(`/register?role=${role}&step=register`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-white">
      <motion.h1
        className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Select Your Role Category
      </motion.h1>
      <motion.p
        className="text-gray-500 text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Choose the category that best describes your organization
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.08)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleCategoryClick(category.id)}
            className="flex flex-col items-start border border-gray-200 rounded-xl p-6 cursor-pointer bg-white hover:border-yellow-500 hover:shadow-lg transition"
          >
            <div
              className={`${category.color} p-3 rounded-md flex items-center justify-center mb-4`}
            >
              {category.icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {category.title}
            </h2>
            <p className="text-gray-500 text-sm">{category.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RoleCategory;
