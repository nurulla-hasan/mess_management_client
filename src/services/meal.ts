"use server";
import { serverFetch } from "@/lib/fetcher";

export interface Meal {
  _id: string;
  date: string;
  entries: {
    memberId: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    guest: number;
    requestedOff: boolean;
  }[];
  totalMeals: number;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealSummary {
  month: number;
  year: number;
  totalMeals: number;
  totalBazar: number;
  currentRate: number;
  extraCosts: number;
  totalExpense: number;
  daysWithMeals: number;
}

export const getMeals = async (
  month?: number,
  year?: number
): Promise<Meal[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/meals?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch meals:", error);
    }
    return null;
  }
};

export const getMealSummary = async (
  month?: number,
  year?: number
): Promise<MealSummary | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/meals/summary?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch meal summary:", error);
    }
    return null;
  }
};
