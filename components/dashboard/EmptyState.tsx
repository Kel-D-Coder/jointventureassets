"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <motion.div
        className="text-gray-300 mb-4"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 max-w-md">{description}</p>
      {action && (
        <motion.button
          onClick={action.onClick}
          className="bg-gray-900 hover:bg-yellow-500 text-white hover:text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl">+</span>
          {action.label}
        </motion.button>
      )}
    </motion.div>
  )
}
