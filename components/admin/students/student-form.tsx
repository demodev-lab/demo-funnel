import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { type Student } from "@/hooks/useStudents";

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface StudentFormProps {
  student: Omit<Student, "id">;
  onSubmit: () => Promise<void>;
  onChange: (field: keyof Omit<Student, "id">, value: string) => void;
  validationErrors: ValidationErrors;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function StudentForm({
  student,
  onSubmit,
  onChange,
  validationErrors,
  isSubmitting,
  isEditMode,
}: StudentFormProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          이름 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={student.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={validationErrors.name ? "border-red-500" : ""}
        />
        {validationErrors.name && (
          <p className="text-sm text-red-500">{validationErrors.name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          이메일 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={student.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={validationErrors.email ? "border-red-500" : ""}
          placeholder="example@email.com"
        />
        {validationErrors.email && (
          <p className="text-sm text-red-500">{validationErrors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">
          전화번호 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          value={student.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={validationErrors.phone ? "border-red-500" : ""}
          placeholder="010-0000-0000"
        />
        {validationErrors.phone && (
          <p className="text-sm text-red-500">{validationErrors.phone}</p>
        )}
      </div>
      <Button
        className="w-full bg-[#5046E4] hover:bg-[#4038c7]"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isEditMode ? "수정하기" : "추가하기"}
      </Button>
    </div>
  );
}
