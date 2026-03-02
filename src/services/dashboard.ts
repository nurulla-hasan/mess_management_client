/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { serverFetch } from "@/lib/fetcher";

export interface DashboardStats {
  activeMembers: number;
  messBalance: number;
  totalExpenses: number;
  currentMealRate: number;
  recentExpenses: any[];
  recentDeposits: any[];
  paymentAlerts: any[];
}

export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  try {
    const response = await serverFetch("/reports/dashboard");
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch dashboard stats:", error);
    }
    return null;
  }
};

export interface MemberDashboardStats {
  memberInfo: any;
  mealStats: {
    totalMeals: number;
    mealRate: number;
    estimatedCost: number;
    projectedCost: number;
  };
  financials: {
    totalDeposited: number;
    totalLiability: number;
    currentBalance: number;
  };
  recentMeals: any[];
  recentDeposits: any[];
  month: string;
}

export const getMemberDashboardStats = async (): Promise<MemberDashboardStats | null> => {
  try {
    const response = await serverFetch("/reports/member-dashboard");
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch member dashboard stats:", error);
    }
    return null;
  }
};
