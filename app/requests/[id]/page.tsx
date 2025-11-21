"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FiArrowLeft, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiTrash2 } from "react-icons/fi"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import axios from "axios"
import Link from "next/link"
import { Spinner } from "@/components/Spinner"

interface Request {
  _id: string
  title: string
  description: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt?: string
  // Add any additional fields that might come from the API
}

export default function RequestDetails() {
  const { id } = useParams()
  console.log(id)
  const router = useRouter()
  const [request, setRequest] = useState<Request | null>(null)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [success, setSuccess ] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { token } = useSelector((state: RootState) => state.auth)

  const handleDeleteRequest = async () => {
    try {
      setError("")
      setIsDeleteLoading(true)
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/request/delete`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setIsDeleteLoading(false)
      setError("")
      router.back()

    } catch (error: unknown) {
      setIsDeleteLoading(false)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong. Please try again.")
        console.log(error)
      } else {
        setError("Something went wrong. Please try again.")
      }

      setTimeout(() => {
        setError("")
      }, 5000)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/request/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setRequest(response.data.data)
        console.log(response.data.data)
      } catch (err) {
        console.error('Error fetching request details:', err)
        setError('Failed to load request details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id && token) {
      fetchRequestDetails()
    }
  }, [id, token])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="text-yellow-500" />
      case 'accepted':
        return <FiCheckCircle className="text-green-500" />
      case 'rejected':
        return <FiXCircle className="text-red-500" />
      default:
        return <FiClock className="text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Request</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Not Found</h2>
          <p className="text-gray-600 mb-6">The requested resource could not be found.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{request.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Created on {formatDate(request.createdAt)}
                </p>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
              <p className="text-gray-700 whitespace-pre-line">{request.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1 flex items-center">
                  {getStatusIcon(request.status)}
                  <span className="ml-2 capitalize">{request.status}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
              {request.updatedAt && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                  <p className="mt-1 text-gray-900">{formatDate(request.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <div className="flex justify-between">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:cursor-pointer hover:bg-red-600 hover:text-white"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this request?')) {
                    // Handle delete
                    handleDeleteRequest()
                  }
                }}
              >
                {isDeleteLoading ? (
                  <Spinner />
                
                ): (
                  <>
                    <FiTrash2 className="-ml-1 mr-2 h-5 w-5 text-gray-500 hover:text-white" />
                    Delete
                  </>
                )}
              </button>
              <div className="space-x-3">
                <Link
                  href={`/requests/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  <FiEdit className="-ml-1 mr-2 h-5 w-5" />
                  Edit Request
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Matches/Responses Section - Can be implemented later */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Responses</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500 text-center py-8">
                No responses yet. Check back later for updates.
              </p>
              {/* Responses list can be added here when the feature is implemented */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
