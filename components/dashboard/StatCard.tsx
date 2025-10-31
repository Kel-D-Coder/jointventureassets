"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  label: string
  value: number
  bgColor: string
  iconColor: string
  delay?: number
}

export default function StatCard({ icon, label, value, bgColor, iconColor, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)" }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 relative overflow-hidden group"
    >
      {/* Background decoration */}
      <motion.div
        className={`absolute -right-4 -top-4 w-24 h-24 ${bgColor} rounded-full opacity-10 blur-2xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut",
        }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
          <motion.p
            className="text-3xl font-bold text-gray-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.p>
        </div>
        <motion.div
          className={`${bgColor} ${iconColor} p-3 rounded-lg`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  )
}
