"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import LectureForm from "@/components/admin/lectures/LectureForm";
import { LectureWithSequence } from "@/types/lecture";
import { deleteLecture } from "@/apis/lectures";

interface LectureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  isEdit?: boolean;
  lecture?: LectureWithSequence | null;
}

// lecture의 유무로 수정인지 추가인지 구분할 수 있으므로 isEdit는 필요없는 props 같음
export default function LectureDialog({
  open,
  onOpenChange,
  title,
  isEdit,
  lecture,
  maxWidth = "md",
}: LectureDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const maxWidthClasses = {
    sm: "sm:max-w-[400px]",
    md: "sm:max-w-[600px]",
    lg: "sm:max-w-[800px]",
    xl: "sm:max-w-[1000px]",
  };

  const handleDelete = async () => {
    if (!lecture) return;

    try {
      setIsDeleting(true);
      await deleteLecture(lecture.id);
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-challenges"] });
      toast.success("강의가 삭제되었습니다.");
      onOpenChange(false);
    } catch (error) {
      toast.error("강의 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${maxWidthClasses[maxWidth]} max-h-[90vh] flex flex-col p-0 bg-[#252A3C] border-gray-700/30 text-white`}
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <LectureForm
            onSuccess={handleSuccess}
            isEdit={isEdit}
            lectureId={lecture?.id}
            initialData={
              lecture
                ? {
                    name: lecture.name,
                    description: lecture.description || "",
                    url: lecture.url || "",
                    assignmentTitle: lecture.assignment_title || "",
                    assignment: lecture.assignment || "",
                  }
                : undefined
            }
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
