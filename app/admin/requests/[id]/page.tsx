// app/admin/requests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAppSelector } from '@/hooks/hooks';
import { Spinner } from '@/components/Spinner';
import { toast } from 'react-hot-toast';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiUser, 
  FiTag, 
  FiMapPin, 
  FiClock,
  FiCheck,
  FiX,
  FiDownload,
  FiMail,
  FiPhone,
  FiClock as FiTimeline
} from 'react-icons/fi';
import Image from 'next/image';

interface Document {
  id: string;
  url: string;
  type: string;
  name: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
  requestId: string;
}

interface Request {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  requestType: string;
  developmentType: string;
  budget: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  timeline: string;
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

const statusConfig = {
  pending: {
    icon: <FiClock className="h-4 w-4" />,
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-100'
  },
  approved: {
    icon: <FiCheck className="h-4 w-4" />,
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-100'
  },
  rejected: {
    icon: <FiX className="h-4 w-4" />,
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-100'
  }
};

export default function RequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!token) {
        toast.error('Authentication required');
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/request/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRequest(response.data.data);
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching request:', error);
        toast.error('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, []);

  const handleStatusUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      setUpdating(true);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/requests/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      setRequest(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success(`Request ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Request not found</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const validStatus = ['pending', 'approved', 'rejected'].includes(request.status) ? request.status : 'pending';

  const status = statusConfig[validStatus];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <FiArrowLeft className="mr-2" />
          Back to Requests
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
            <p className="text-gray-600 mt-1">
              {request.developmentType} • {request.requestType}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
              {status.icon}
              <span className="ml-1.5">{validStatus.charAt(0).toUpperCase() + validStatus.slice(1)}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-900">{request.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                    <p className="mt-1 flex items-center text-gray-900">
                      <FiDollarSign className="mr-1.5 text-gray-400" />
                      ₦{parseInt(request.budget).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                    <p className="mt-1 flex items-center text-gray-900">
                      <FiTimeline className="mr-1.5 text-gray-400" />
                      {request.timeline}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p className="mt-1 flex items-center text-gray-900">
                      <FiMapPin className="mr-1.5 text-gray-400" />
                      {request.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date Submitted</h3>
                    <p className="mt-1 flex items-center text-gray-900">
                      <FiCalendar className="mr-1.5 text-gray-400" />
                      {new Date(request.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  <p className="flex items-center text-gray-900">
                    <FiUser className="mr-2 text-gray-400" />
                    {request.fullName}
                  </p>
                  <p className="flex items-center text-gray-900">
                    <FiMail className="mr-2 text-gray-400" />
                    <a href={`mailto:${request.email}`} className="hover:underline">
                      {request.email}
                    </a>
                  </p>
                  <p className="flex items-center text-gray-900">
                    <FiPhone className="mr-2 text-gray-400" />
                    <a href={`tel:${request.phoneNumber}`} className="hover:underline">
                      {request.phoneNumber}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents & Images</h2>
              {request.documents && request.documents.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {request.documents.map((doc, index) => (
                    <div 
                      key={index}
                      className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={doc}
                        alt={`Document ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <a
                        href={doc}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiDownload className="h-4 w-4 text-gray-700" />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No documents attached</p>
                </div>
              )}
            </div>
          </div>

          {request.status === 'pending' && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleStatusUpdate('rejected')}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={() => handleStatusUpdate('approved')}
                disabled={updating}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Approve'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}