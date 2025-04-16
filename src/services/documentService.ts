import { Document, ApiResponse } from '../types';

export class DocumentService {
  private documents: Document[] = [];

  private async processDocument(document: Document): Promise<void> {
    // Simulate document processing time (3-5 seconds)
    const processingTime = Math.random() * 2000 + 3000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Update document status to completed
    document.status = 'completed';
    document.updatedAt = new Date();
  }

  async uploadDocument(file: File): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to upload document' };
    }
  }

  async getDocuments(): Promise<ApiResponse<Document[]>> {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      return { success: true, data };      
    } catch (error) {
      return { success: false, error: 'Failed to fetch documents' };
    }
  }

  async getDocument(id: string): Promise<ApiResponse<Document>> {
    try {
      const response = await fetch(`/api/documents/${id}`);
      if (!response.ok) {
        throw new Error('Document not found');
      }
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Document not found' };
    }
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete document');
      }
      return { success: true, data: undefined };
    } catch (error) {
      return { success: false, error: 'Failed to delete document' };
    }
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const response = await fetch(`/api/documents/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search documents');
    }
    return response.json();
  }
}