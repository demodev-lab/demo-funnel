import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: {
    value: string;
    isPositive: boolean;
  };
}

export default function SummaryCard({
  title,
  value,
  icon: Icon,
  change,
}: SummaryCardProps) {
  return (
    <Card className="bg-[#252A3C] border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg transition-all rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700/30 bg-[#1A1D29]/40">
        <CardTitle className="text-sm font-medium text-gray-300">
          {title}
        </CardTitle>
        <div className="p-2 bg-[#5046E4]/10 rounded-full">
          <Icon className="h-4 w-4 text-[#8C7DFF]" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && (
          <div className="flex items-center mt-1">
            <span
              className={`text-xs ${
                change.isPositive ? "text-green-400" : "text-red-400"
              } mr-1`}
            >
              {change.value}
            </span>
            <span className="text-xs text-gray-400">이전 기수 대비</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
