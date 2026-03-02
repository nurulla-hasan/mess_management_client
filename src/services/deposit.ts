/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/fetcher";

export interface Deposit {
  _id: string;
  memberId: {
    _id: string;
    userId: {
      fullName: string;
      email: string;
      phone: string;
    };
  };
  amount: number;
  paymentMethod: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
  verifiedBy?: {
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export interface DepositSummary {
  month: number;
  year: number;
  totalCollected: number;
  count: number;
}

export const getAllDeposits = async (
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<{ deposits: any[]; pagination: any } | null> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (status) queryParams.append("status", status);

    const response = await serverFetch(`/deposits?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    // Suppress auth errors during logout/redirect
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch deposits:", error);
    }
    return null;
  }
};

export const getDepositSummary = async (
  month?: number,
  year?: number
): Promise<DepositSummary | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month.toString());
    if (year) queryParams.append("year", year.toString());

    const response = await serverFetch(`/deposits/summary?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch deposit summary:", error);
    }
    return null;
  }
};
