"use client"

import { motion } from "framer-motion"
import { FiPlus, FiTrendingUp, FiMessageSquare, FiEye } from "react-icons/fi"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import StatCard from "@/components/dashboard/StatCard"
import SectionCard from "@/components/dashboard/SectionCard"
import EmptyState from "@/components/dashboard/EmptyState"
import QuickActions from "@/components/dashboard/QuickActions"

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
}

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return null
  }

  // Mock data - replace with actual data from API
  const stats = {
    myRequests: 0,
    active: 0,
    matched: 0,
    availableMatches: 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <motion.div
        className="absolute top-20 right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-40 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={headerVariants} className="mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            Welcome back, {user.fullName.split(" ")[0]}!
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Registered as a <span className="font-semibold text-yellow-600">{user.role}</span>
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiPlus size={24} />}
            label="My Requests"
            value={stats.myRequests}
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
            delay={0.1}
          />
          <StatCard
            icon={<FiTrendingUp size={24} />}
            label="Active"
            value={stats.active}
            bgColor="bg-green-100"
            iconColor="text-green-600"
            delay={0.2}
          />
          <StatCard
            icon={<FiMessageSquare size={24} />}
            label="Matched"
            value={stats.matched}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
            delay={0.3}
          />
          <StatCard
            icon={<FiEye size={24} />}
            label="Available Matches"
            value={stats.availableMatches}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
            delay={0.4}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Requests Section */}
          <SectionCard
            title="My Requests"
            action={{
              label: "New Request",
              onClick: () => router.push("/submit-request"),
            }}
            delay={0.5}
          >
            <EmptyState
              icon={<FiPlus size={64} />}
              title="No requests yet"
              description="Create your first request to get matched with partners"
              action={{
                label: "Create Request",
                onClick: () => router.push("/submit-request"),
              }}
            />
          </SectionCard>

          {/* Available Opportunities Section */}
          <SectionCard
            title="Available Opportunities"
            action={{
              label: "Browse All",
              onClick: () => router.push("/browse-opportunities"),
            }}
            delay={0.6}
          >
            <EmptyState
              icon={<FiEye size={64} />}
              title="No opportunities available"
              description="Check back later for new partnership opportunities"
            />
          </SectionCard>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </motion.div>
    </div>
  )
}
