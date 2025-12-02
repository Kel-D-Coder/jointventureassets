import { FiSearch, FiFilter, FiMoreHorizontal, FiCheck, FiX, FiClock } from 'react-icons/fi';

type RequestStatus = 'pending' | 'approved' | 'rejected';

interface Request {
  id: number;
  user: string;
  type: string;
  status: RequestStatus;
  date: string;
  description: string;
}

export default function RequestsPage() {
  // This would be fetched from your API
  const requests: Request[] = [
    {
      id: 1,
      user: 'John Doe',
      type: 'Withdrawal',
      status: 'pending',
      date: '2023-05-15',
      description: 'Request for withdrawal of $500',
    },
    {
      id: 2,
      user: 'Jane Smith',
      type: 'Verification',
      status: 'approved',
      date: '2023-05-14',
      description: 'Account verification request',
    },
  ];

  const getStatusBadge = (status: RequestStatus) => {
    const statusMap = {
      pending: { bg: 'bg-yellow-100 text-yellow-800', icon: FiClock },
      approved: { bg: 'bg-green-100 text-green-800', icon: FiCheck },
      rejected: { bg: 'bg-red-100 text-red-800', icon: FiX },
    };
    
    const { bg, icon: Icon } = statusMap[status];
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${bg}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Requests</h1>
          <p className="text-gray-500">Review and manage user requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search requests..."
              className="pl-8 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <FiFilter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button className="p-1.5 text-green-600 hover:bg-green-50 rounded">
                            <FiCheck className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                            <FiX className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">
                        <FiMoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
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