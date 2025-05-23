"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
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

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const initialStudents: Student[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    phone: "010-1234-5678",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    phone: "010-2345-6789",
  },
  {
    id: "3",
    name: "박지민",
    email: "park@example.com",
    phone: "010-3456-7890",
  },
];

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
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

  const handleAddStudent = () => {
    // 폼 검증
    if (!validateForm()) {
      return;
    }

    if (isEditMode && editingStudentId) {
      // 수정 모드
      setStudents(
        students.map((student) =>
          student.id === editingStudentId
            ? { ...currentStudent, id: editingStudentId }
            : student,
        ),
      );
    } else {
      // 추가 모드
      const newId = (
        Math.max(...students.map((s) => parseInt(s.id))) + 1
      ).toString();
      const newStudent: Student = {
        id: newId,
        ...currentStudent,
      };
      setStudents([...students, newStudent]);
    }

    // 폼 초기화
    setCurrentStudent({ name: "", email: "", phone: "" });
    setValidationErrors({});
    setIsFormOpen(false);
    setIsEditMode(false);
    setEditingStudentId(null);
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

  const confirmDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter((student) => student.id !== studentToDelete));
      setStudentToDelete(null);
      setIsDeleteOpen(false);
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
                >
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
            <Button variant="outline" onClick={cancelDelete}>
              취소
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
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
            {students.map((student) => (
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
                    >
                      수정
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteClick(student.id)}
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
