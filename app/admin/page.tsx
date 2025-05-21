import Header from "@/components/admin/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentRateDashboard from "@/components/admin/enrollment-rate-dashboard";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <Header />
      <h1 className="text-2xl font-bold">코드언락 관리자 대시보드</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수강생</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120명</div>
            <p className="text-xs text-muted-foreground">전주 대비 +5명</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              평균 과제 제출률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">전주 대비 +2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              평균 강의 수강률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">전주 대비 -1%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="submission">
        <TabsList>
          <TabsTrigger value="submission">과제 제출률</TabsTrigger>
          <TabsTrigger value="lecture">강의 수강률</TabsTrigger>
        </TabsList>
        <TabsContent value="submission">
          <EnrollmentRateDashboard type="submission" />
        </TabsContent>
        <TabsContent value="lecture">
          <EnrollmentRateDashboard type="lecture" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
