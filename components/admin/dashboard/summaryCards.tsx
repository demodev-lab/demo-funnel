import { Users, CheckCircle2, PlayCircle } from "lucide-react";
import SummaryCard from "./SummaryCard";

interface SummaryCardsProps {
  totalStudent: number | undefined;
  totalStudentChange?: { value: string; isPositive: boolean };
  isFirstPeriod: boolean;
  averageSubmissionRate: string | undefined;
  submissionRateChange?: { value: string; isPositive: boolean };
}

export default function SummaryCards({
  totalStudent,
  totalStudentChange,
  isFirstPeriod,
  averageSubmissionRate,
  submissionRateChange,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-5 grid-cols-2 animate-slide-up">
      <SummaryCard
        title="총 수강생"
        value={totalStudent !== undefined ? `${totalStudent}명` : "-"}
        icon={Users}
        change={
          !isFirstPeriod && totalStudentChange ? totalStudentChange : undefined
        }
      />
      <SummaryCard
        title="평균 과제 제출률"
        value={
          averageSubmissionRate !== undefined
            ? `${averageSubmissionRate}%`
            : "-"
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
