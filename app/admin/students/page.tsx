import Header from "@/components/admin/header";
import StudentList from "@/components/admin/student-list";

export default function StudentsPage() {
  return (
    <div className="space-y-4">
      <Header />
      <h1 className="text-2xl font-bold">수강생 관리</h1>
      <StudentList />
    </div>
  );
}
