/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { serverFetch } from '@/lib/fetcher';
import { updateTag } from 'next/cache';

// GET CURRENT USER PROFILE
export const getMyProfile = async (): Promise<any> => {
  try {
    const result = await serverFetch('/auth/me', {
      method: 'GET',
      tags: ['profile'],
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch profile" };
  }
};

// UPDATE USER PROFILE
export const updateProfile = async (userData: any): Promise<any> => {
  try {
    const result = await serverFetch('/auth/profile', {
      method: 'PUT',
      body: userData,
    });
    if (result?.success) {
      updateTag('profile');
      updateTag('members');
      updateTag('dashboard-stats');
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update profile" };
  }
};

// CHANGE PASSWORD
export const changePassword = async (passwordData: any): Promise<any> => {
  try {
    const result = await serverFetch('/auth/change-password', {
      method: 'PUT',
      body: passwordData,
    });
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to change password" };
  }
};
