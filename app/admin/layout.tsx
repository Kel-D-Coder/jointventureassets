'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { FiMenu } from 'react-icons/fi';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with toggle functionality */}
      <div
        className={`
          ${isSidebarOpen ? 'w-64' : 'w-0'}
          transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with toggle button */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
            >
              <FiMenu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}