"use client";

import { useClassPage } from "@/hooks/class/useClassPage";
import { LectureWithSequence } from "@/types/lecture";
import CohortSelector from "@/components/common/cohort-selector";
import AssignmentSubmissionSection from "@/components/class/AssignmentSubmissionSection";
import DailyLectureSection from "@/components/class/DailyLectureSection";
import RefundRequestButton from "@/components/class/RefundRequestButton";
import { Loader2 } from "lucide-react";
import ClassFooter from "./ClassFooter";

interface ClassPageProps {
  currentChallengeId: number;
  initialLecture: LectureWithSequence | undefined;
}

export default function ClassPage({
  currentChallengeId,
  initialLecture,
}: ClassPageProps) {
  const {
    user,
    challengeList,
    lectures,
    isAllSubmitted,
    isRefundRequested,
    isLoading,
    handleChallengeChange,
  } = useClassPage({ currentChallengeId, initialLecture });

  // 로딩 중이거나 사용자가 없으면 로딩 화면 표시
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
              onValueChange={handleChallengeChange}
            />
          </div>

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

      <ClassFooter />
    </div>
  );
}
