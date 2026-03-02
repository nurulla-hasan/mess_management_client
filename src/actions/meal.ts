/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { revalidatePath } from "next/cache";

export async function addMealAction(data: any) {
  try {
    const response = await serverFetch("/meals", {
      method: "POST",
      body: data,
    });
    revalidatePath("/dashboard/meals");
    return response;
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

export async function getMealByDateAction(date: string) {
  try {
    const response = await serverFetch(`/meals/${date}`);
    if (response?.success) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
}
