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
import { useState } from "react";
import { toast } from "sonner";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  type Student,
} from "@/hooks/useStudents";

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
      const duplicateError = checkDuplicateEmail(
        currentStudent.email,
        editingStudentId || undefined,
      );
      if (duplicateError) errors.email = duplicateError;
    }

    // 전화번호 검증
    const phoneError = validatePhone(currentStudent.phone);
    if (phoneError) errors.phone = phoneError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: 엑셀 파일 처리 로직 구현
      console.log("Uploaded file:", file);
    }
  };

  const handleAddStudent = async () => {
    // 폼 검증
    if (!validateForm()) {
      return;
    }

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

  const handleAddClick = () => {
    setCurrentStudent({ name: "", email: "", phone: "" });
    setIsEditMode(false);
    setEditingStudentId(null);
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

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="py-4 flex justify-end">
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Upload className="w-4 h-4 mr-2" />
              엑셀 파일 업로드
            </Button>
            <Button
              size="sm"
              className="bg-[#5046E4] hover:bg-[#4038c7]"
              disabled
            >
              <Plus className="w-4 h-4 mr-2" />
              수강생 추가
            </Button>
          </div>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">
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
            <Button variant="outline" size="sm" disabled>
              <Upload className="w-4 h-4 mr-2" />
              엑셀 파일 업로드
            </Button>
            <Button
              size="sm"
              className="bg-[#5046E4] hover:bg-[#4038c7]"
              disabled
            >
              <Plus className="w-4 h-4 mr-2" />
              수강생 추가
            </Button>
          </div>
        </div>
        <div className="border rounded-xl overflow-hidden">
          <div className="flex flex-col justify-center items-center py-20">
            <div className="text-red-500 mb-2">오류가 발생했습니다</div>
            <div className="text-gray-500 text-sm mb-4">
              {error instanceof Error
                ? error.message
                : "알 수 없는 오류가 발생했습니다."}
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                엑셀 파일 업로드
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>엑셀 파일 업로드</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-[#5046E4] hover:bg-[#4038c7]"
                onClick={handleAddClick}
              >
                <Plus className="w-4 h-4 mr-2" />
                수강생 추가
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "수강생 수정" : "수강생 추가"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={currentStudent.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={validationErrors.name ? "border-red-500" : ""}
                  />
                  {validationErrors.name && (
                    <p className="text-sm text-red-500">
                      {validationErrors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentStudent.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={validationErrors.email ? "border-red-500" : ""}
                    placeholder="example@email.com"
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    전화번호 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={currentStudent.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={validationErrors.phone ? "border-red-500" : ""}
                    placeholder="010-0000-0000"
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>
                <Button
                  className="w-full bg-[#5046E4] hover:bg-[#4038c7]"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수강생 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>정말로 이 수강생을 삭제하시겠습니까?</p>
            <p className="text-sm text-gray-500 mt-2">
              삭제된 데이터는 복구할 수 없습니다.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={cancelDelete}
              disabled={deleteStudentMutation.isPending}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteStudentMutation.isPending}
            >
              {deleteStudentMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              삭제
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                        onClick={() => handleEditClick(student)}
                        disabled={updateStudentMutation.isPending}
                      >
                        수정
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
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
