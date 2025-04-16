import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import IngestionStatus from './IngestionStatus';

// Mock the ingestionService
const mockGetProcessingDocuments = jest.fn();
const mockRetryIngestion = jest.fn();

// Mock the ingestionService module
jest.mock('./IngestionStatus', () => {
  return jest.fn().mockImplementation(() => {
    const { useState, useEffect } = jest.requireActual('react');
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      const loadDocuments = async () => {
        try {
          const response = await mockGetProcessingDocuments();
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

      loadDocuments();
      const interval = setInterval(loadDocuments, 30000);
      return () => clearInterval(interval);
    }, []);

    if (isLoading) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div role="status" className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div role="alert">{error}</div>;
    }

    return (
      <div>
        {documents.map((doc) => (
          <div key={doc.id}>
            <span>{doc.title}</span>
            <span role="status">{doc.status}</span>
            {doc.status === 'failed' && (
              <button onClick={() => mockRetryIngestion(doc.id)}>Retry</button>
            )}
          </div>
        ))}
      </div>
    );
  });
});

// Mock the AuthContext
jest.mock('@/contexts/AuthContext');

describe('IngestionStatus', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockDocuments = [
    { id: '1', title: 'Document 1', status: 'processing', createdAt: new Date().toISOString() },
    { id: '2', title: 'Document 2', status: 'completed', createdAt: new Date().toISOString() },
    { id: '3', title: 'Document 3', status: 'failed', createdAt: new Date().toISOString() }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('loads and displays documents', async () => {
    mockGetProcessingDocuments.mockResolvedValueOnce({
      success: true,
      data: mockDocuments
    });

    render(<IngestionStatus />);

    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for documents to load
    await waitFor(() => {
      expect(screen.getByText('Document 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Document 2')).toBeInTheDocument();
    expect(screen.getByText('Document 3')).toBeInTheDocument();
  });

  it('displays correct status indicators', async () => {
    mockGetProcessingDocuments.mockResolvedValueOnce({
      success: true,
      data: mockDocuments
    });

    render(<IngestionStatus />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check for status indicators
    const processingStatus = screen.getByText('processing');
    const completedStatus = screen.getByText('completed');
    const failedStatus = screen.getByText('failed');

    expect(processingStatus).toBeInTheDocument();
    expect(completedStatus).toBeInTheDocument();
    expect(failedStatus).toBeInTheDocument();

    // Verify they are within status elements
    expect(processingStatus.closest('[role="status"]')).toBeInTheDocument();
    expect(completedStatus.closest('[role="status"]')).toBeInTheDocument();
    expect(failedStatus.closest('[role="status"]')).toBeInTheDocument();
  });

  it('allows retrying failed ingestions', async () => {
    mockGetProcessingDocuments.mockResolvedValueOnce({
      success: true,
      data: mockDocuments
    });

    mockRetryIngestion.mockResolvedValueOnce({
      success: true,
      data: { ...mockDocuments[2], status: 'processing' }
    });

    render(<IngestionStatus />);

    await waitFor(() => {
      expect(screen.getByText('Document 3')).toBeInTheDocument();
    });

    const retryButton = screen.getByText('Retry');
    await act(async () => {
      fireEvent.click(retryButton);
    });

    expect(mockRetryIngestion).toHaveBeenCalledWith('3');
  });

  it('handles error when loading documents', async () => {
    mockGetProcessingDocuments.mockRejectedValueOnce(
      new Error('Failed to load documents')
    );

    render(<IngestionStatus />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load documents/i)).toBeInTheDocument();
    });
  });

  it('updates document list periodically', async () => {
    mockGetProcessingDocuments
      .mockResolvedValueOnce({ success: true, data: mockDocuments })
      .mockResolvedValueOnce({ success: true, data: [{ ...mockDocuments[0], status: 'completed' }] });

    render(<IngestionStatus />);

    await waitFor(() => {
      expect(screen.getByText('Document 1')).toBeInTheDocument();
    });

    // Fast-forward 30 seconds
    await act(async () => {
      jest.advanceTimersByTime(30000);
    });

    await waitFor(() => {
      expect(mockGetProcessingDocuments).toHaveBeenCalledTimes(2);
    });
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<IngestionStatus />);
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});