import { mockUsers, authService, documentService, qaService } from './mockServices';
import { User, Document, Question } from '../types';

describe('mockServices', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('authService', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password';

      const result = await authService.login(email, password);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      });
    });

    it('should fail login with invalid credentials', async () => {
      const email = 'invalid@example.com';
      const password = 'password';

      const result = await authService.login(email, password);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should register a new user successfully', async () => {
      const email = 'newuser@example.com';
      const password = 'password';
      const name = 'New User';

      const result = await authService.register(email, password, name);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        email,
        name,
        role: 'user'
      });
    });
  });

  describe('documentService', () => {
    it('should upload a document successfully', async () => {
      const title = 'Test Document';
      const content = 'Test Content';
      const userId = '1';

      const result = await documentService.uploadDocument(title, content, userId);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        title,
        content,
        uploadedBy: userId,
        status: 'processing'
      });
    });

    it('should get all documents sorted by creation date', async () => {
      const result = await documentService.getDocuments();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);

      // Check if documents are sorted by creation date (newest first)
      const dates = result.data.map(doc => doc.createdAt.getTime());
      const sortedDates = [...dates].sort((a, b) => b - a);
      expect(dates).toEqual(sortedDates);
    });

    it('should delete a document successfully', async () => {
      const result = await documentService.deleteDocument('1');
      expect(result.success).toBe(true);
    });

    it('should fail when deleting non-existent document', async () => {
      const result = await documentService.deleteDocument('999');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Document not found');
    });
  });

  describe('qaService', () => {
    it('should create a new question successfully', async () => {
      const question = 'Test Question?';
      const userId = '1';

      const result = await qaService.askQuestion(question, userId);
      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        question,
        askedBy: userId,
        documentReferences: expect.any(Array)
      });
    });

    it('should get all questions', async () => {
      const result = await qaService.getQuestions();
      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});