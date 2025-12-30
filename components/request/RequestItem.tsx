// components/request/RequestItem.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiDollarSign, 
  FiUser, 
  FiTag, 
  FiArrowRight,
  FiCalendar,
  
} from 'react-icons/fi';

interface RequestItemProps {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  requestType: string;
  createdAt: string;
  budget?: number;
  fullName: string;
}

const statusConfig = {
  pending: {
    icon: <FiClock className="h-3.5 w-3.5" />,
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-100',
    ring: 'ring-yellow-100'
  },
  approved: {
    icon: <FiCheck className="h-3.5 w-3.5" />,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100',
    ring: 'ring-green-100'
  },
  rejected: {
    icon: <FiX className="h-3.5 w-3.5" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100',
    ring: 'ring-red-100'
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const RequestItem = ({
  id,
  title,
  status,
  requestType,
  createdAt,
  budget,
  fullName
}: RequestItemProps) => {
  // Ensure status is valid, default to 'pending' if not
  const validStatus = ['pending', 'approved', 'rejected'].includes(status) ? status : 'pending';
  const config = statusConfig[validStatus];
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link
        href={`/admin/requests/${id}`}
        className={`block p-4 rounded-xl border ${config.border} bg-white hover:shadow-sm transition-all duration-200 hover:ring-2 ${config.ring} hover:border-transparent`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.icon}
                <span className="ml-1.5">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </span>
              <span className="text-xs text-gray-500 flex items-center">
                <FiCalendar className="mr-1" size={12} />
                {formatDate(createdAt)}
              </span>
            </div>
            
            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
              {title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <FiUser className="mr-1.5 text-gray-400" size={14} />
                <span className="text-gray-700">{fullName}</span>
              </div>
              
              <div className="flex items-center">
                <FiTag className="mr-1.5 text-gray-400" size={14} />
                <span className="text-gray-700 capitalize">{requestType.replace(/-/g, ' ')}</span>
              </div>
              
              {budget !== undefined && (
                <div className="flex items-center">
                  <FiDollarSign className="mr-1.5 text-gray-400" size={14} />
                  <span className="text-gray-700">₦{budget.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0 flex items-center">
            <span className="text-gray-300 group-hover:text-gray-400 transition-colors">
              <FiArrowRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
};