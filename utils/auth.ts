import { supabase } from "@/apis/supabase";

export const validateAuth = async (): Promise<void> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("사용자 인증이 필요합니다.");
  }
};
