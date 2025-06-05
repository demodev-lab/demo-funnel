import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentRateDashboard from "@/components/admin/enrollment-rate-dashboard";

export default function DetailedStats() {
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
            <TabsTrigger
              value="lecture"
              className="data-[state=active]:bg-[#5046E4] data-[state=active]:text-white"
            >
              강의 수강률
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="p-6">
          <TabsContent value="submission">
            <EnrollmentRateDashboard type="submission" />
          </TabsContent>
          <TabsContent value="lecture">
            <EnrollmentRateDashboard type="lecture" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
