"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Spinner } from "@/components/Spinner";

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
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

const inputFocusVariants = {
  focus: {
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  blur: {
    scale: 1,
  },
} as const;

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        formData
      );
      setSuccessMsg(response.data.message);
      console.log("Login successful:", response.data);
      dispatch(
        setCredentials({ user: response.data.user, token: response.data.token })
      );
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-600 mb-2">
            Sign in to your account to continue
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          whileHover={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <motion.div
                animate={focusedField === "email" ? "focus" : "blur"}
                variants={inputFocusVariants}
              >
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                  placeholder=""
                  required
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <motion.div
                className="relative"
                animate={focusedField === "password" ? "focus" : "blur"}
                variants={inputFocusVariants}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none pr-12"
                  placeholder=""
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-yellow-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </motion.button>
              </motion.div>
            </motion.div>


            {/* Forgot Password Link */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
                >
                Forgot password?
              </Link>
            </motion.div>

                {(error || successMsg) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${
                      error
                        ? "bg-red-50 border-2 border-red-300 text-red-800"
                        : "bg-green-50 border-2 border-green-300 text-green-800"
                    } px-5 py-4 rounded-xl text-sm font-medium shadow-sm`}
                  >
                    <div className="flex justify-center items-center gap-3">
                      <span className="flex-1 text-xl">{error || successMsg}</span>
                    </div>
                  </motion.div>
                )}
            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 group overflow-hidden relative transition-colors duration-300 ${
                  loading 
                    ? 'bg-gray-800 text-white cursor-wait' 
                    : 'bg-yellow-500 text-gray-900 hover:cursor-pointer'
                }`}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {loading ? (
                  <span className="relative z-10 flex items-center gap-2">
                    <Spinner />
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Sign In</span>
                    <motion.span
                      className="relative z-10"
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    >
                      <FiArrowRight size={20} />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-yellow-600 hover:text-yellow-700 font-medium hover:underline"
              >
                Get Started
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
