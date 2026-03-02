"use server";
import { serverFetch } from "@/lib/fetcher";


export interface MealRateTrend {
  month: string;
  year: number;
  rate: number;
}

export interface ExpenseDistributionItem {
  name: string;
  value: number;
  percentage: number;
}

export interface ExpenseDistributionResponse {
  total: number;
  distribution: ExpenseDistributionItem[];
}

export interface MemberSettlement {
  memberId: string;
  memberName: string;
  profilePicture: string;
  meals: number;
  mealCost: number;
  fixedShare: number;
  totalLiability: number;
  deposited: number;
  balance: number;
}

export interface SettlementTotals {
  totalMembersCount: number;
  totalMeals: number;
  totalMealCost: number;
  totalFixedShare: number;
  totalLiability: number;
  totalDeposited: number;
  totalBalance: number;
}

export interface SettlementResponse {
  mealRate: number;
  settlement: MemberSettlement[];
  totals: SettlementTotals;
}

export const getMealRateTrend = async (months: number = 6, month?: number, year?: number): Promise<MealRateTrend[] | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("months", months.toString());
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/reports/meal-rate-trend?${queryParams}`);
    return response?.success ? response.data : null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch meal rate trend:", error);
    }
    return null;
  }
};

export const getExpenseDistribution = async (month?: number, year?: number): Promise<ExpenseDistributionResponse | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/reports/expense-distribution?${queryParams}`);
    return response?.success ? response.data : null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch expense distribution:", error);
    }
    return null;
  }
};

export const getSettlement = async (month?: number, year?: number): Promise<SettlementResponse | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/reports/settlement?${queryParams}`);
    return response?.success ? response.data : null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch settlement data:", error);
    }
    return null;
  }
};
