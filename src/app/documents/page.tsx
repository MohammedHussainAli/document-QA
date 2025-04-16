'use client';

import React, { useState } from 'react';
import DocumentLayout from '@/components/documents/DocumentLayout';
import { Document } from '@/types';

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleCloseViewer = () => {
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <DocumentLayout
        selectedDocument={selectedDocument}
        onClose={handleCloseViewer}
      />
    </div>
  );
}