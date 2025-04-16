'use client';

import React, { useState, useEffect } from 'react';
import { Document, ApiResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock service for ingestion monitoring
const ingestionService = {
  getProcessingDocuments: async (): Promise<ApiResponse<Document[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Add dummy data for demonstration
    return {
      success: true,
      data: [
        { id: '1', title: 'Document 1', status: 'processing', createdAt: new Date().toISOString() },
        { id: '2', title: 'Document 2', status: 'completed', createdAt: new Date().toISOString() },
        { id: '3', title: 'Document 3', status: 'failed', createdAt: new Date().toISOString() },
      ]
    };
  },
  retryIngestion: async (documentId: string): Promise<ApiResponse<Document>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: {} as Document }; // This would be replaced with actual API call
  }
};

export default function IngestionStatus() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDocuments();
    // Poll for updates every 30 seconds
    const interval = setInterval(loadDocuments, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await ingestionService.getProcessingDocuments();
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError('Failed to load documents');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async (documentId: string) => {
    try {
      const response = await ingestionService.retryIngestion(documentId);
      if (response.success) {
        loadDocuments(); // Reload the document list
      } else {
        setError('Failed to retry ingestion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry ingestion');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p className="text-red-600 dark:text-red-400">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div role="status" className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Document Ingestion Status</h2>
      
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Upload Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{doc.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span role="status" className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                    doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {doc.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {doc.status === 'failed' && (
                    <button
                      onClick={() => handleRetry(doc.id)}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents are currently being processed
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}