"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiUpload, FiX } from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";
import axios from "axios"
import { useAppSelector } from "@/hooks/hooks";
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
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

const inputFocusVariants = {
  focus: {
    scale: 1.01,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  blur: {
    scale: 1,
  },
} as const;

export default function SubmitRequestPage() {
  interface FormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    requestType: "land" | "development" | "partnership" ;
    location: string;
    budget: string;
    timeline: string;
    description: string;
    title: string;
    developmentType: string;
    partnershipType: string;
    landSize: string;
    landValue: string;
    housingProposal: string;
    titleDocument: string;
    sharingFormula: string;
    files: File[];
  }

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    requestType: "land",
    location: "",
    budget: "",
    timeline: "",
    description: "",
    title: "",
    developmentType: "",
    partnershipType: "",
    landSize: "",
    landValue: "",
    housingProposal: "",
    titleDocument: "",
    sharingFormula: "",
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("")
  const token = useAppSelector(state => state.auth.token)
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = new FormData();

    // Append text fields
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("phoneNumber", formData.phoneNumber);
    submitData.append("requestType", formData.requestType);
    submitData.append("location", formData.location);
    submitData.append("budget", formData.budget);
    submitData.append("timeline", formData.timeline);
    submitData.append("description", formData.description);
    submitData.append("title", formData.title);

    if (formData.requestType === "land") {
      submitData.append("landSize", formData.landSize);
      submitData.append("landValue", formData.landValue);
      submitData.append("housingProposal", formData.housingProposal);
      submitData.append("titleDocument", formData.titleDocument);
      submitData.append("sharingFormula", formData.sharingFormula);
    }

    if (formData.requestType === "development") {
      submitData.append("developmentType", formData.developmentType);
    }

    if (formData.requestType === "partnership") {
      submitData.append("partnershipType", formData.partnershipType);
    }

    formData.files.forEach((file) => {
      submitData.append("documents", file); 
    });

    try {
      setIsSubmitting(true)
      setSubmitSuccess(false)
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/request/create`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setIsSubmitting(false)
      setSubmitSuccess(true)
    } catch (error: unknown) {
      setIsSubmitting(false)
      setIsSubmitting(false)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong. Please try again.")
      } else {
        setError("Something went wrong. Please try again.");
      }

      setTimeout(() => {
        setError("")
      }, 5000)
      
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Request Submitted Successfully!
          </h1>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for submitting your request. Our team will review your
            information and get back to you within 24-48 hours.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-200"
          >
            Return to Home
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Submit Your Request
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill out the form below to submit your land or development
            opportunity. Our team will review your request and get back to you
            shortly.
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          variants={itemVariants}
          whileHover={{
            y: -5,
            transition: { type: "spring", stiffness: 300, damping: 15 },
          }}
        >
          <div className="p-6 sm:p-8 md:p-10">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Name and Email */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "name" ? "focus" : "blur"}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("fullName")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        placeholder="Emeka john"
                      />
                    </motion.div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "email" ? "focus" : "blur"}
                      className="relative"
                    >
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        placeholder="your@email.com"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <motion.div
                    variants={inputFocusVariants}
                    animate={focusedField === "phone" ? "focus" : "blur"}
                    className="relative"
                  >
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phoneNumber")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                      placeholder="+234 2547 000 0000"
                    />
                  </motion.div>
                </motion.div>

                {/* Location, Budget, Timeline */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "location" ? "focus" : "blur"}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("location")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        placeholder="No 1, example street, area"
                      />
                    </motion.div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "budget" ? "focus" : "blur"}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("budget")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        placeholder="e.g. ₦500,000,000"
                      />
                    </motion.div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeline
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "timeline" ? "focus" : "blur"}
                      className="relative"
                    >
                      <input
                        type="text"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("timeline")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        placeholder="e.g. 6 months"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <motion.div
                    variants={inputFocusVariants}
                    animate={focusedField === "title" ? "focus" : "blur"}
                    className="relative"
                  >
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("title")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                      placeholder="e.g. 3 Bedroom Duplex JV in Lekki"
                    />
                  </motion.div>
                </motion.div>

                {/* Request Type */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <motion.div
                    variants={inputFocusVariants}
                    animate={focusedField === "requestType" ? "focus" : "blur"}
                    className="relative"
                  >
                    <select
                      name="requestType"
                      value={formData.requestType}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("requestType")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="land">Land</option>
                      <option value="development">Development</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </motion.div>
                </motion.div>

                {formData.requestType === "development" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Development Type
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "developmentType" ? "focus" : "blur"}
                      className="relative"
                    >
                      <select
                        name="developmentType"
                        value={formData.developmentType}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("developmentType")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="">Select development type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="agricultural">Agricultural</option>
                      </select>
                    </motion.div>
                  </motion.div>
                )}

                {formData.requestType === "partnership" && (
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partnership Type
                    </label>
                    <motion.div
                      variants={inputFocusVariants}
                      animate={focusedField === "partnershipType" ? "focus" : "blur"}
                      className="relative"
                    >
                      <select
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("partnershipType")}
                        onBlur={() => setFocusedField(null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="">Select partnership type</option>
                        <option value="mandate">Mandate</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="property_consultant">Property Consultant</option>
                        <option value="building_expert">Building Expert</option>
                      </select>
                    </motion.div>
                  </motion.div>
                )}

                {formData.requestType === "land" && (
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Size
                      </label>
                      <motion.div
                        variants={inputFocusVariants}
                        animate={focusedField === "landSize" ? "focus" : "blur"}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="landSize"
                          value={formData.landSize}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("landSize")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. 500 sqm"
                        />
                      </motion.div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Value
                      </label>
                      <motion.div
                        variants={inputFocusVariants}
                        animate={focusedField === "landValue" ? "focus" : "blur"}
                        className="relative"
                      >
                        <input
                          type="text"
                          name="landValue"
                          value={formData.landValue}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("landValue")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. ₦100,000,000"
                        />
                      </motion.div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Housing Proposal
                      </label>
                      <motion.div
                        variants={inputFocusVariants}
                        animate={focusedField === "housingProposal" ? "focus" : "blur"}
                        className="relative"
                      >
                        <select
                          name="housingProposal"
                          value={formData.housingProposal}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("housingProposal")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">Select proposal</option>
                          <option value="apartment">Apartment</option>
                          <option value="duplex">Duplex</option>
                          <option value="maisonette">Maisonette</option>
                          <option value="bungalows">Bungalows</option>
                          <option value="condos">Condos</option>
                        </select>
                      </motion.div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title Document
                      </label>
                      <motion.div
                        variants={inputFocusVariants}
                        animate={focusedField === "titleDocument" ? "focus" : "blur"}
                        className="relative"
                      >
                        <select
                          name="titleDocument"
                          value={formData.titleDocument}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("titleDocument")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">Select document type</option>
                          <option value="c_of_o">C of O</option>
                          <option value="governors_consent">Governor's Consent</option>
                          <option value="deed_of_assignment">Deed</option>
                          <option value="excision">Excision</option>
                          <option value="gazzette">Gazzette</option>
                        </select>
                      </motion.div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sharing Formula
                      </label>
                      <motion.div
                        variants={inputFocusVariants}
                        animate={focusedField === "sharingFormula" ? "focus" : "blur"}
                        className="relative"
                      >
                        <select
                          name="sharingFormula"
                          value={formData.sharingFormula}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("sharingFormula")}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="">Select sharing formula</option>
                          <option value="50_50">50% / 50%</option>
                          <option value="60_40">60% / 40%</option>
                          <option value="70_30">70% / 30%</option>
                        </select>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <motion.div
                    variants={inputFocusVariants}
                    animate={focusedField === "description" ? "focus" : "blur"}
                    className="relative"
                  >
                    <textarea
                      name="description"
                      required
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 resize-none"
                      placeholder="Tell us about your project or opportunity..."
                    />
                  </motion.div>
                </motion.div>

                {/* File Upload */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents (Optional)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl">
                    <div className="space-y-1 text-center">
                      <label htmlFor="file-upload">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400 hover:cursor-pointer"/>
                      </label>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="document"
                            type="file"
                            multiple
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </div>

                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        Selected files:
                      </p>
                      <ul className="space-y-2">
                        {formData.files.map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                          >
                            <span className="text-sm text-gray-600 truncate max-w-xs">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-2">
                  {error && (
                    <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl text-base font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none hover:cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed bg-gray-800" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Spinner />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Submit Request
                        <FiArrowRight className="ml-2 w-5 h-5" />
                      </span>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center text-sm text-gray-500"
          variants={itemVariants}
        >
          <p>
            Have questions?{" "}
            <Link
              href="/contact"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Contact our team
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
