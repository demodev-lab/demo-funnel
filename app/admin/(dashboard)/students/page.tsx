import Header from "@/components/admin/header";
import StudentList from "@/components/admin/student-list";
import PageTitle from "@/components/ui/page-title";

export default function StudentsPage() {
  return (
    <>
      <PageTitle title="수강생 관리" />
      <StudentList />
    </>
  );
}
