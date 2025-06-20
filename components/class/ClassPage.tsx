"use client";

import { useEffect } from "react";
import { useUser } from "@/hooks/auth/useUser";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getLecturesByChallenge } from "@/apis/lectures";
import { LectureWithSequence } from "@/types/lecture";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { getUserChallenges } from "@/apis/challenges";
import CohortSelector from "@/components/common/cohort-selector";
import { useRefundStatus } from "@/hooks/class/useRefundStatus";
import AssignmentSubmissionSection from "@/components/class/AssignmentSubmissionSection";
import DailyLectureSection from "@/components/class/DailyLectureSection";
import RefundRequestButton from "@/components/class/RefundRequestButton";
import { Loader2 } from "lucide-react";

interface ClassPageProps {
  currentChallengeId: number;
  initialLecture: LectureWithSequence;
}

export default function ClassPage({
  currentChallengeId,
  initialLecture,
}: ClassPageProps) {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = useUser();

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
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유지
  });

  const setSelectedLecture = useSelectedLectureStore((s) => s.setSelectedLecture);

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

  // 로딩 중이거나 사용자가 없으면 로딩 화면 표시
  if (isLoadingUser || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C7DFF]" />
      </div>
    );
  }
  
  useEffect(() => {
    setSelectedLecture(initialLecture); // CSR 진입 시 딱 한 번만 반영
  }, [initialLecture, setSelectedLecture]);
  
  const isLoading = isLecturesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#8C7DFF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1D29] to-[#252A3C] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="my-16 text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold relative inline-block animate-float">
              <span className="relative z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
                  demo-funnel
                </span>
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-[#5046E4]/20 to-[#8C7DFF]/20 rounded-full blur-sm"></span>
            </h1>
          </div>

          <div className="flex justify-end w-full px-6 py-4">
            <CohortSelector
              challengeList={challengeList}
              value={String(currentChallengeId)}
              onValueChange={(value) => {
                router.replace(`/class/${value}`);
              }}
            />
          </div>

          <div>
            <div className="bg-gradient-to-br from-[#252A3C] to-[#2A2F45] rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
              <div className="transition-all duration-300 hover:brightness-105">
                <DailyLectureSection lectures={lectures} />
              </div>

              <AssignmentSubmissionSection userInfo={user} />

              <RefundRequestButton
                isAllSubmitted={isAllSubmitted}
                isRefundRequested={isRefundRequested}
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-800/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 demo-funnel. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              이용약관
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              개인정보 보호
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-[#5046E4] transition-colors"
            >
              문의하기
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
