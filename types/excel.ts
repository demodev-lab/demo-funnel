import { Student } from "@/hooks/useStudents";

export interface ExcelStudent extends Omit<Student, "id"> {
  isValid: boolean;
  errors: string[];
}

export interface ExcelUploadProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (students: ExcelStudent[]) => Promise<void>;
  isProcessing: boolean;
  selectedChallengeId?: number;
  challenges: Array<{ id: number; name: string }>;
  validateStudent: (student: Omit<Student, "id">) => string[];
}
