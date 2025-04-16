import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import Navigation from './Navigation';
import { AuthContext } from '@/contexts/AuthContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn()
}));

describe('Navigation Component', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn()
  };

  const mockAuthContext = {
    user: { name: 'Test User', role: 'user' },
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: true
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders navigation links when authenticated', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Navigation />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Q&A')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles logout correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Navigation />
      </AuthContext.Provider>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockAuthContext.logout).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('shows admin link for admin users', () => {
    const adminAuthContext = {
      ...mockAuthContext,
      user: { ...mockAuthContext.user, role: 'admin' }
    };

    render(
      <AuthContext.Provider value={adminAuthContext}>
        <Navigation />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies active styling to current route', () => {
    (usePathname as jest.Mock).mockReturnValue('/qa');

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Navigation />
      </AuthContext.Provider>
    );

    const qaLink = screen.getByText('Q&A').closest('a');
    expect(qaLink).toHaveClass('bg-white/20');
  });
});