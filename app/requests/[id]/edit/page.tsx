"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { FiArrowLeft } from "react-icons/fi"
import { Spinner } from "@/components/Spinner"

interface Request {
  _id: string
  title: string
  description: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
  updatedAt?: string
}

export default function EditRequestPage() {
  const { id } = useParams()
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.auth)

  const [request, setRequest] = useState<Request | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/request/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        const data: Request = response.data.data
        setRequest(data)
        setTitle(data.title)
        setDescription(data.description)
      } catch (err: unknown) {
        setIsLoading(false)
        setRequest(null)
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Something went wrong while loading the request.",
          )
        } else {
          setError("Something went wrong while loading the request.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (id && token) {
      fetchRequestDetails()
    }
  }, [id, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      setIsSubmitting(true)

      // NOTE: Adjust this endpoint/method/body shape to match your backend API
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/request/update`,
        {
          title,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setSuccess("Request updated successfully.")

      setTimeout(() => {
        router.push(`/requests/${id}`)
      }, 800)
    } catch (err: any) {
      console.error("Error updating request:", err)
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while updating the request.",
        )
      } else {
        setError("Something went wrong while updating the request.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center text-gray-600">
          <Spinner />
          <p>Loading request details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-yellow-600 hover:text-yellow-700 transition-colors mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow sm:rounded-lg p-6 sm:p-8"
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Edit Request
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Update the details of your request below.
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => router.push(`/requests/${id}`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                    inline-flex items-center px-4 py-2 border border-transparent text-sm
                    font-medium rounded-md shadow-sm text-white
                    bg-yellow-500 hover:bg-yellow-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-800
                    ${isSubmitting ? "bg-gray-800 opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
