"use client";

import { BarChart3, Loader2 } from "lucide-react";
import SummaryCards from "./summary-cards";
import DetailedStats from "./detailed-stats";
import { useQuery } from "@tanstack/react-query";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { DashboardAssignmentStat } from "@/types/assignment";
import { usePeriodComparison } from "@/hooks/admin/usePeriodComparison";

export default function DashboardPage() {
  const { selectedChallengeId } = useChallengeStore();

  const { data: currentAssignmentState = [], isLoading: isLoadingCurrent } =
    useQuery<DashboardAssignmentStat[]>({
      queryKey: ["challengeUsers", selectedChallengeId],
      queryFn: async () => {
        // const data = await getAssignmentStats(selectedChallengeId);
        // console.log("현재 기수 제출 인원 (API response): ", data);
        // return data;
        const response = await fetch(
          `/api/admin/assignments/stats/${selectedChallengeId}`,
        );
        if (!response.ok) {
          throw new Error("과제 통계 조회에 실패했습니다.");
        }
        return response.json();
      },
      enabled: !!selectedChallengeId,
    });

  const previousChallengeId =
    selectedChallengeId && selectedChallengeId > 1
      ? selectedChallengeId - 1
      : undefined;
  const isFirstPeriod = selectedChallengeId === 1;

  const { data: previousAssignmentState = [], isLoading: isLoadingPrevious } =
    useQuery<DashboardAssignmentStat[]>({
      queryKey: ["challengeUsers", previousChallengeId],
      queryFn: async () => {
        // const data = await getAssignmentStats(previousChallengeId);
        // console.log("이전 기수 제출 인원 (API response): ", data);
        // return data;
        const response = await fetch(
          `/api/admin/assignments/stats/${previousChallengeId}`,
        );
        if (!response.ok) {
          throw new Error("과제 통계 조회에 실패했습니다.");
        }
        return response.json();
      },
      enabled: !!previousChallengeId,
    });

  const {
    currentValue: currentTotalStudent,
    formattedChange: totalStudentChange,
    lastUpdated,
  } = usePeriodComparison(
    currentAssignmentState,
    previousAssignmentState,
    isFirstPeriod,
    "totalStudents",
  );

  const {
    currentValue: averageSubmissionRate,
    formattedChange: submissionRateChange,
  } = usePeriodComparison(
    currentAssignmentState,
    previousAssignmentState,
    isFirstPeriod,
    "submissionRate",
  );

  const isLoading =
    isLoadingCurrent || (!!previousChallengeId && isLoadingPrevious);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-6 md:p-8 space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
              코드언락 관리자 대시보드
            </span>
          </h1>
          <div className="text-sm text-gray-400 bg-[#252A3C] px-3 py-1.5 rounded-lg border border-gray-700/30 inline-flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-[#8C7DFF]" />
            최근 업데이트: {lastUpdated}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#8C7DFF]" />
          </div>
        ) : (
          <SummaryCards
            totalStudent={currentTotalStudent}
            averageSubmissionRate={averageSubmissionRate?.toString()}
            totalStudentChange={totalStudentChange}
            isFirstPeriod={isFirstPeriod}
            submissionRateChange={submissionRateChange}
          />
        )}
        <DetailedStats assignmentStats={currentAssignmentState} />
      </div>
    </div>
  );
}
