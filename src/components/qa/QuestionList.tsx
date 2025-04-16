'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Question, Document } from '@/types';
import { qaService } from '@/services/qaService';
import { documentService } from '@/services/documentService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function QuestionList() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [referencedDocs, setReferencedDocs] = useState<Record<string, Document>>({});

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [questions]);

  useEffect(() => {
    if (user?.id && questions.length === 0) {
      fetchQuestions();
    }
  }, [user?.id, questions.length]);

  const fetchReferencedDocuments = async (docIds: string[]) => {
    const uniqueDocIds = [...new Set(docIds)];
    const docs: Record<string, Document> = {};
    
    for (const id of uniqueDocIds) {
      if (!referencedDocs[id]) {
        try {
          const response = await documentService.getDocument(id);
          if (response.success && response.data) {
            docs[id] = response.data;
          }
        } catch (error) {
          console.error(`Failed to fetch document ${id}:`, error);
        }
      }
    }
    
    setReferencedDocs(prev => ({ ...prev, ...docs }));
  };

  const handleDelete = async (questionId: string) => {
    try {
      const response = await qaService.deleteQuestion(questionId);
      if (response.success) {
        setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
      } else {
        setError('Failed to delete question');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await qaService.getQuestions();
      if (response.success && response.data) {
        setQuestions(response.data);
        const allDocIds = response.data.flatMap(q => q.documentReferences);
        await fetchReferencedDocuments(allDocIds);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-400/20 border-t-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-gray-900">
        <div className="text-red-400 bg-red-900/20 border border-red-500/20 px-6 py-4 rounded-xl backdrop-blur-sm">{error}</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-gray-800/30 rounded-2xl border border-gray-700/30 backdrop-blur-xl">
        <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-medium text-gray-300 mb-2">No questions yet</p>
        <p className="text-gray-400">Be the first to ask a question!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-gray-900/95 backdrop-blur-lg rounded-xl border border-gray-800/50 shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <svg className="w-8 h-8 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Questions
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sortedQuestions.map((question) => (
          <div
            key={question.id}
            className="group bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:from-gray-700/90 hover:to-gray-600/90 transition-all duration-300 overflow-hidden border border-gray-600/30 backdrop-blur-xl"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-900/30 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-800/40 ring-2 ring-indigo-500/30 group-hover:ring-indigo-400/50">
                    <span className="text-indigo-400 font-semibold">Q</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                      {question.question}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Asked on {format(new Date(question.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                {(user?.role === 'admin' || question.askedBy === user?.id) && (
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                    aria-label="Delete question"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 ring-2 ring-green-500/30">
                  <span className="text-green-400 font-semibold">A</span>
                </div>
                <div className="flex-1 bg-green-900/10 rounded-xl p-4 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:bg-green-900/20 border border-green-500/20 group-hover:border-green-400/30">
                  <p className="text-gray-300 leading-relaxed">
                    {question.answer}
                  </p>
                </div>
              </div>

              {question.documentReferences.length > 0 && (
                <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                  <p className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Referenced Documents
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {question.documentReferences.map((ref, index) => (
                      <button
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-800/50 border border-gray-600/50 text-indigo-400 hover:bg-indigo-900/20 transition-colors backdrop-blur-sm group-hover:border-indigo-500/30"
                        onClick={() => console.log('View document:', ref)}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Doc #{ref}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}