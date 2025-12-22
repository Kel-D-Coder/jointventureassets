"use client"

import axios from 'axios';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/hooks';
import { Spinner } from '@/components/Spinner';
import { ContentCard } from '@/components/admin/ContentCard';
import { StatCard } from '@/components/admin/StatCard';
import { RequestItem } from '@/components/admin/RequestItem';

const getInitials = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

// User item component
const UserItem = ({ name, role, initials }: { name: string; role: string; initials: string }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
      <span className="text-sm font-medium">{initials}</span>
    </div>
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  // const [requestError, setRequestError] = useState(null);
  // const [userError, setUserError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const {token} = useAppSelector((state) => state.auth)


  const stats = [
    { title: 'Total Users', value: '1,234', icon: FiUsers },
    { title: 'Pending Requests', value: '42', icon: FiClock },
    { title: 'Approved Requests', value: approvedRequests.length.toString(), icon: FiCheckCircle },
    { title: 'Rejected Requests', value: '23', icon: FiXCircle },
  ];

  const getRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
      setLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log('Error fetching requests:', error.response?.data || error.message);
      }

    }
  }

   const getApprovedRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/requests/accepted`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setLoading(false);
        setApprovedRequests(response.data);
        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('Error fetching approved requests:', error.response?.data || error.message);
        }
      }
    }

  const getAllUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
      setUsersLoading(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log('Error fetching users:', error.response?.data || error.message);
      }
    }
  }

  useEffect(() => {
    getRequests();
    getAllUsers();
    getApprovedRequests();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening.</p>
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ContentCard title="Recent Requests">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ):
            (
              requests.slice(0, 4).map((request: any, index: number) => (
              <RequestItem name={request.fullName} id={request.id} status={request.status} key={index} />
            ))
            )
          }
        </ContentCard>

        <ContentCard title="All Users">
          {
            usersLoading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner />
              </div>
            ) : (
              users.reverse().slice(0, 4).map((user: any, index: number) => (
                <UserItem name={user.fullName} role={user.role} initials={getInitials(user.fullName)} key={index} />
              ))
            )
          }
        </ContentCard>
      </div>
    </div>
  );
}
