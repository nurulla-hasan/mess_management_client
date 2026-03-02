/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export async function addDepositAction(data: any) {
  try {
    const response = await serverFetch("/deposits", {
      method: "POST",
      body: data,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard/deposits");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function updateDepositStatusAction(id: string, status: string) {
  try {
    const response = await serverFetch(`/deposits/${id}/status`, {
      method: "PUT",
      body: { status },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/reports");
    revalidatePath("/dashboard/deposits");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
