import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white py-10 overflow-hidden shadow-xl sm:rounded-lg">
          Home
        </div>
      </div>
    </div>
  );
}

Dashboard.layout = (page: JSX.Element) => (
  <AppLayout
    children={page}
    title="Dashboard"
    renderHeader={() => (
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">
        Dashboard
      </h2>
    )}
  />
);
