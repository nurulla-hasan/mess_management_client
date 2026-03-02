/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import { serverFetch } from "@/lib/fetcher";
import { PaginationMeta } from "@/types/global.types";
import { updateTag } from "next/cache";

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

    const response = await serverFetch(`/members?${queryParams}`, {
      tags: ["members"],
    });
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

export const getAllMembers = async (): Promise<Member[]> => {
  try {
    const response = await getMembers(1, 100);
    return response?.members || [];
  } catch (error) {
    console.error("Failed to fetch all members:", error);
    return [];
  }
};

export const getMemberStats = async (): Promise<MemberStats | null> => {
  try {
    const response = await serverFetch("/members/stats", {
      tags: ["member-stats"],
    });
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

export async function createMember(data: any) {
  try {
    const response = await serverFetch("/members", {
      method: "POST",
      body: data,
    });
    if (response?.success) {
      updateTag("members");
      updateTag("member-stats");
      updateTag("dashboard-stats");
    }
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateMemberStatus(id: string, status: "active" | "inactive") {
  try {
    const response = await serverFetch(`/members/${id}`, {
      method: "PUT",
      body: { status, isActive: status === 'active' },
    });
    if (response?.success) {
      updateTag("members");
      updateTag("member-stats");
      updateTag("dashboard-stats");
    }
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateMember(id: string, data: any) {
  try {
    const response = await serverFetch(`/members/${id}`, {
      method: "PUT",
      body: { ...data, isActive: data.status === 'active' },
    });
    if (response?.success) {
      updateTag("members");
      updateTag("member-stats");
      updateTag("dashboard-stats");
    }
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
