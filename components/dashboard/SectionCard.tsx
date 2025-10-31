"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface SectionCardProps {
  title: string
  action?: {
    label: string
    onClick: () => void
  }
  children: ReactNode
  delay?: number
}

export default function SectionCard({ title, action, children, delay = 0 }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {action && (
          <motion.button
            onClick={action.onClick}
            className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {action.label}
            <span className="text-lg">→</span>
          </motion.button>
        )}
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  )
}
