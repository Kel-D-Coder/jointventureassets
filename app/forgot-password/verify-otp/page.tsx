"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Spinner } from "@/components/Spinner";

// Reuse the same animation variants from forgot-password page
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

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState<string | null>(null);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const otpArray = pasteData.split('').slice(0, 6);
      setOtp(otpArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Replace with your actual API endpoint
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/password/otp/verify`, { 
        email,
        otp: otpCode 
      });
      
      // If OTP is valid, redirect to reset password page
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      
    } catch (error: unknown) {
      console.error("Error verifying OTP:", error);
      if (axios.isAxiosError(error)) {
        console.log(error)
        setError(error.response?.data?.message || "Invalid OTP. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-500/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-yellow-500/10 mr-4 transition-colors"
              aria-label="Go back"
            >
              <FiArrowLeft className="w-5 h-5 text-yellow-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
          </div>

          <motion.p 
            className="text-gray-600 mb-8"
            variants={itemVariants}
          >
            We've sent a 6-digit verification code to {email || 'your email'}. Please enter it below.
          </motion.p>

          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-900/10 text-red-500 border border-red-500/30 rounded-xl text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              className="flex justify-between space-x-4"
              variants={itemVariants}
            >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onPaste={handlePaste}
                  className="w-full h-16 text-2xl text-center bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  autoFocus={index === 0}
                  disabled={loading}
                />
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-2">
              <button
                type="submit"
                disabled={loading || otp.some(digit => !digit) || otp.join('').length !== 6}
                className={`w-full flex justify-center py-3 px-4 border border-yellow-500/30 rounded-xl shadow-sm text-sm font-medium 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 
                transition-colors duration-200 disabled:opacity-70
                ${loading 
                  ? 'bg-gray-800 text-white cursor-wait' 
                  : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 cursor-pointer'
                }`}
              >
                {loading ? <Spinner /> : "Verify OTP"}
              </button>
            </motion.div>
          </form>

          <motion.div 
            className="mt-6 text-center text-sm"
            variants={itemVariants}
          >
            <p className="text-gray-300">
              Didn't receive a code?{' '}
              <button 
                onClick={() => {
                  // TODO: Implement resend OTP logic
                  alert('Resend OTP functionality would go here');
                }}
                className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Resend OTP
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
