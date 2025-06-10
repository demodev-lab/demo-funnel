import { type Student } from "@/hooks/useStudents";

export interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return "이메일을 입력해주세요.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "올바른 이메일 형식을 입력해주세요.";
  return undefined;
};

export const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) return "전화번호를 입력해주세요.";
  const phoneRegex = /^010-\d{4}-\d{4}$/;
  if (!phoneRegex.test(phone))
    return "전화번호는 010-0000-0000 형식으로 입력해주세요.";
  return undefined;
};

export const validateName = (name: string): string | undefined => {
  if (!name.trim()) return "이름을 입력해주세요.";
  if (name.trim().length < 2) return "이름은 2글자 이상 입력해주세요.";
  return undefined;
};

export const checkDuplicateEmail = (
  email: string,
  students: Student[],
  excludeId?: number,
): string | undefined => {
  const isDuplicate = students.some(
    (student) => student.email === email && student.id !== excludeId,
  );
  if (isDuplicate) return "이미 등록된 이메일입니다.";
  return undefined;
};

export const validateStudentForm = (
  student: Omit<Student, "id">,
  students: Student[],
  excludeId?: number,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  const nameError = validateName(student.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(student.email);
  if (emailError) {
    errors.email = emailError;
  } else {
    const duplicateError = checkDuplicateEmail(
      student.email,
      students,
      excludeId,
    );
    if (duplicateError) errors.email = duplicateError;
  }

  const phoneError = validatePhone(student.phone);
  if (phoneError) errors.phone = phoneError;

  return errors;
};
