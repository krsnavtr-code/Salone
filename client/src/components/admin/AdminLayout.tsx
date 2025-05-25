import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <AdminNav />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
