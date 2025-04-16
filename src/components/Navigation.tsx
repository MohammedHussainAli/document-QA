'use client';

import { useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-2xl font-bold tracking-tight">Document AI</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`text-white transition-colors px-3 py-2 rounded-md text-sm font-medium ${pathname === '/' ? 'bg-white/20' : 'hover:text-indigo-200'}`}
              >
                Documents
              </Link>
              <Link 
                href="/qa" 
                className={`text-white transition-colors px-3 py-2 rounded-md text-sm font-medium ${pathname === '/qa' ? 'bg-white/20' : 'hover:text-indigo-200'}`}
              >
                Q&A
              </Link>
              {auth.user?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className={`text-white transition-colors px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin' ? 'bg-white/20' : 'hover:text-indigo-200'}`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg font-semibold">{auth.user?.name?.[0].toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium">
                {auth.user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}