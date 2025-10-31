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

interface MandateFieldsProps {
  formData: {
    title: string;
    organizationType: string;
    registrationLicenseNumber: string;
    trackRecord: string;
    capacityExpertise: string;
    specialization: string;
    companyName: string;
  };
  focusedField: string | null;
  onFieldChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus: (field: string) => void;
  onBlur: () => void;
  category?: string;
}

export default function MandateFields({
  formData,
  focusedField,
  onFieldChange,
  onTextAreaChange,
  onFocus,
  onBlur,
  category,
}: MandateFieldsProps) {
  return (
    <>
      {/* Title */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "title" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="title"
            name="title"
            value={formData.title}
            onChange={onFieldChange}
            onFocus={() => onFocus("title")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Miss">Miss</option>
            <option value="Prof">Prof</option>
            <option value="Dr">Dr</option>
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
              <option value="Government">Government</option>
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
            animate={focusedField === "registrationLicenseNumber" ? "focus" : "blur"}
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


      {/* Track Record */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="trackRecord"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Track Record <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "trackRecord" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <textarea
            id="trackRecord"
            name="trackRecord"
            value={formData.trackRecord}
            onChange={onTextAreaChange}
            onFocus={() => onFocus("trackRecord")}
            onBlur={onBlur}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>

      {/* Capacity/Expertise */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="capacityExpertise"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Capacity/Expertise <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "capacityExpertise" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <textarea
            id="capacityExpertise"
            name="capacityExpertise"
            value={formData.capacityExpertise}
            onChange={onTextAreaChange}
            onFocus={() => onFocus("capacityExpertise")}
            onBlur={onBlur}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder=""
            required
          />
        </motion.div>
      </motion.div>

      {/* Specialization */}
      <motion.div variants={itemVariants}>
        <label
          htmlFor="specialization"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Specialization <span className="text-red-500">*</span>
        </label>
        <motion.div
          animate={focusedField === "specialization" ? "focus" : "blur"}
          variants={inputFocusVariants}
        >
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={onFieldChange}
            onFocus={() => onFocus("specialization")}
            onBlur={onBlur}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all outline-none text-gray-900"
            required
          >
            <option value="">Select Specialization</option>
            <option value="Real Estate Development">Real Estate Development</option>
            <option value="Land Acquisition">Land Acquisition</option>
            <option value="Project Management">Project Management</option>
            <option value="Legal & Compliance">Legal & Compliance</option>
            <option value="Financial Advisory">Financial Advisory</option>
            <option value="Infrastructure Development">Infrastructure Development</option>
            <option value="Urban Planning">Urban Planning</option>
            <option value="Other">Other</option>
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
