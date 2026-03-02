/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export async function getAllMembersAction() {
  try {
    const response = await serverFetch("/members?limit=100");
    if (response?.success) {
      return response.data.members;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

export async function createMemberAction(data: any) {
  try {
    const response = await serverFetch("/members", {
      method: "POST",
      body: data,
    });
    revalidatePath("/dashboard/members");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateMemberStatusAction(id: string, status: "active" | "inactive") {
  try {
    const response = await serverFetch(`/members/${id}`, {
      method: "PUT",
      body: { status, isActive: status === 'active' },
    });
    revalidatePath("/dashboard/members");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateMemberAction(id: string, data: any) {
  try {
    const response = await serverFetch(`/members/${id}`, {
      method: "PUT",
      body: { ...data, isActive: data.status === 'active' },
    });
    revalidatePath("/dashboard/members");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
