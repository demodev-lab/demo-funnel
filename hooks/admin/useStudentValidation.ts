import { useState } from "react";
import { Student } from "@/types/user";

interface ValidationErrors {
  name?: string;
  email?: string;
}

export function useStudentValidation(existingStudents: Student[] = []) {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) {
      return "이름을 입력해주세요.";
    }
    if (name.trim().length < 2) {
      return "이름은 2글자 이상 입력해주세요.";
    }
    return undefined;
  };

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

  const checkDuplicateEmail = (
    email: string,
    excludeId?: number,
  ): string | undefined => {
    const isDuplicate = existingStudents.some(
      (student) => student.email === email && student.id !== excludeId,
    );
    if (isDuplicate) {
      return "중복된 이메일입니다.";
    }
    return undefined;
  };

  const validateField = async (
    field: keyof Omit<Student, "id">,
    value: string,
    excludeId?: number,
  ): Promise<string | undefined> => {
    switch (field) {
      case "name":
        return validateName(value);
      case "email": {
        const emailError = validateEmail(value);
        if (emailError) return emailError;
        return checkDuplicateEmail(value, excludeId);
      }
      default:
        return undefined;
    }
  };

  const validateForm = async (
    student: Omit<Student, "id">,
    excludeId?: number,
  ): Promise<boolean> => {
    const errors: ValidationErrors = {};

    const fields: (keyof Omit<Student, "id">)[] = ["name", "email"];
    await Promise.all(
      fields.map(async (field) => {
        const error = await validateField(
          field,
          String(student[field]),
          excludeId,
        );
        if (error) errors[field] = error;
      }),
    );

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    validationErrors,
    setValidationErrors,
    validateField,
    validateForm,
  };
}
