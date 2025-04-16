import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import { userManagementService } from '@/services/userManagement';
import UserManagement from './UserManagement';

// Mock the dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/userManagement');

describe('UserManagement', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { role: 'admin' }
    });
    (userManagementService.getUsers as jest.Mock).mockResolvedValue({
      success: true,
      data: mockUsers
    });
  });

  it('loads and displays users', async () => {
    render(<UserManagement />);

    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
      expect(userManagementService.getUsers).toHaveBeenCalled();
    });
  });

  it('handles user role updates', async () => {
    (userManagementService.updateUserRole as jest.Mock).mockResolvedValue({
      success: true
    });

    render(<UserManagement />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    // Find and click the role select for the regular user
    const roleSelect = screen.getAllByRole('combobox')[1]; // Second user's role select
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(userManagementService.updateUserRole).toHaveBeenCalledWith('2', 'admin');
    });
  });

  it('handles user deletion', async () => {
    (userManagementService.deleteUser as jest.Mock).mockResolvedValue({
      success: true
    });
    window.confirm = jest.fn(() => true);

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[1]; // Second user's delete button
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(userManagementService.deleteUser).toHaveBeenCalledWith('2');
      expect(window.confirm).toHaveBeenCalled();
    });
  });

  it('handles error when loading users', async () => {
    (userManagementService.getUsers as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch users')
    );

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch users');
    });
  });

  it('handles error when updating user role', async () => {
    (userManagementService.updateUserRole as jest.Mock).mockRejectedValue(
      new Error('Failed to update role')
    );

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    const roleSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(roleSelect, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to update role');
    });
  });

  it('handles error when deleting user', async () => {
    (userManagementService.deleteUser as jest.Mock).mockRejectedValue(
      new Error('Failed to delete user')
    );
    window.confirm = jest.fn(() => true);

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[1];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Failed to delete user');
    });
  });
});