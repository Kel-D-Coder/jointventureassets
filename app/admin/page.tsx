import { FiUsers, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

// Simple card component for the dashboard
const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: React.ComponentType<{ className?: string }> }) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="rounded-full bg-blue-50 p-3">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

// Content card component
const ContentCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm h-full">
    <h3 className="text-lg font-medium mb-4">{title}</h3>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

// Request item component
const RequestItem = ({ name, id, status }: { name: string; id: string; status: 'pending' | 'approved' | 'rejected' }) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">Request #{id}</p>
      </div>
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

// User item component
const UserItem = ({ name, role, initials }: { name: string; role: string; initials: string }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded">
    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
      <span className="text-sm font-medium">{initials}</span>
    </div>
    <div>
      <p className="font-medium">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: FiUsers },
    { title: 'Pending Requests', value: '42', icon: FiClock },
    { title: 'Approved Requests', value: '856', icon: FiCheckCircle },
    { title: 'Rejected Requests', value: '23', icon: FiXCircle },
  ];

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
          <RequestItem name="John Doe" id="1234" status="pending" />
          <RequestItem name="Jane Smith" id="1233" status="approved" />
          <RequestItem name="Bob Johnson" id="1232" status="rejected" />
        </ContentCard>

        <ContentCard title="Recent Users">
          <UserItem name="John Doe" role="Investor" initials="JD" />
          <UserItem name="Jane Smith" role="Startup" initials="JS" />
          <UserItem name="Bob Johnson" role="Admin" initials="BJ" />
        </ContentCard>
      </div>
    </div>
  );
}
