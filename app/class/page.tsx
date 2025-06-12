"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth/use-user";
import { useQuery } from "@tanstack/react-query";
import { getUserChallenges } from "@/apis/challenges";
import { useChallengeStore } from '@/lib/store/useChallengeStore';

export default function ClassRedirectPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { setSelectedChallengeId } = useChallengeStore();


  const { data: challengeList = [] } = useQuery({
    queryKey: ["challenge-list", user?.id],
    queryFn: async () => {
      const data = await getUserChallenges(user.id);
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (challengeList && challengeList.length > 0) {
      setSelectedChallengeId(challengeList[0].id);
      // 가장 최근 챌린지로 리다이렉트
      router.push(`/class/${challengeList[0].id}`);
    }
  }, [user, isLoading, router, challengeList]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return null;
}
