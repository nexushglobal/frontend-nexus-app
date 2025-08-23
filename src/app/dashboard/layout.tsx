import Navbar from '@/features/layout/components/NavbarDashboard';
import Sidebar from '@/features/layout/components/sidebar/Sidebar';
import React from 'react';

export default function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
