'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/hooks/hooks';
import { Spinner } from '@/components/Spinner';
import { RequestItem } from '@/components/request/RequestItem';

interface Request {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/requests`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRequests(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(request => request.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-600">Manage and review all property development requests</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, i) => (
                <RequestItem
                
                    key={i}
                    id={request._id}
                    title={request.title}
                    status={request.status}
                    requestType={request.requestType}
                    createdAt={request.createdAt}
                    budget={parseInt(request.budget)}
                    fullName={request.fullName}
                  />
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                No requests found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}