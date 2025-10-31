"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";
import LandownerFields from "./LandownerFields";
import InvestorFields from "./InvestorFields";
import MandateFields from "./MandateFields";
import { Spinner } from "./Spinner";

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

interface CompleteProfileFormProps {
  role?: string;
  category?: string;
}

export default function CompleteProfileForm({ 
  role = "Investor", 
  category = "Cooperative" 
}: CompleteProfileFormProps) {
  const router = useRouter();
  const userRole = role;
  const [formData, setFormData] = useState({
    investmentType: "",
    organizationType: "",
    registrationLicenseNumber: "",
    budgetRange: "",
    preferredLocation: "",
    projectType: "",
    yearsOfExperience: "",
    companyName: "",
    phoneNumber: "",
    // Landowner-specific fields
    landLocation: "",
    landSize: "",
    documentationStatus: "",
    preferredPartnershipType: "",
    landDescription: "",
    // Mandate-specific fields
    title: "",
    trackRecord: "",
    capacityExpertise: "",
    specialization: "",
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId")
    console.log("Profile completion submitted:", formData);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/profile/${userId}`,
        {role, ...formData}
      );
      setSuccessMsg(response.data.message);
      console.log("Profile completion successful:", response.data);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Profile completion failed:", error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
          >
            Complete Your Profile
          </motion.h1>
          <motion.p
            className="text-gray-600 text-sm"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {role} • {category}
          </motion.p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Landowner-specific fields */}
            {userRole === "Landowner" && (
              <LandownerFields
                formData={{
                  organizationType: formData.organizationType,
                  registrationLicenseNumber: formData.registrationLicenseNumber,
                  landLocation: formData.landLocation,
                  landSize: formData.landSize,
                  documentationStatus: formData.documentationStatus,
                  preferredPartnershipType: formData.preferredPartnershipType,
                  landDescription: formData.landDescription,
                }}
                focusedField={focusedField}
                onFieldChange={handleChange}
                onTextAreaChange={handleTextAreaChange}
                onFocus={setFocusedField}
                onBlur={() => setFocusedField(null)}
                category={category}
              />
            )}

            {/* Investor/Developer-specific fields */}
            {userRole === "Investor" && (
              <>
                <InvestorFields
                  formData={{
                    organizationType: formData.organizationType,
                    registrationLicenseNumber: formData.registrationLicenseNumber,
                    investmentType: formData.investmentType,
                    budgetRange: formData.budgetRange,
                    preferredLocation: formData.preferredLocation,
                    projectType: formData.projectType,
                    yearsOfExperience: formData.yearsOfExperience,
                    companyName: formData.companyName,
                  }}
                  focusedField={focusedField}
                  onFieldChange={handleChange}
                  onFocus={setFocusedField}
                  onBlur={() => setFocusedField(null)}
                  category={category}
                />

                {/* Mandate Fields - Only for Government category */}
                {category === "Government" && (
                  <MandateFields
                    formData={{
                      title: formData.title,
                      organizationType: formData.organizationType,
                      registrationLicenseNumber: formData.registrationLicenseNumber,
                      trackRecord: formData.trackRecord,
                      capacityExpertise: formData.capacityExpertise,
                      specialization: formData.specialization,
                      companyName: formData.companyName,
                    }}
                    focusedField={focusedField}
                    onFieldChange={handleChange}
                    onTextAreaChange={handleTextAreaChange}
                    onFocus={setFocusedField}
                    onBlur={() => setFocusedField(null)}
                    category={category}
                  />
                )}
              </>
            )}

            {/* Mandate-specific fields */}
            {userRole === "Mandate" && (
              <MandateFields
                formData={{
                  title: formData.title,
                  organizationType: formData.organizationType,
                  registrationLicenseNumber: formData.registrationLicenseNumber,
                  trackRecord: formData.trackRecord,
                  capacityExpertise: formData.capacityExpertise,
                  specialization: formData.specialization,
                  companyName: formData.companyName,
                }}
                focusedField={focusedField}
                onFieldChange={handleChange}
                onTextAreaChange={handleTextAreaChange}
                onFocus={setFocusedField}
                onBlur={() => setFocusedField(null)}
                category={category}
              />
            )}

            {/* Phone Number - Common for both roles */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <motion.div
                animate={focusedField === "phoneNumber" ? "focus" : "blur"}
                variants={inputFocusVariants}
              >
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phoneNumber")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
                  placeholder=""
                  required
                />
              </motion.div>
            </motion.div>

            {/* Error Message */}
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
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 group overflow-hidden relative transition-colors duration-300 ${
                  loading 
                    ? 'bg-gray-800 text-white cursor-wait' 
                    : 'bg-yellow-500 text-gray-900 hover:cursor-pointer'
                }`}
                whileHover={!loading ? {
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(234, 179, 8, 0.5)",
                } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {!loading && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                {loading ? (
                  <span className="relative z-10 flex items-center gap-2">
                    <Spinner />
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">Complete Registration</span>
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
        </motion.div>
      </motion.div>
    </div>
  );
}
