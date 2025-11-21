"use client"

import { motion } from "framer-motion"
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi"

type RequestStatus = 'pending' | 'accepted' | 'rejected'

interface Request {
  _id: string
  title: string
  description: string
  status: RequestStatus
  createdAt: string
}

interface RequestListProps {
  requests: Request[]
  onViewDetails: (id: string) => void
}

export default function RequestList({ requests, onViewDetails }: RequestListProps) {
  // const getStatusIcon = (status: RequestStatus) => {
  //   switch (status) {
  //     case 'pending':
  //       return <FiClock className="text-yellow-500" />
  //     case 'accepted':
  //       return <FiCheckCircle className="text-green-500" />
  //     case 'rejected':
  //       return <FiXCircle className="text-red-500" />
  //     default:
  //       return <FiClock className="text-gray-400" />
  //   }
  // }

  // const getStatusText = (status: RequestStatus) => {
  //   return status.charAt(0).toUpperCase() + status.slice(1)
  // }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <motion.div
          key={request._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer"
          onClick={() => onViewDetails(request._id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{request.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
              {/* <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-xs">
                {getStatusIcon(request.status)}
                <span>{getStatusText(request.status)}</span>
              </div> */}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
