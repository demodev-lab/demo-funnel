import { Users, CheckCircle2, PlayCircle } from "lucide-react";
import SummaryCard from "./summary-card";

interface SummaryCardsProps {
  totalStudent: number | undefined;
}

export default function SummaryCards({ totalStudent }: SummaryCardsProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
      <SummaryCard
        title="총 수강생"
        value={totalStudent !== undefined ? `${totalStudent}` : "-"}
        icon={Users}
        change={{ value: "+5명", isPositive: true }}
      />
      <SummaryCard
        title="평균 과제 제출률"
        value="78%"
        icon={CheckCircle2}
        change={{ value: "+2%", isPositive: true }}
      />
      <SummaryCard
        title="평균 강의 수강률"
        value="85%"
        icon={PlayCircle}
        change={{ value: "-1%", isPositive: false }}
      />
    </div>
  );
}
