"use client";

import { motion } from "framer-motion";

const inputFocusVariants = {
  focus: {
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  blur: {
    scale: 1,
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

interface InvestorFieldsProps {
  formData: {
    organizationType: string;
    registrationLicenseNumber: string;
    investmentType: string;
    budgetRange: string;
    preferredLocation: string;
    projectType: string;
    yearsOfExperience: string;
    companyName: string;
  };
  focusedField: string | null;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFocus: (field: string) => void;
  onBlur: () => void;
  category?: string;
}

export default function InvestorFields({
  formData,
  focusedField,
  onFieldChange,
  onFocus,
  onBlur,
  category,
}: InvestorFieldsProps) {
  return (
    <>
      {/* Investment Type */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="investmentType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Investment Type <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "investmentType" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="investmentType"
            name="investmentType"
            value={formData.investmentType}
            onChange={onFieldChange}
            onFocus={() => onFocus("investmentType")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Investment Type</option>
            <option value="Equity">Equity</option>
            <option value="Debt">Debt</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Joint Venture">Joint Venture</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Organization Type - For Cooperative, Corporation, Partnership, LLC, Government */}
      {category !== "Individual" && (
        <motion.div variants={itemVariants}>
          <label
            htmlFor="organizationType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Organization Type <span className="text-red-500">*</span>
          </label>
          <motion.div
            animate={focusedField === "organizationType" ? "focus" : "blur"}
            variants={inputFocusVariants}
          >
            <select
              id="organizationType"
              name="organizationType"
              value={formData.organizationType}
              onChange={onFieldChange}
              onFocus={() => onFocus("organizationType")}
              onBlur={onBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
              required
            >
              <option value="">Select Organization Type</option>
              <option value="Individual">Individual</option>
              <option value="Cooperative">Cooperative</option>
              <option value="Corporation">Corporation</option>
              <option value="Partnership">Partnership</option>
              <option value="LLC">LLC</option>
            </select>
          </motion.div>
        </motion.div>
      )}

      {/* Registration/License Number - For Cooperative, Corporation, Partnership, LLC, Government */}
      {category !== "Individual" && (
        <motion.div variants={itemVariants}>
          <label
            htmlFor="registrationLicenseNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Registration/License Number <span className="text-red-500">*</span>
          </label>
          <motion.div
            animate={
              focusedField === "registrationLicenseNumber" ? "focus" : "blur"
            }
            variants={inputFocusVariants}
          >
            <input
              type="text"
              id="registrationLicenseNumber"
              name="registrationLicenseNumber"
              value={formData.registrationLicenseNumber}
              onChange={onFieldChange}
              onFocus={() => onFocus("registrationLicenseNumber")}
              onBlur={onBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
              placeholder=""
              required
            />
          </motion.div>
        </motion.div>
      )}

      {/* Budget Range */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="budgetRange"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Budget Range <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "budgetRange" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="budgetRange"
            name="budgetRange"
            value={formData.budgetRange}
            onChange={onFieldChange}
            onFocus={() => onFocus("budgetRange")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Budget Range</option>
            <option value="Under $100k">Under $100k</option>
            <option value="$100k - $500k">$100k - $500k</option>
            <option value="$500k - $1M">$500k - $1M</option>
            <option value="$1M - $5M">$1M - $5M</option>
            <option value="$5M - $10M">$5M - $10M</option>
            <option value="Over $10M">Over $10M</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Preferred Location */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="preferredLocation"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Location <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "preferredLocation" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <input
            type="text"
            id="preferredLocation"
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={onFieldChange}
            onFocus={() => onFocus("preferredLocation")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>

      {/* Project Type */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="projectType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Project Type <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "projectType" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={onFieldChange}
            onFocus={() => onFocus("projectType")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Project Type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Mixed Use">Mixed Use</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Hospitality">Hospitality</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Years of Experience */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="yearsOfExperience"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "yearsOfExperience" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={onFieldChange}
            onFocus={() => onFocus("yearsOfExperience")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Years of Experience</option>
            <option value="0-2 years">0-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="6-10 years">6-10 years</option>
            <option value="11-15 years">11-15 years</option>
            <option value="16-20 years">16-20 years</option>
            <option value="20+ years">20+ years</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Company Name */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Company Name
        </label>
        <motion.div
          animate={focusedField === "companyName" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={onFieldChange}
            onFocus={() => onFocus("companyName")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
            placeholder=""
          />
        </motion.div>
      </motion.div>
    </>
  );
}
