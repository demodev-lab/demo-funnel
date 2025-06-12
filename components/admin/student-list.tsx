"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload, ArrowUpDown } from "lucide-react";
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
import { getUserChallenges } from "@/apis/challenges";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import ExcelUploadDialog from "@/components/admin/students/excel-upload-dialog";
import StudentFormDialog from "@/components/admin/students/student-form-dialog";
import StudentTable from "@/components/admin/students/student-table";
import DeleteConfirmDialog from "@/components/admin/students/delete-confirm-dialog";
import { StudentListState } from "@/components/admin/students/student-list-state";
import { Student } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption = "default" | "name_asc" | "name_desc";

export default function StudentList() {
  const { selectedChallengeId } = useChallengeStore();
  const [sortOption, setSortOption] = useState<SortOption>("default");

  // React Query 훅들
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
    refetch,
  } = useStudentsByChallenge(
    selectedChallengeId,
    sortOption === "default"
      ? undefined
      : sortOption === "name_asc"
      ? "asc"
      : "desc",
  );
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

  // 로딩 또는 에러 상태일 때 StudentListState 컴포넌트 렌더링
  if (isLoading || error) {
    return (
      <StudentListState
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => {
            setSortOption(value);
            refetch();
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white">
            <SelectValue placeholder="정렬 방식 선택" />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1D29] border-gray-700/30">
            <SelectItem
              value="default"
              className="text-gray-300 hover:bg-[#2A2D39] hover:text-white focus:bg-[#2A2D39] focus:text-white"
            >
              기본 순서
            </SelectItem>
            <SelectItem
              value="name_asc"
              className="text-gray-300 hover:bg-[#2A2D39] hover:text-white focus:bg-[#2A2D39] focus:text-white"
            >
              이름순 (오름차순)
            </SelectItem>
            <SelectItem
              value="name_desc"
              className="text-gray-300 hover:bg-[#2A2D39] hover:text-white focus:bg-[#2A2D39] focus:text-white"
            >
              이름순 (내림차순)
            </SelectItem>
          </SelectContent>
        </Select>
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

      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        isDeleting={deleteStudentMutation.isPending}
      />
    </>
  );
}
