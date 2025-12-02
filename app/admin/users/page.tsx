import { FiSearch, FiPlus, FiMoreHorizontal, FiUser, FiMail, FiShield, FiCheckCircle, FiXCircle } from 'react-icons/fi';

type UserStatus = 'active' | 'inactive' | 'suspended';
type UserRole = 'admin' | 'user' | 'moderator';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
}

export default function UsersPage() {
  // This would be fetched from your API
  const users: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'admin', 
      status: 'active',
      lastActive: '2023-05-15 14:30'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'user', 
      status: 'active',
      lastActive: '2023-05-16 09:15'
    },
  ];

  const getStatusBadge = (status: UserStatus) => {
    const statusMap = {
      active: { bg: 'bg-green-100 text-green-800', icon: FiCheckCircle },
      inactive: { bg: 'bg-gray-100 text-gray-800', icon: FiUser },
      suspended: { bg: 'bg-red-100 text-red-800', icon: FiXCircle },
    };
    
    const { bg, icon: Icon } = statusMap[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const roleMap = {
      admin: { bg: 'bg-purple-100 text-purple-800', icon: FiShield },
      user: { bg: 'bg-blue-100 text-blue-800', icon: FiUser },
      moderator: { bg: 'bg-yellow-100 text-yellow-800', icon: FiShield },
    };
    
    const { bg, icon: Icon } = roleMap[role] || roleMap.user;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}>
        <Icon className="h-3 w-3" />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500">Manage your users and their permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search users..."
              className="pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <FiPlus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                      <FiMoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}