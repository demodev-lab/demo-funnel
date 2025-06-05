import { BarChart3 } from "lucide-react";
import SummaryCards from "@/components/admin/dashboard/summary-cards";
import DetailedStats from "@/components/admin/dashboard/detailed-stats";

export default function Dashboard() {
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
            최근 업데이트: 2024년 6월 15일
          </div>
        </div>

        <SummaryCards />
        <DetailedStats />
      </div>
    </div>
  );
}
