import Header from "@/components/admin/header";
import StudentList from "@/components/admin/student-list";

export default function StudentsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
          수강생 관리
        </span>
      </h1>
      <StudentList />
    </>
  );
}
