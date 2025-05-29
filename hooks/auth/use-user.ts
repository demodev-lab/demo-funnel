import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type User } from "@/apis/auth";

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity, // 사용자 정보는 로그아웃하기 전까지 캐시 유지
    retry: false, // 실패 시 재시도하지 않음
    refetchOnMount: true, // 컴포넌트 마운트 시 항상 새로운 데이터 가져오기
    refetchOnWindowFocus: true, // 윈도우 포커스 시 새로운 데이터 가져오기
  });
}
