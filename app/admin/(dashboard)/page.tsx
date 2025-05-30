import Header from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentRateDashboard from "@/components/admin/enrollment-rate-dashboard";
import { BarChart3, Users, CheckCircle2, PlayCircle } from "lucide-react";

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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          <Card className="bg-[#252A3C] border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg transition-all rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700/30 bg-[#1A1D29]/40">
              <CardTitle className="text-sm font-medium text-gray-300">
                총 수강생
              </CardTitle>
              <div className="p-2 bg-[#5046E4]/10 rounded-full">
                <Users className="h-4 w-4 text-[#8C7DFF]" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">120명</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-400 mr-1">+5명</span>
                <span className="text-xs text-gray-400">전주 대비</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#252A3C] border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg transition-all rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700/30 bg-[#1A1D29]/40">
              <CardTitle className="text-sm font-medium text-gray-300">
                평균 과제 제출률
              </CardTitle>
              <div className="p-2 bg-[#5046E4]/10 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-[#8C7DFF]" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">78%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-400 mr-1">+2%</span>
                <span className="text-xs text-gray-400">전주 대비</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#252A3C] border-gray-700/30 hover:border-gray-600/50 hover:shadow-lg transition-all rounded-xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-700/30 bg-[#1A1D29]/40">
              <CardTitle className="text-sm font-medium text-gray-300">
                평균 강의 수강률
              </CardTitle>
              <div className="p-2 bg-[#5046E4]/10 rounded-full">
                <PlayCircle className="h-4 w-4 text-[#8C7DFF]" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-red-400 mr-1">-1%</span>
                <span className="text-xs text-gray-400">전주 대비</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  );
}
