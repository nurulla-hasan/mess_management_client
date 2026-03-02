/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FieldValues } from 'react-hook-form';
import { serverFetch } from '@/lib/fetcher';


// SIGN IN (With Role Check)
export const signInUser = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/login', {
      method: 'POST',
      body: userData,
      isPublic: true,
    });

    if (result?.success) {
      const accessToken = result?.data?.accessToken;
      const decodedData: any = jwtDecode(accessToken);

      // ROLE CHECK
      const allowedRoles = ['member', 'admin'];
      if (!allowedRoles.includes(decodedData?.role)) {
        return {
          success: false,
          message: "You are not authorized to access this panel!",
        };
      }

      const cookieStore = await cookies();
      cookieStore.set('accessToken', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      cookieStore.set('refreshToken', result?.data?.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      // Return redirect path based on role
      let redirectPath = '/';
      if (decodedData?.role === 'member') {
        redirectPath = '/member';
      } else if (decodedData?.role === 'admin') {
        redirectPath = '/';
      }

      return { 
        ...result, 
        redirectPath 
      };
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

// REGISTRATION
export const registerUser = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/register', {
      method: 'POST',
      body: userData,
      isPublic: true,
    });

    if (result?.success) {
      // Do not set cookies here. Let the user verify email first.
      // const accessToken = result?.data?.accessToken;
      
      // if (accessToken) {
      //   const cookieStore = await cookies();
      //   cookieStore.set('accessToken', accessToken, {
      //     httpOnly: false,
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'lax',
      //   });
      //   cookieStore.set('refreshToken', result?.data?.refreshToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     sameSite: 'lax',
      //   });
      // }
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

// VERIFY EMAIL
export const verifyEmail = async (data: FieldValues): Promise<any> => {
    try {
        const result = await serverFetch('/auth/verify-email', {
            method: 'POST',
            body: data,
            isPublic: true,
        });
        return result;
    } catch (error: any) {
        return { success: false, message: error?.message || "Verification failed" };
    }
}

// RESEND VERIFICATION CODE
export const resendVerificationCode = async (email: string): Promise<any> => {
    try {
        const result = await serverFetch('/auth/resend-code', {
            method: 'POST',
            body: { email },
            isPublic: true,
        });
        return result;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to resend code" };
    }
}

// FORGOT PASSWORD
export const forgotPassword = async (data: FieldValues): Promise<any> => {
    try {
        const result = await serverFetch('/auth/forgot-password', {
            method: 'POST',
            body: data,
            isPublic: true,
        });
        return result;
    } catch (error: any) {
        return { success: false, message: error?.message || "Request failed" };
    }
}

// RESET PASSWORD
export const resetPassword = async (data: FieldValues): Promise<any> => {
    try {
        const result = await serverFetch('/auth/reset-password', {
            method: 'POST',
            body: data,
            isPublic: true,
        });
        return result;
    } catch (error: any) {
        return { success: false, message: error?.message || "Reset failed" };
    }
}

// CHANGE PASSWORD
export const changePassword = async (data: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/change-password', {
      method: 'PUT',
      body: data,
    });

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// GET NEW ACCESS TOKEN
export const getNewAccessToken = async (refreshToken: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    return await res.json();
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to get new token" };
  }
};

// UPDATE USER DATA
export const updateUserData = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch('/auth/profile', {
      method: 'PUT',
      body: userData,
    });

    if (result?.success) {
      // Optionally update token if user data in token changes, but usually profile update doesn't change token unless role/email changes
      // (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// GET CURRENT USER
export const getCurrentUser = async (): Promise<any> => {
  try {
    const result = await serverFetch('/auth/me');
    return result?.data?.user || null;
  } catch {
    return null;
  }
};

// LOGOUT
export const logOut = async (): Promise<any> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to logout" };
  }
};

export const updateProfile = async (formData: FormData): Promise<any> => {
  try {
    const response = await serverFetch('/settings/profile', {
      method: 'PUT',
      body: formData,
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};