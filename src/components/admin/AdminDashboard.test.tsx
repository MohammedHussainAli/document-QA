import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext');

// Mock the child components
jest.mock('./UserManagement', () => {
  return function MockUserManagement() {
    return <div data-testid="user-management">User Management Component</div>;
  };
});

jest.mock('./IngestionStatus', () => {
  return function MockIngestionStatus() {
    return <div data-testid="ingestion-status">Ingestion Status Component</div>;
  };
});

describe('AdminDashboard', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows access denied message for non-admin users', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'user' }
    });

    render(<AdminDashboard />);
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('shows access denied message when no user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null
    });

    render(<AdminDashboard />);
    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });

  it('renders dashboard for admin users', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' }
    });

    render(<AdminDashboard />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Ingestion Status')).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' }
    });

    render(<AdminDashboard />);

    // Should show UserManagement by default
    expect(screen.getByTestId('user-management')).toBeInTheDocument();

    // Switch to Ingestion Status
    fireEvent.click(screen.getByText('Ingestion Status'));
    expect(screen.getByTestId('ingestion-status')).toBeInTheDocument();

    // Switch back to User Management
    fireEvent.click(screen.getByText('User Management'));
    expect(screen.getByTestId('user-management')).toBeInTheDocument();
  });

  it('applies correct styles to active tab', () => {
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' }
    });

    render(<AdminDashboard />);

    const userManagementTab = screen.getByText('User Management');
    const ingestionStatusTab = screen.getByText('Ingestion Status');

    // User Management should be active by default
    expect(userManagementTab.className).toContain('border-indigo-500');
    expect(ingestionStatusTab.className).toContain('border-transparent');

    // Switch to Ingestion Status
    fireEvent.click(ingestionStatusTab);
    expect(userManagementTab.className).toContain('border-transparent');
    expect(ingestionStatusTab.className).toContain('border-indigo-500');
  });
});