import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { type Student } from "@/hooks/useStudents";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function StudentTable({
  students,
  onEdit,
  onDelete,
  isUpdating,
  isDeleting,
}: StudentTableProps) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-2 text-left">이름</th>
            <th className="px-4 py-2 text-left">이메일</th>
            <th className="px-4 py-2 text-left">전화번호</th>
            <th className="px-4 py-2 text-center">관리</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                등록된 수강생이 없습니다.
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="px-4 py-2">{student.name}</td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.phone}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                      onClick={() => onEdit(student)}
                      disabled={isUpdating}
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(student.id)}
                      disabled={isDeleting}
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
