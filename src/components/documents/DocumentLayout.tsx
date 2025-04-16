'use client';

import React from 'react';
import DocumentUpload from './DocumentUpload';
import DocumentViewer from './DocumentViewer';
import { Document } from '@/types';

interface DocumentLayoutProps {
  selectedDocument?: Document | null;
  onClose: () => void;
}

export default function DocumentLayout({ selectedDocument, onClose }: DocumentLayoutProps) {
  return (
    <div className="container mx-auto px-2 sm:px-4 h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4">
      {/* Upload and Document List Section */}
      <div className="w-full lg:w-1/3 h-full flex flex-col gap-4">
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 h-auto">
          <DocumentUpload />
        </div>
        <div className="flex-1 bg-gray-800/90 rounded-lg shadow-sm p-4 overflow-hidden">
          <DocumentList />
        </div>
      </div>

      {/* Preview Section */}
      <div className="w-full lg:w-2/3 h-full flex items-start bg-gray-50 dark:bg-gray-800 rounded-lg">
        {selectedDocument ? (
          <DocumentViewer document={selectedDocument} onClose={onClose} />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-4">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Select a document to preview
            </p>
          </div>
        )}
      </div>
    </div>
  );
}