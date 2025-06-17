"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { Student } from "@/types/user";
import { Challenge } from "@/types/challenge";
import { useStudentValidation } from "@/hooks/admin/useStudentValidation";

interface StudentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    student: Omit<Student, "id">,
    challenges: number[],
  ) => Promise<void>;
  existingStudent?: Student;
  challenges: Challenge[];
  initialChallenges?: number[];
  isSubmitting?: boolean;
}

export default function StudentFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  existingStudent,
  challenges,
  initialChallenges = [],
  isSubmitting = false,
}: StudentFormDialogProps) {
  const [currentStudent, setCurrentStudent] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);

  const { validationErrors, setValidationErrors, validateField, validateForm } =
    useStudentValidation();

  useEffect(() => {
    if (existingStudent) {
      setCurrentStudent({
        name: existingStudent.name,
        email: existingStudent.email,
        phone: existingStudent.phone,
      });
      setSelectedChallenges(initialChallenges);
    } else {
      setCurrentStudent({ name: "", email: "", phone: "" });
      setSelectedChallenges([]);
    }
  }, [existingStudent, initialChallenges]);

  const handleInputChange = (
    field: keyof Omit<Student, "id">,
    value: string,
  ) => {
    setCurrentStudent((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleFieldBlur = async (field: keyof Omit<Student, "id">) => {
    const error = await validateField(
      field,
      String(currentStudent[field]),
      existingStudent?.id,
    );
    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSubmit = async () => {
    const isValid = await validateForm(currentStudent, existingStudent?.id);
    if (!isValid) return;

    await onSubmit(currentStudent, selectedChallenges);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle>
            {existingStudent ? "수강생 수정" : "수강생 추가"}
          </DialogTitle>
          <DialogDescription>
            {existingStudent
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
              onBlur={() => handleFieldBlur("name")}
              className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${
                validationErrors.name ? "border-red-500" : ""
              }`}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
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
              onBlur={() => handleFieldBlur("email")}
              className={`bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20 ${
                validationErrors.email ? "border-red-500" : ""
              }`}
              placeholder="example@email.com"
            />
            {validationErrors.email && (
              <p className="text-sm text-red-500">{validationErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-300">
              전화번호
            </Label>
            <Input
              id="phone"
              value={currentStudent.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="bg-[#1A1D29]/70 border-gray-700/50 text-white focus:border-[#5046E4] focus:ring-[#5046E4]/20"
              placeholder="010-0000-0000"
            />
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
                  setSelectedChallenges([...selectedChallenges, numValue]);
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
              <div key="selected-challenges-outer" className="mt-2 space-y-2">
                {selectedChallenges.map((challengeId) => {
                  const challenge = challenges.find(
                    (c) => c.id === challengeId,
                  );
                  return (
                    <div
                      key={`challenge-${challengeId}`}
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
            )}
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {existingStudent ? "수정하기" : "추가하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
