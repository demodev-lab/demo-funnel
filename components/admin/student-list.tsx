"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useStudentsByChallenge,
} from "@/hooks/useStudents";
import { useQuery } from "@tanstack/react-query";
import { getChallenges } from "@/apis/challenges";
import { getUserChallenges } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import ExcelUploadDialog from "@/components/admin/students/excel-upload-dialog";
import StudentFormDialog from "@/components/admin/students/student-form-dialog";
import StudentTable from "@/components/admin/students/student-table";
import DeleteConfirmDialog from "@/components/admin/students/delete-confirm-dialog";
import { Student } from "@/types/user";

export default function StudentList() {
  const { selectedChallengeId } = useChallengeStore();

  // React Query 훅들
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useStudentsByChallenge(selectedChallengeId);
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  // 상태 관리
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 챌린지 목록 조회
  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // 모든 페이지의 데이터를 하나의 배열로 병합
  const students = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];

  // 엑셀 데이터 저장 핸들러
  const handleSaveExcelData = async (validStudents: Student[]) => {
    if (validStudents.length === 0) {
      toast.error("추가할 수 있는 유효한 데이터가 없습니다.");
      return;
    }

    if (!selectedChallengeId) {
      toast.error("챌린지를 선택해주세요.");
      return;
    }

    try {
      setIsProcessing(true);

      for (const student of validStudents) {
        await createStudentMutation.mutateAsync({
          ...student,
          challenges: [selectedChallengeId],
        });
      }

      toast.success(
        `${validStudents.length}명의 수강생이 성공적으로 추가되었습니다.`,
      );
      setIsExcelPreviewOpen(false);
    } catch (error) {
      toast.error("데이터 저장 중 오류가 발생했습니다.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditClick = async (student: Student) => {
    const userChallenges = await getUserChallenges(student.id!);
    const challengeIds = userChallenges.map((challenge) => challenge.id);
    setSelectedChallenges(challengeIds);
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (studentId: number) => {
    setStudentToDelete(studentId);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (
    student: Omit<Student, "id">,
    challenges: number[],
  ) => {
    try {
      if (editingStudent) {
        await updateStudentMutation.mutateAsync({
          id: editingStudent.id!,
          ...student,
          challenges,
        });
        toast.success("학생 정보가 성공적으로 수정되었습니다.");
      } else {
        await createStudentMutation.mutateAsync({
          ...student,
          challenges,
        });
        toast.success("학생이 성공적으로 추가되었습니다.");
      }

      setIsFormOpen(false);
      setEditingStudent(undefined);
      setSelectedChallenges([]);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
    }
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      await deleteStudentMutation.mutateAsync(studentToDelete);
      toast.success("학생이 성공적으로 삭제되었습니다.");
      setStudentToDelete(null);
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "삭제 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <div className="space-x-2">
          <ExcelUploadDialog
            isOpen={isExcelPreviewOpen}
            onOpenChange={setIsExcelPreviewOpen}
            onSave={handleSaveExcelData}
            isProcessing={isProcessing}
            selectedChallengeId={selectedChallengeId}
            challenges={challenges}
          />
          <Button
            variant="outline"
            size="sm"
            className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
            onClick={() => setIsExcelPreviewOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            엑셀 파일 업로드
          </Button>

          <Button
            size="sm"
            className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            수강생 추가
          </Button>
        </div>
      </div>

      <StudentFormDialog
        isOpen={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingStudent(undefined);
            setSelectedChallenges([]);
          }
        }}
        onSubmit={handleFormSubmit}
        existingStudent={editingStudent}
        challenges={challenges}
        initialChallenges={selectedChallenges}
        isSubmitting={
          createStudentMutation.isPending || updateStudentMutation.isPending
        }
      />

      <StudentTable
        students={students}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onFetchNextPage={fetchNextPage}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        isDeleting={deleteStudentMutation.isPending}
      />
    </>
  );
}
