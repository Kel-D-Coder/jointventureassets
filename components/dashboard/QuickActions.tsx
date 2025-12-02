"use client"

import { motion } from "framer-motion"
import { FiPlus, FiSearch, FiCalendar } from "react-icons/fi"
import { useRouter } from "next/navigation"

const actions = [
  {
    icon: <FiPlus size={24} />,
    label: "Submit New Request",
    description: "Create a new partnership request",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    href: "/submit-request",
  },
  {
    icon: <FiSearch size={24} />,
    label: "Browse Opportunities",
    description: "Find new partnership opportunities",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    href: "/browse-requests",
  },
  {
    icon: <FiCalendar size={24} />,
    label: "Book Consultation",
    description: "Schedule a meeting with partners",
    color: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
    href: "contact",
  },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.label}
            onClick={() => router.push(action.href)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl transition-all duration-300 text-left group relative overflow-hidden hover:cursor-pointer`}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
              initial={false}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative z-10">
              <motion.div
                className="mb-3"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {action.icon}
              </motion.div>
              <h3 className="font-semibold text-lg mb-1">{action.label}</h3>
              <p className="text-sm opacity-90">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
