"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  type Student,
  useStudentsByChallenge,
} from "@/hooks/useStudents";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getChallenges } from "@/apis/challenges";
import { getUserChallenges } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import InfoTable from "@/components/admin/info-table";
import { ExcelUploadDialog } from "@/components/admin/students/excel-upload-dialog";
import { ExcelStudent } from "@/types/excel";

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function StudentList() {
  const { selectedChallengeId } = useChallengeStore();
  const observerTarget = useRef<HTMLDivElement>(null);

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [currentStudent, setCurrentStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    phone: "",
  });
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [isExcelPreviewOpen, setIsExcelPreviewOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 챌린지 목록 조회
  const { data: challenges = [] } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 페이지의 데이터를 하나의 배열로 병합
  const students = data?.pages.flatMap((page) => page.data) || [];

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
    excludeId?: number,
  ): string | undefined => {
    const isDuplicate = students.some(
      (student) => student.email === email && student.id !== excludeId,
    );
    if (isDuplicate) {
      return "중복된 이메일입니다.";
    }
    return undefined;
  };

  const checkDuplicatePhone = (
    phone: string,
    excludeId?: number,
  ): string | undefined => {
    const isDuplicate = students.some(
      (student) => student.phone === phone && student.id !== excludeId,
    );
    if (isDuplicate) {
      return "중복된 전화번호입니다.";
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

  // 엑셀 데이터 저장 함수
  const handleSaveExcelData = async (validStudents: ExcelStudent[]) => {
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
        if (student.isValid) {
          const { isValid, errors, ...studentData } = student;
          await createStudentMutation.mutateAsync({
            ...studentData,
            challenges: [selectedChallengeId],
          });
        }
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

  // 학생 데이터 검증 함수
  const validateStudent = (student: Omit<Student, "id">): string[] => {
    const errors: string[] = [];

    // 이름 검증
    const nameError = validateName(student.name);
    if (nameError) errors.push(nameError);

    // 이메일 검증
    const emailError = validateEmail(student.email);
    if (emailError) {
      errors.push(emailError);
    } else {
      const duplicateEmailError = checkDuplicateEmail(student.email);
      if (duplicateEmailError) errors.push(duplicateEmailError);
    }

    // 전화번호 검증
    const phoneError = validatePhone(student.phone);
    if (phoneError) {
      errors.push(phoneError);
    } else {
      const duplicatePhoneError = checkDuplicatePhone(student.phone);
      if (duplicatePhoneError) errors.push(duplicatePhoneError);
    }

    return errors;
  };

  const handleAddStudent = async () => {
    if (!validateForm()) return;

    try {
      if (isEditMode && editingStudentId) {
        // 수정 모드
        await updateStudentMutation.mutateAsync({
          id: editingStudentId,
          ...currentStudent,
          challenges: selectedChallenges,
        });
        toast.success("학생 정보가 성공적으로 수정되었습니다.");
      } else {
        // 추가 모드
        await createStudentMutation.mutateAsync({
          ...currentStudent,
          challenges: selectedChallenges,
        });
        toast.success("학생이 성공적으로 추가되었습니다.");
      }

      // 폼 초기화
      setCurrentStudent({ name: "", email: "", phone: "" });
      setValidationErrors({});
      setSelectedChallenges([]);
      setIsFormOpen(false);
      setIsEditMode(false);
      setEditingStudentId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "오류가 발생했습니다.",
      );
    }
  };

  const handleEditClick = async (student: Student) => {
    setCurrentStudent({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });

    // 챌린지 정보 가져오기
    const userChallenges = await getUserChallenges(student.id);
    console.log("User challenges:", userChallenges);
    const challengeIds = userChallenges.map((challenge) => challenge.id);
    console.log("Challenge IDs:", challengeIds);
    setSelectedChallenges(challengeIds);

    setEditingStudentId(student.id);
    setIsEditMode(true);
    setValidationErrors({});
    setIsFormOpen(true);
  };

  const handleDeleteClick = (studentId: number) => {
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
    setSelectedChallenges([]);
    setIsEditMode(false);
    setEditingStudentId(null);
  };

  const columns = [
    { header: "No.", accessor: "index" },
    { header: "이름", accessor: "name" },
    { header: "이메일", accessor: "email" },
    { header: "전화번호", accessor: "phone" },
  ];

  const renderActions = (student: Student) => (
    <>
      <Button
        onClick={() => handleEditClick(student as Student)}
        variant="ghost"
        className="h-8 w-8 p-0 mr-1 text-gray-400 hover:text-[#8C7DFF] hover:bg-[#1A1D29]/60"
        disabled={updateStudentMutation.isPending}
      >
        <span className="sr-only">Edit</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
        </svg>
      </Button>
      <Button
        onClick={() => handleDeleteClick(student.id!)}
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-[#1A1D29]/60"
        disabled={deleteStudentMutation.isPending}
      >
        <span className="sr-only">Delete</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </Button>
    </>
  );

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
        <div
          data-testid="loader"
          className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg"
        >
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
            validateStudent={validateStudent}
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

          <Dialog
            open={isFormOpen}
            onOpenChange={(open) => {
              setIsFormOpen(open);
              if (!open) {
                resetFormState();
              }
            }}
            data-testid="student-form-dialog"
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                수강생 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#252A3C] border-gray-700/30 text-white">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "수강생 수정" : "수강생 추가"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "수강생 정보를 수정합니다."
                    : "새로운 수강생을 추가합니다."}
                </DialogDescription>
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
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${
                      validationErrors.name ? "border-red-500" : ""
                    }`}
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
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${
                      validationErrors.email ? "border-red-500" : ""
                    }`}
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
                    className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${
                      validationErrors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="010-0000-0000"
                  />
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">챌린지</Label>
                  <Select
                    onValueChange={(value) => {
                      const numValue = parseInt(value, 10);
                      if (
                        !isNaN(numValue) &&
                        !selectedChallenges.includes(numValue)
                      ) {
                        setSelectedChallenges([
                          ...selectedChallenges,
                          numValue,
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20">
                      <SelectValue placeholder="기수를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {challenges.map((challenge) => (
                        <SelectItem
                          key={challenge.id}
                          value={challenge.id.toString()}
                        >
                          {challenge.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedChallenges.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedChallenges.map((challengeId) => {
                          const challenge = challenges.find((c) => {
                            return c.id === challengeId;
                          });
                          return (
                            <div
                              key={challengeId}
                              className="flex items-center gap-2"
                            >
                              <span className="text-sm text-gray-500">
                                {challenge?.name}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={() => {
                                  setSelectedChallenges(
                                    selectedChallenges.filter(
                                      (id) => id !== challengeId,
                                    ),
                                  );
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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

      <InfoTable
        columns={columns}
        data={students.map((student, index) => ({
          ...student,
          index: index + 1,
        }))}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
        emptyMessage="등록된 수강생이 없습니다."
        actions={renderActions}
      />

      {/* 무한 스크롤 옵저버 타겟 */}
      <div
        ref={observerTarget}
        className="w-full h-4 flex items-center justify-center p-4"
      >
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Dialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        data-testid="delete-confirm-dialog"
      >
        <DialogContent className="bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">수강생 삭제</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              정말로 이 수강생을 삭제하시겠습니까?
            </p>
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
    </>
  );
}
