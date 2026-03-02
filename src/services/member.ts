
"use server";
import { serverFetch } from "@/lib/fetcher";
import { PaginationMeta } from "@/types/global.types";

export interface Member {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: "admin" | "member";
    profilePicture?: string;
    isActive: boolean;
    joinDate: string;
  };
  totalMeals: number;
  totalDeposits: number;
  currentBalance: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface MemberStats {
  totalMembers: number;
  totalBalance: number;
  pendingSettlements: number;
}

export interface GetMembersResponse {
  members: Member[];
  pagination: PaginationMeta;
}

export const getMembers = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<GetMembersResponse | null> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await serverFetch(`/members?${queryParams}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch members:", error);
    }
    return null;
  }
};

export const getMemberStats = async (): Promise<MemberStats | null> => {
  try {
    const response = await serverFetch("/members/stats");
    if (response?.success) {
      return response.data.stats;
    }
    return null;
  } catch (error) {
    if ((error as Error).message !== "Not authorized, no token provided") {
      console.error("Failed to fetch member stats:", error);
    }
    return null;
  }
};
