"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  type Student,
} from "@/hooks/useStudents";
import { useQueryClient } from "@tanstack/react-query";

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

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
  // 엑셀 업로드 모달 상태 - 더미 상태로 변경
  const [isExcelDialogOpen, setIsExcelDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 입력 검증 함수들
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return "이메일을 입력해주세요.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식을 입력해주세요.";
    }
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) {
      return "전화번호를 입력해주세요.";
    }
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return "전화번호는 010-0000-0000 형식으로 입력해주세요.";
    }
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "이름을 입력해주세요.";
    }
    if (name.trim().length < 2) {
      return "이름은 2글자 이상 입력해주세요.";
    }
    return undefined;
  };

  const checkDuplicateEmail = (
    email: string,
    excludeId?: string,
  ): string | undefined => {
    const isDuplicate = students.some(
      (student) => student.email === email && student.id !== excludeId,
    );
    if (isDuplicate) {
      return "이미 등록된 이메일입니다.";
    }
    return undefined;
  };

  const checkDuplicatePhone = (
    phone: string,
    excludeId?: string,
  ): string | undefined => {
    const isDuplicate = students.some(
      (student) => student.phone === phone && student.id !== excludeId,
    );
    if (isDuplicate) {
      return "이미 등록된 전화번호입니다.";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // 이름 검증
    const nameError = validateName(currentStudent.name);
    if (nameError) errors.name = nameError;

    // 이메일 검증
    const emailError = validateEmail(currentStudent.email);
    if (emailError) {
      errors.email = emailError;
    } else {
      // 중복 이메일 검증 (수정 모드일 때는 현재 편집 중인 학생 제외)
      const duplicateEmailError = checkDuplicateEmail(
        currentStudent.email,
        editingStudentId || undefined,
      );
      if (duplicateEmailError) errors.email = duplicateEmailError;
    }

    // 전화번호 검증
    const phoneError = validatePhone(currentStudent.phone);
    if (phoneError) {
      errors.phone = phoneError;
    } else {
      // 중복 전화번호 검증 (수정 모드일 때는 현재 편집 중인 학생 제외)
      const duplicatePhoneError = checkDuplicatePhone(
        currentStudent.phone,
        editingStudentId || undefined,
      );
      if (duplicatePhoneError) errors.phone = duplicatePhoneError;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 엑셀 기능 제거 후 간단한 알림 함수로 대체
  const handleExcelUpload = () => {
    toast.info("현재 엑셀 업로드 기능은 일시적으로 사용할 수 없습니다.");
    setIsExcelDialogOpen(false);
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode && editingStudentId) {
        // 수정 모드
        await updateStudentMutation.mutateAsync({
          id: editingStudentId,
          ...currentStudent,
        });
        toast.success("학생 정보가 성공적으로 수정되었습니다.");
      } else {
        // 추가 모드
        await createStudentMutation.mutateAsync(currentStudent);
        toast.success("학생이 성공적으로 추가되었습니다.");
      }

      // 폼 초기화
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
    setEditingStudentId(student.id);
    setIsEditMode(true);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteClick = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsDeleteOpen(true);
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

  const cancelDelete = () => {
    setStudentToDelete(null);
    setIsDeleteOpen(false);
  };

  // 입력값 변경 시 해당 필드의 에러 메시지 제거
  const handleInputChange = (
    field: keyof Omit<Student, "id">,
    value: string,
  ) => {
    setCurrentStudent({ ...currentStudent, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: undefined });
    }
  };

  const resetFormState = () => {
    setCurrentStudent({ name: "", email: "", phone: "" });
    setValidationErrors({});
    setIsEditMode(false);
    setEditingStudentId(null);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="py-4 flex justify-end">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-400"
            >
              <Upload className="w-4 h-4 mr-2" />
              엑셀 파일 업로드
            </Button>
            <Button
              size="sm"
              className="bg-[#5046E4]/50 text-gray-400"
              disabled
            >
              <Plus className="w-4 h-4 mr-2" />
              수강생 추가
            </Button>
          </div>
        </div>
        <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#8C7DFF]" />
            <span className="ml-2 text-gray-400">
              학생 목록을 불러오는 중...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="space-y-4">
        <div className="py-4 flex justify-end">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-400"
            >
              <Upload className="w-4 h-4 mr-2" />
              엑셀 파일 업로드
            </Button>
            <Button
              size="sm"
              className="bg-[#5046E4]/50 text-gray-400"
              disabled
            >
              <Plus className="w-4 h-4 mr-2" />
              수강생 추가
            </Button>
          </div>
        </div>
        <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-red-400 mb-2">오류가 발생했습니다</div>
            <div className="text-gray-400 text-sm mb-4">
              {error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다."}
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
            >
              페이지 새로고침
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="py-4 flex justify-end">
        <div className="space-x-2">
          {/* 엑셀 업로드 다이얼로그 - 간소화 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExcelUpload}
            className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            엑셀 파일 업로드
          </Button>

          <Dialog
            open={isFormOpen}
            onOpenChange={(open) => {
              setIsFormOpen(open);
              if (!open) {
                resetFormState();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                수강생 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {isEditMode ? "수강생 수정" : "수강생 추가"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">
                    이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={currentStudent.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${validationErrors.name ? "border-red-500" : ""}`}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentStudent.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${validationErrors.email ? "border-red-500" : ""}`}
                    placeholder="example@email.com"
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">
                    전화번호 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={currentStudent.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${validationErrors.phone ? "border-red-500" : ""}`}
                    placeholder="010-0000-0000"
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={handleAddStudent}
                  disabled={
                    createStudentMutation.isPending ||
                    updateStudentMutation.isPending
                  }
                >
                  {(createStudentMutation.isPending ||
                    updateStudentMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {isEditMode ? "수정하기" : "추가하기"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">수강생 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">정말로 이 수강생을 삭제하시겠습니까?</p>
            <p className="text-sm text-gray-400 mt-2">
              삭제된 데이터는 복구할 수 없습니다.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deleteStudentMutation.isPending}
              className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteStudentMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteStudentMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/30 bg-[#1A1D29]/60">
              <th className="px-4 py-2 text-left text-gray-300">이름</th>
              <th className="px-4 py-2 text-left text-gray-300">이메일</th>
              <th className="px-4 py-2 text-left text-gray-300">전화번호</th>
              <th className="px-4 py-2 text-center text-gray-300">관리</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  등록된 수강생이 없습니다.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b border-gray-700/30 hover:bg-[#1C1F2B]/50">
                  <td className="px-4 py-2 text-gray-300">{student.name}</td>
                  <td className="px-4 py-2 text-gray-400">{student.email}</td>
                  <td className="px-4 py-2 text-gray-400">{student.phone}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
                        onClick={() => handleEditClick(student)}
                        disabled={updateStudentMutation.isPending}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                        onClick={() => handleDeleteClick(student.id)}
                        disabled={deleteStudentMutation.isPending}
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
    </div>
  );
}
