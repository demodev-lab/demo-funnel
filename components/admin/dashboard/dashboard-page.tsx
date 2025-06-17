"use client";

import { Loader2 } from "lucide-react";
import SummaryCards from "./summary-cards";
import DetailedStats from "./detailed-stats";
import { useQuery } from "@tanstack/react-query";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { DashboardAssignmentStat } from "@/types/assignment";
import { usePeriodComparison } from "@/hooks/admin/usePeriodComparison";
import { getAssignmentStats } from "@/apis/assignments";

export default function DashboardPage() {
  const { selectedChallengeId } = useChallengeStore();

  const { data: currentAssignmentState = [], isLoading: isLoadingCurrent } =
    useQuery<DashboardAssignmentStat[]>({
      queryKey: ["challengeUsers", selectedChallengeId],
      queryFn: async () => {
        const data = await getAssignmentStats(selectedChallengeId);
        return data;
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
        const data = await getAssignmentStats(previousChallengeId);
        return data;
      },
      enabled: !!previousChallengeId,
    });

  const {
    currentValue: currentTotalStudent,
    formattedChange: totalStudentChange,
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
      <div className=" space-y-6 animate-fade-in">
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
