"use client";

import { Users, CheckCircle2 } from "lucide-react";
import SummaryCard from "@/components/admin/dashboard/SummaryCard";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { usePeriodComparison } from "@/hooks/admin/usePeriodComparison";
import { useAssignmentState } from "@/hooks/admin/useAssignmentState";

export default function SummaryCardList() {
  const selectedChallengeId = useChallengeStore(
    (state) => state.selectedChallengeId,
  );

  const previousChallengeId =
    selectedChallengeId && selectedChallengeId > 1
      ? selectedChallengeId - 1
      : undefined;
  const isFirstPeriod = selectedChallengeId === 1;

  const { data: currentAssignmentState = [] } =
    useAssignmentState(selectedChallengeId);
  const { data: previousAssignmentState = [] } =
    useAssignmentState(previousChallengeId);

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
  return (
    <div className="grid gap-5 grid-cols-2 animate-slide-up">
      <SummaryCard
        title="총 수강생"
        value={
          currentTotalStudent !== undefined && !isNaN(currentTotalStudent)
            ? `${currentTotalStudent}명`
            : ""
        }
        icon={Users}
        change={
          !isFirstPeriod && totalStudentChange ? totalStudentChange : undefined
        }
      />
      <SummaryCard
        title="평균 과제 제출률"
        value={
          averageSubmissionRate !== undefined && !isNaN(averageSubmissionRate)
            ? `${averageSubmissionRate}%`
            : ""
        }
        icon={CheckCircle2}
        change={
          !isFirstPeriod && submissionRateChange
            ? submissionRateChange
            : undefined
        }
      />
      {/* <SummaryCard
        title="평균 강의 수강률"
        value="85%"
        icon={PlayCircle}
        change={{ value: "-1%", isPositive: false }}
      /> */}
    </div>
  );
}
