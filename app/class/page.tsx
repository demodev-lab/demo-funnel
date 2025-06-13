"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth/use-user";
import { useQuery } from "@tanstack/react-query";
import { getUserChallenges } from "@/apis/challenges";
import { useUserChallengeStore } from "@/lib/store/useUserChallengeStore";

export default function ClassRedirectPage() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const { setSelectedChallengeId, setChallengeList } = useUserChallengeStore();

  const { data: challengeList = [] } = useQuery({
    queryKey: ["challenge-list", user?.id],
    queryFn: async () => {
      const data = await getUserChallenges(user.id);
      console.log(data);
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
      setChallengeList(challengeList);
      // 가장 최근 챌린지로 리다이렉트
      router.push(`/class/${challengeList[0].id}`);
    }
  }, [user, isLoading, router, challengeList]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return null;
}
