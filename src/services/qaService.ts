import { Question, Document, ApiResponse } from '../types';
import { documentService } from './documentService';

// In-memory storage for questions
let questions: Question[] = [];

// Helper function to find relevant documents for a question
const findRelevantDocuments = async (question: string): Promise<string[]> => {
  const response = await documentService.getDocuments();
  if (!response.success || !response.data) {
    return [];
  }

  // Simple keyword matching (in a real app, this would use more sophisticated NLP)
  const keywords = question.toLowerCase().split(' ');
  const relevantDocs = response.data.filter(doc => {
    const content = doc.content.toLowerCase();
    return keywords.some(keyword => content.includes(keyword));
  });

  return relevantDocs.map(doc => doc.id);
};

// Helper function to generate an answer based on relevant documents
const generateAnswer = async (question: string, documentRefs: string[]): Promise<string> => {
  if (documentRefs.length === 0) {
    return 'I could not find any relevant documents to answer your question. Please try rephrasing or ask something else.';
  }

  // Fetch relevant documents
  const relevantDocs: Document[] = [];
  for (const docId of documentRefs) {
    const response = await documentService.getDocument(docId);
    if (response.success && response.data) {
      relevantDocs.push(response.data);
    }
  }

  // Simple answer generation (in a real app, this would use an LLM)
  const combinedContent = relevantDocs.map(doc => doc.content).join(' ');
  const sentences = combinedContent.split('.');
  const relevantSentences = sentences.filter(sentence =>
    question.toLowerCase().split(' ').some(word =>
      sentence.toLowerCase().includes(word)
    )
  );

  if (relevantSentences.length > 0) {
    return relevantSentences.slice(0, 2).join('. ') + '.';
  }

  return 'Based on the available documents, I cannot provide a specific answer. Please try asking a different question.';
};

export const qaService = {
  askQuestion: async (question: string, userId: string): Promise<ApiResponse<Question>> => {
    try {
      // Find relevant documents
      const documentRefs = await findRelevantDocuments(question);

      // Generate answer
      const answer = await generateAnswer(question, documentRefs);

      // Create new question
      const newQuestion: Question = {
        id: String(Date.now()),
        question,
        answer,
        documentReferences: documentRefs,
        askedBy: userId,
        createdAt: new Date(),
      };

      // Add to questions array
      questions.push(newQuestion);

      return { success: true, data: newQuestion };
    } catch (error) {
      return { success: false, error: 'Failed to process question' };
    }
  },

  getQuestions: async (): Promise<ApiResponse<Question[]>> => {
    try {
      return { success: true, data: questions };
    } catch (error) {
      return { success: false, error: 'Failed to fetch questions' };
    }
  },

  getQuestion: async (id: string): Promise<ApiResponse<Question>> => {
    try {
      const question = questions.find(q => q.id === id);
      if (!question) {
        return { success: false, error: 'Question not found' };
      }
      return { success: true, data: question };
    } catch (error) {
      return { success: false, error: 'Failed to fetch question' };
    }
  },

  deleteQuestion: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const index = questions.findIndex(q => q.id === id);
      if (index === -1) {
        return { success: false, error: 'Question not found' };
      }
      questions.splice(index, 1);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete question' };
    }
  },
};