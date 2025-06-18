"use client";

import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/dialog";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/hooks/useStudents";
import { useQueryClient } from "@tanstack/react-query";
import StudentFormDialog from "./StudentFormDialog";
import { DeleteDialogContent } from "./DeleteDialog";
import {
  validateStudentForm,
  type ValidationErrors,
} from "@/utils/validations/student";
import { StudentListState } from "./StudentListState";
import ExcelUploadDialog from "./ExcelUploadDialog";
import StudentTable from "./StudentTable";
import { type Student } from "@/types/user";

export default function StudentList() {
  // React Query 훅들
  const { data: students = [], isLoading, error, isError } = useStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();
  const queryClient = useQueryClient();

  // 상태 관리
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    phone: "",
  });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  // 엑셀 업로드 상태
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [parsedStudents, setParsedStudents] = useState<
    Array<Omit<Student, "id">>
  >([]);
  const [isExcelAdding, setIsExcelAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExcelDialogClose = (open: boolean) => {
    setIsExcelDialogOpen(open);
    if (!open) {
      setParsedStudents([]);
      setIsExcelUploading(false);
      setIsExcelAdding(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleExcelConfirm = async () => {
    if (!parsedStudents.length) return;

    setIsExcelAdding(true);
    try {
      const results = await Promise.allSettled(
        parsedStudents.map((student) =>
          createStudentMutation.mutateAsync(student),
        ),
      );
      const hasError = results.some((r) => r.status === "rejected");
      await queryClient.invalidateQueries({ queryKey: ["students"] });

      if (hasError) {
        toast.error(
          "일부 학생 추가에 실패했습니다. 네트워크 또는 중복 데이터를 확인하세요.",
        );
      } else {
        toast.success("엑셀에서 불러온 학생이 목록에 추가되었습니다.");
      }

      setParsedStudents([]);
      setIsExcelDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "엑셀 추가 중 오류가 발생했습니다.");
    } finally {
      setIsExcelAdding(false);
    }
  };

  const handleAddStudent = async () => {
    const errors = validateStudentForm(
      currentStudent,
      students,
      editingStudentId ? Number(editingStudentId) : undefined,
    );
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (isEditMode && editingStudentId) {
        await updateStudentMutation.mutateAsync({
          id: Number(editingStudentId),
          ...currentStudent,
        });
        toast.success("학생 정보가 성공적으로 수정되었습니다.");
      } else {
        await createStudentMutation.mutateAsync(currentStudent);
        toast.success("학생이 성공적으로 추가되었습니다.");
      }

      setCurrentStudent({ name: "", email: "", phone: "" });
      setValidationErrors({});
      setIsFormOpen(false);
      setIsEditMode(false);
      setEditingStudentId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
    }
  };

  const handleEditClick = (student: Student) => {
    setCurrentStudent({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });
    setEditingStudentId(student.id.toString());
    setIsEditMode(true);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId.toString());
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudentMutation.mutateAsync(Number(studentToDelete));
      toast.success("학생이 성공적으로 삭제되었습니다.");
      setStudentToDelete(null);
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
      );
    }
  };

  const handleDeleteCancel = () => {
    setStudentToDelete(null);
    setIsDeleteOpen(false);
  };

  const handleInputChange = (
    field: keyof Omit<Student, "id">,
    value: string,
  ) => {
    setCurrentStudent({ ...currentStudent, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
    }
  };

  if (isLoading || isError) {
    return (
      <StudentListState
        isLoading={isLoading}
        error={isError ? error : null}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="py-4 flex justify-end">
        <div className="space-x-2">
          {/* 엑셀 업로드 다이얼로그 */}
          <ExcelUploadDialog
            isOpen={isExcelDialogOpen}
            onOpenChange={handleExcelDialogClose}
            onSave={handleExcelConfirm}
            isProcessing={isExcelUploading || isExcelAdding}
            selectedChallengeId={1}
            challenges={[]}
          />

          {/* 학생 추가/수정 다이얼로그 */}
          <StudentFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            onSubmit={async (student, challenges) => {
              await handleAddStudent();
            }}
            existingStudent={
              isEditMode && editingStudentId
                ? students.find((s) => s.id.toString() === editingStudentId)
                : undefined
            }
            challenges={[]}
            initialChallenges={[]}
            isSubmitting={
              createStudentMutation.isPending || updateStudentMutation.isPending
            }
          />
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수강생 삭제</DialogTitle>
          </DialogHeader>
          <DeleteDialogContent
            onCancel={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            isDeleting={deleteStudentMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* 학생 목록 테이블 */}
      <StudentTable
        students={students}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
        error={error}
        hasNextPage={false}
        isFetchingNextPage={false}
        onFetchNextPage={() => {}}
      />
    </div>
  );
}
