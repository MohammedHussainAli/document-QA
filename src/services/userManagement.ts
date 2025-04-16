import { User, ApiResponse } from '../types';
import { mockUsers } from './mockServices';

export const userManagementService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true, data: mockUsers };
  },

  updateUserRole: async (userId: string, newRole: 'admin' | 'user'): Promise<ApiResponse<User>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      role: newRole,
      updatedAt: new Date()
    };

    return { success: true, data: mockUsers[userIndex] };
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'User not found' };
    }

    mockUsers.splice(userIndex, 1);
    return { success: true };
  }
};