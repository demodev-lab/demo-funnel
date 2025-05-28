import { supabase } from "./supabase";

interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  error?: string;
}

export async function userLogin(email: string): Promise<LoginResponse> {
  try {
    // Users 테이블에서 이메일로 사용자 검색
    const { data: user, error } = await supabase
      .from("Users")
      .select("id, name, email")
      .eq("email", email)
      .single();

    if (error) {
      throw error;
    }

    if (!user) {
      return {
        success: false,
        error: "해당 이메일로 등록된 사용자가 없습니다.",
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("로그인 실패:", error);
    return {
      success: false,
      error: "로그인 처리 중 오류가 발생했습니다.",
    };
  }
}
