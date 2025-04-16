'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { qaService } from '@/services/mockServices';
import { Question, Document } from '@/types';

export default function QAInterface() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await qaService.getQuestions();
      if (response.success && response.data) {
        setQuestions(response.data);
      }
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');
      const response = await qaService.askQuestion(question, user.id);
      if (response.success && response.data) {
        setQuestions(prev => [response.data, ...prev]);
        setQuestion('');
      } else {
        setError('Failed to submit question');
      }
    } catch (err) {
      setError('An error occurred while submitting your question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Ask a Question</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Your Question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Ask your question here..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !question.trim()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Question'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Previous Questions & Answers</h3>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">Q</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-900 dark:text-white font-medium">{q.question}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Asked on {new Date(q.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="ml-11 mt-3">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-medium">A</span>
                        </div>
                      </div>
                      <div className="flex-grow">
                        <p className="text-gray-900 dark:text-white">{q.answer}</p>
                        {q.documentReferences && q.documentReferences.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">References:</p>
                            <div className="mt-1 space-y-1">
                              {q.documentReferences.map((docId) => (
                                <div
                                  key={docId}
                                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 cursor-pointer"
                                >
                                  Document #{docId}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No questions have been asked yet.
          </p>
        )}
      </div>
    </div>
  );
}