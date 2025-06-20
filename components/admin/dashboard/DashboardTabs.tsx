import { Tabs, TabsList, TabsTrigger } from "@/components/common/tabs";
import DashboardTabsContent from "./DashboardTabsContent";

export default function DashboardTabs() {
  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg animate-slide-up">
      <Tabs defaultValue="submission" className="w-full">
        <div className="border-b border-gray-700/30 bg-[#1A1D29]/40 p-4">
          <TabsList className="bg-[#1A1D29]/60 border border-gray-700/30">
            <TabsTrigger
              value="submission"
              className="data-[state=active]:bg-[#5046E4] data-[state=active]:text-white"
            >
              과제 제출률
            </TabsTrigger>
            {/* <TabsTrigger
              value="lecture"
              className="data-[state=active]:bg-[#5046E4] data-[state=active]:text-white"
            >
              강의 수강률
            </TabsTrigger> */}
          </TabsList>
        </div>
        <DashboardTabsContent />
      </Tabs>
    </div>
  );
}
