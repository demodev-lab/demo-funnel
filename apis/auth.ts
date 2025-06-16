import { supabase } from "./supabase";
import { handleError } from "@/utils/errorHandler";
import { User } from "@/types/user";

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const USER_EMAIL_KEY = "user_email";

// sessionStorage에서 이메일 가져오기
const getStoredEmail = () => {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(USER_EMAIL_KEY);
};

// sessionStorage에 이메일 저장
const setStoredEmail = (email: string | null) => {
  if (typeof window === "undefined") return;
  if (email) {
    sessionStorage.setItem(USER_EMAIL_KEY, email);
  } else {
    sessionStorage.removeItem(USER_EMAIL_KEY);
  }
};

export async function userLogin(email: string): Promise<LoginResponse> {
  try {
    const { data: user, error } = await supabase
      .from("Users")
      .select("id, name, email")
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
      },
    };
  } catch (error) {
    handleError(error, "로그인 실패");
  }
}

// 현재 로그인한 사용자 정보를 가져오는 함수
export async function getCurrentUser(): Promise<User | null> {
  const email = getStoredEmail();
  if (!email) return null;

  try {
    const { data: user, error } = await supabase
      .from("Users")
      .select("id, name, email, phone")
      .eq("email", email)
      .single();

    if (error || !user) {
      setStoredEmail(null); // 에러 발생 시 저장된 이메일 삭제
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  } catch (error) {
    console.error("사용자 정보 조회 실패:", error);
    setStoredEmail(null); // 에러 발생 시 저장된 이메일 삭제
    return null;
  }
}

// 로그아웃
export function logout() {
  setStoredEmail(null);
}
