import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const useAuth = () => {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return {
    logout,
  };
};
