import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthContext, AuthProvider, useAuth } from './AuthContext';
import { authService } from '../services/mockServices';

jest.mock('../services/mockServices', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn()
  }
}));

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-email">{user?.email}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  it('provides authentication context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
  });

  it('handles login successfully', async () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    (authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockUser
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');

    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });

  it('handles logout successfully', async () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    (authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockUser
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    // Then logout
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      logoutButton.click();
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('');
  });

  it('persists authentication state across renders', async () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' };
    (authService.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: mockUser
    });

    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Login
    const loginButton = screen.getByText('Login');
    await act(async () => {
      loginButton.click();
    });

    // Rerender the component
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });
});