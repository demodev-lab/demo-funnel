import Header from "@/components/admin/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import CourseInfoTable from "@/components/admin/course-info-table";

export default function CourseInfoPage() {
  return (
    <div className="space-y-4">
      <Header />
      <h1 className="text-2xl font-bold">수강 정보 관리</h1>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-64">
          <Label htmlFor="search">수강생 검색</Label>
          <Input id="search" placeholder="이름 또는 이메일 검색" />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="show-unsubmitted" />
          <Label htmlFor="show-unsubmitted">미제출자만 보기</Label>
        </div>
      </div>

      <CourseInfoTable />
    </div>
  );
}
