import { User, Document, Question, ApiResponse } from '../types';

// Mock data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Initialize with some sample data for better UX
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Getting Started Guide',
    content: 'Welcome to our document management system...',
    uploadedBy: '1',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000)
  }
];

const mockQuestions: Question[] = [
  {
    id: '1',
    question: 'How do I upload a document?',
    answer: 'You can upload a document by clicking the "Upload" button and selecting your file.',
    documentReferences: ['1'],
    askedBy: '2',
    createdAt: new Date(Date.now() - 43200000) // 12 hours ago
  }
];

// Auth mock service
export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<User>> => {
    // In test environment, resolve immediately
    if (process.env.NODE_ENV === 'test') {
      const user = mockUsers.find(u => u.email === email);
      return user 
        ? { success: true, data: user }
        : { success: false, error: 'Invalid credentials' };
    }
    
    // Simulate API delay in non-test environment
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = mockUsers.find(u => u.email === email);
    return user 
      ? { success: true, data: user }
      : { success: false, error: 'Invalid credentials' };
  },

  register: async (email: string, password: string, name: string): Promise<ApiResponse<User>> => {
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return { success: true, data: newUser };
  },
};

// Document mock service
export const documentService = {
  uploadDocument: async (title: string, content: string, userId: string): Promise<ApiResponse<Document>> => {
    const newDoc: Document = {
      id: String(mockDocuments.length + 1),
      title,
      content,
      uploadedBy: userId,
      status: 'processing',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDocuments.push(newDoc);
    return { success: true, data: newDoc };
  },

  getDocuments: async (): Promise<ApiResponse<Document[]>> => {
    // Sort documents by creation date, newest first
    const sortedDocuments = [...mockDocuments].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    return { success: true, data: sortedDocuments };
  },

  deleteDocument: async (docId: string): Promise<ApiResponse<void>> => {
    const index = mockDocuments.findIndex(doc => doc.id === docId);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Document not found' };
  },
};

// Q&A mock service
export const qaService = {
  askQuestion: async (question: string, userId: string): Promise<ApiResponse<Question>> => {
    const newQuestion: Question = {
      id: String(mockQuestions.length + 1),
      question,
      answer: 'This is a mock answer generated for testing purposes.',
      documentReferences: ['1', '2'],
      askedBy: userId,
      createdAt: new Date(),
    };
    mockQuestions.push(newQuestion);
    return { success: true, data: newQuestion };
  },

  getQuestions: async (): Promise<ApiResponse<Question[]>> => {
    return { success: true, data: mockQuestions };
  },
};