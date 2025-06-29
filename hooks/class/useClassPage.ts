import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/auth/useUser";
import { getLecturesByChallenge } from "@/apis/lectures";
import { getUserChallenges } from "@/apis/challenges";
import { LectureWithSequence } from "@/types/lecture";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { useRefundStatus } from "@/hooks/class/useRefundStatus";

interface UseClassPageProps {
  currentChallengeId: number;
  initialLecture: LectureWithSequence;
}

export function useClassPage({
  currentChallengeId,
  initialLecture,
}: UseClassPageProps) {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const setSelectedLecture = useSelectedLectureStore(
    (s) => s.setSelectedLecture,
  );

  // 로그인에서 저장한 쿼리 캐시의 챌린지 목록 사용
  const { data: challengeList = [] } = useQuery({
    queryKey: ["challenge-list", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const data = await getUserChallenges(user.id);
      return data;
    },
    enabled: !isLoadingUser && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  // 챌린지의 강의 조회
  const { data: lectures = [], isLoading: isLecturesLoading } = useQuery<
    LectureWithSequence[]
  >({
    queryKey: ["challenge-lectures", currentChallengeId],
    queryFn: async () => {
      const data = await getLecturesByChallenge(currentChallengeId);
      return data;
    },
    enabled: !isLoadingUser && !!user?.id,
    // staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  const challengeLectures = lectures.map((lecture) => ({
    id: lecture.challenge_lecture_id,
    lecture_id: lecture.id,
  }));

  const { isAllSubmitted, isRefundRequested } = useRefundStatus(
    user?.id,
    challengeLectures,
  );

  // 사용자가 없을 때 리디렉션
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  // 초기 강의 설정
  useEffect(() => {
    if (initialLecture) {
      setSelectedLecture(initialLecture);
    } else {
      setSelectedLecture(null);
    }
  }, [initialLecture, setSelectedLecture]);

  // 챌린지 변경 핸들러
  const handleChallengeChange = (value: string) => {
    router.replace(`/class/${value}`);
  };

  const isLoading = isLoadingUser || !user || isLecturesLoading;

  return {
    user,
    challengeList,
    lectures,
    isAllSubmitted,
    isRefundRequested,
    isLoading,
    handleChallengeChange,
  };
}
