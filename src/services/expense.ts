"use server";
import { serverFetch } from "@/lib/fetcher";

export interface Expense {
  _id: string;
  date: string;
  buyerId: {
    _id: string;
    userId: {
      fullName: string;
      profilePicture?: string;
    };
  };
  category: "meat_fish" | "vegetables" | "groceries" | "utility" | "other";
  items: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  receiptUrl?: string;
  paymentSource: string;
  adjustment: number;
  addedBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface ExpenseStats {
  totalExpense: number;
  remainingBudget: number;
  monthlyBudget: number;
  categoryBreakdown: Record<string, number>;
  totalEntries: number;
}

export interface ExpenseResponse {
  expenses: Expense[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getExpenses = async (
  month?: number,
  year?: number,
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  buyerId?: string
): Promise<ExpenseResponse | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (category) queryParams.append("category", category);
    if (search) queryParams.append("search", search);
    if (buyerId) queryParams.append("buyerId", buyerId);

    const response = await serverFetch(`/expenses?${queryParams}`);
    if (response?.success) {
      return {
        expenses: response.data,
        pagination: response.pagination,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return null;
  }
};

export const getExpenseStats = async (
  month?: number,
  year?: number
): Promise<ExpenseStats | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/expenses/stats?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch expense stats:", error);
    return null;
  }
};
