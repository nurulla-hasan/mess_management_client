/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";

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

    const response = await serverFetch(`/expenses?${queryParams}`, {
      tags: ["expenses"],
    });
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

    const response = await serverFetch(`/expenses/stats?${queryParams}`, {
      tags: ["expense-stats"],
    });
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch expense stats:", error);
    return null;
  }
};

export async function addExpense(data: any) {
  try {
    const response = await serverFetch("/expenses", {
      method: "POST",
      body: data,
    });
    if (response?.success) {
      updateTag("expenses");
      updateTag("expense-stats");
      updateTag("dashboard-stats");
      updateTag("meal-summary");
    }
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateExpenseStatus(id: string, status: "approved" | "rejected") {
  try {
    const response = await serverFetch(`/expenses/${id}/status`, {
      method: "PUT",
      body: { status },
    });
    if (response?.success) {
      updateTag("expenses");
      updateTag("expense-stats");
      updateTag("dashboard-stats");
      updateTag("meal-summary");
    }
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
