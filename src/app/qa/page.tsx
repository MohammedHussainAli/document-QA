'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Container, CircularProgress } from '@mui/material';
import QAComponent from '@/components/qa/QAComponent';
import DocumentViewer from '@/components/documents/DocumentViewer';
import { Document } from '@/types';
import { documentService } from '@/services/mockServices';

export default function QAPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleDocumentClick = async (docId: string) => {
    try {
      const response = await documentService.getDocuments();
      if (response.success) {
        const doc = response.data.find(d => d.id === docId);
        if (doc) {
          setSelectedDocument(doc);
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ position: 'relative' }}>
          <QAComponent onDocumentClick={handleDocumentClick} />
          {selectedDocument && (
            <Box sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              width: '90vw',
              maxHeight: '90vh',
            }}>
              <DocumentViewer
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}