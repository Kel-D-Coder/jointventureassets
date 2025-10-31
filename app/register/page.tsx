"use client";

import { motion, Variants } from "framer-motion";
import { FiMapPin, FiHome, FiUsers } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { useSearchParams } from "next/navigation";
import RoleCategory from "@/components/RoleCategory";
import RegisterForm from "@/components/RegisterForm";

const roles = [
  {
    id: "Landowner",
    title: "Landowner",
    description: "I have land and want to partner with individual or group investors.",
    icon: FiMapPin,
    color: "yellow",
  },
  {
    id: "Investor",
    title: "Investor",
    description: "I have capital, want to find land, or form/join investor groups.",
    icon: FiHome,
    color: "yellow",
  },
  {
    id: "Mandate",
    title: "Mandate",
    description: "I facilitate partnerships between landowners and investors.",
    icon: FiUsers,
    color: "yellow",
  },
];

// Framer Motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const RoleCard = ({
  id,
  title,
  description,
  icon: Icon,
}: (typeof roles)[0]) => {
  const router = useRouter();

  // Hover/tap motion and routing
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -6,
        scale: 1.05,
        boxShadow:
          "0 15px 30px rgba(0,0,0,0.1), 0 6px 12px rgba(0,0,0,0.06)",
      }}
      whileTap={{ scale: 0.97 }}
      onClick={() => router.push(`/register?role=${id}`)}
      className="relative group p-7 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md cursor-pointer transition-all duration-300 ease-out hover:border-yellow-500 hover:bg-yellow-50/40"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-xl mb-5 bg-yellow-100 text-yellow-700 transition-all duration-300 group-hover:scale-110">
        <Icon size={26} strokeWidth={1.6} />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

      {/* glowing animated border effect */}
      <motion.div
        layoutId="glow"
        className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-yellow-500/50 transition-all duration-300"
      />
    </motion.div>
  );
};

function RoleSelectorContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const step = searchParams.get("step");
  const category = searchParams.get("category");

  // Show register form if step is register
  if (role && step === "register") {
    const selectedRole = roles.find((r) => r.id === role);
    return <RegisterForm role={selectedRole?.title || "User"} category={category || ""} />;
  }

  // Show category selection if a role is selected
  if (role) {
    return <RoleCategory />;
  }

  // Show role selection by default
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6 flex flex-col items-center justify-center">
      <div className="text-center mb-14 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          Choose Your Role
        </h1>
        <p className="text-lg text-gray-600">
          Select the option that best describes you
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {roles.map((role) => (
          <RoleCard key={role.id} {...role} />
        ))}
      </motion.div>
    </div>
  );
}

export default function RoleSelector() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <RoleSelectorContent />
    </Suspense>
  );
}