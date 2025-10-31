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

interface LandownerFieldsProps {
  formData: {
    organizationType: string;
    registrationLicenseNumber: string;
    landLocation: string;
    landSize: string;
    documentationStatus: string;
    preferredPartnershipType: string;
    landDescription: string;
  };
  focusedField: string | null;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: (field: string) => void;
  onBlur: () => void;
  category?: string;
}

export default function LandownerFields({
  formData,
  focusedField,
  onFieldChange,
  onTextAreaChange,
  onFocus,
  onBlur,
  category,
}: LandownerFieldsProps) {
  return (
    <>
      {/* Organization Type - For Cooperative and Government */}
      {(category === "Cooperative" || category === "Government") && (
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

      {/* Registration/License Number - For Cooperative and Government */}
      {(category === "Cooperative" || category === "Government") && (
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

      {/* Land Location */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="landLocation"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Land Location <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "landLocation" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <input
            type="text"
            id="landLocation"
            name="landLocation"
            value={formData.landLocation}
            onChange={onFieldChange}
            onFocus={() => onFocus("landLocation")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>

      {/* Land Size */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="landSize"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Land Size <span className="text-gray-500 text-xs">(sqm or acres)</span>{" "}
          <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "landSize" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <input
            type="text"
            id="landSize"
            name="landSize"
            value={formData.landSize}
            onChange={onFieldChange}
            onFocus={() => onFocus("landSize")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>

      {/* Documentation Status */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="documentationStatus"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Documentation Status <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "documentationStatus" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="documentationStatus"
            name="documentationStatus"
            value={formData.documentationStatus}
            onChange={onFieldChange}
            onFocus={() => onFocus("documentationStatus")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Documentation Status</option>
            <option value="Fully Documented">Fully Documented</option>
            <option value="Partially Documented">Partially Documented</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Yet Documented">Not Yet Documented</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Preferred Partnership Type */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="preferredPartnershipType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Preferred Partnership Type <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "preferredPartnershipType" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="preferredPartnershipType"
            name="preferredPartnershipType"
            value={formData.preferredPartnershipType}
            onChange={onFieldChange}
            onFocus={() => onFocus("preferredPartnershipType")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Preferred Partnership Type</option>
            <option value="Joint Venture">Joint Venture</option>
            <option value="Lease Agreement">Lease Agreement</option>
            <option value="Outright Sale">Outright Sale</option>
            <option value="Revenue Sharing">Revenue Sharing</option>
            <option value="Development Partnership">Development Partnership</option>
          </select>
        </motion.div>
      </motion.div>

      {/* Land Description */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="landDescription"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Land Description <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "landDescription" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <textarea
            id="landDescription"
            name="landDescription"
            value={formData.landDescription}
            onChange={onTextAreaChange}
            onFocus={() => onFocus("landDescription")}
            onBlur={onBlur}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>
    </>
  );
}
