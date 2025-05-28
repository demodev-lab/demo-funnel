"use server";

import { userLogin } from "@/apis/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const response = await userLogin(email);

  if (!response.success) {
    return { error: response.error || "등록되지 않은 이메일입니다." };
  }

  return { success: true };
} 