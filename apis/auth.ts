import { supabase } from "./supabase";
import { handleError } from "@/utils/errorHandler";
import { User } from "@/types/user";
import { setStoredEmail } from "@/utils/storage";

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export async function userLogin(email: string): Promise<LoginResponse> {
  try {
    const { data: user, error } = await supabase
      .from("Users")
      .select("id, name, email, phone")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return {
          success: false,
          error: "등록된 이메일의 수강생이 없습니다.",
        };
      }
      handleError(error, "로그인 실패");
    }

    if (!user) {
      handleError(
        new Error("등록된 이메일의 수강생이 없습니다."),
        "로그인 실패",
      );
    }

    // 로그인 성공 시 이메일 저장
    setStoredEmail(email);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  } catch (error) {
    handleError(error, "로그인 실패");
  }
}

// 로그아웃
export function logout() {
  setStoredEmail(null);
}
