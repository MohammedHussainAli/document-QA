import { DocumentService } from './documentService';

describe('DocumentService', () => {
  let documentService: DocumentService;

  beforeEach(() => {
    documentService = new DocumentService();
    // Clear any mocked storage
    localStorage.clear();
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('uploadDocument', () => {
    it('successfully uploads a document', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const mockResponse = { id: '123', name: 'test.pdf', url: 'http://test.com/test.pdf' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await documentService.uploadDocument(mockFile);

      expect(result).toEqual({
        success: true,
        data: mockResponse
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles upload errors correctly', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const result = await documentService.uploadDocument(mockFile);
      expect(result).toEqual({
        success: false,
        error: 'Failed to upload document'
      });
    });
  });

  describe('getDocuments', () => {
    it('retrieves all documents successfully', async () => {
      const mockDocuments = [
        { id: '1', name: 'doc1.pdf', url: 'http://test.com/doc1.pdf' },
        { id: '2', name: 'doc2.pdf', url: 'http://test.com/doc2.pdf' }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockDocuments)
      });

      const result = await documentService.getDocuments();

      expect(result).toEqual({
        success: true,
        data: mockDocuments
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('handles retrieval errors correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await documentService.getDocuments();
      expect(result).toEqual({
        success: false,
        error: 'Failed to fetch documents'
      });
    });
  });

  describe('deleteDocument', () => {
    it('deletes a document successfully', async () => {
      const documentId = '123';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const result = await documentService.deleteDocument(documentId);
      
      expect(result).toEqual({
        success: true,
        data: undefined
      });
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(documentId),
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });

    it('handles deletion errors correctly', async () => {
      const documentId = '123';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      const result = await documentService.deleteDocument(documentId);
      expect(result).toEqual({
        success: false,
        error: 'Failed to delete document'
      });
    });
  });

  describe('searchDocuments', () => {
    it('searches documents successfully', async () => {
      const query = 'test';
      const mockResults = [
        { id: '1', name: 'test.pdf', url: 'http://test.com/test.pdf', matches: ['test content'] }
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResults)
      });

      const result = await documentService.searchDocuments(query);

      expect(result).toEqual(mockResults);
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/documents/search?q=${encodeURIComponent(query)}`
      );
    });

    it('handles search errors correctly', async () => {
      const query = 'test';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(documentService.searchDocuments(query)).rejects.toThrow('Failed to search documents');
    });
  });
});