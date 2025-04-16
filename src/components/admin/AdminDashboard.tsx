'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserManagement from './UserManagement';
import IngestionStatus from './IngestionStatus';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'ingestion'>('users');

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p className="text-red-600 dark:text-red-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`${
              activeTab === 'ingestion'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Ingestion Status
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'users' ? <UserManagement /> : <IngestionStatus />}
      </div>
    </div>
  );
}