"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, LinkIcon, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubmission } from "@/apis/assignments";
import { userInfo } from "@/types/user";
import AssignmentConfetti from "./assignment-confetti";
import { validateFileSize } from "@/utils/files";
import { ImagePreview } from "@/components/ui/image-preview";

interface AssignmentSubmissionFormProps {
  userInfo: userInfo;
  challengeLectureId: number;
}

export function AssignmentSubmissionForm({
  userInfo,
  challengeLectureId,
}: AssignmentSubmissionFormProps) {
  const [newSubmission, setNewSubmission] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [isConfetti, setIsConfetti] = useState(false);
  const queryClient = useQueryClient();

  const resetForm = () => {
    setNewSubmission("");
    setSubmissionLink("");
  };
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: handleSubmit } = useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      link: string;
      text: string;
      imageFile?: File;
    }) =>
      createSubmission({
        ...data,
        challengeLectureId,
        userId: userInfo.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submitted-assignment", userInfo.id, challengeLectureId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-assignment-status", userInfo.id],
      });
      resetForm();
      setIsConfetti(true);
      toast.success("과제가 성공적으로 제출되었습니다.");

      setTimeout(() => {
        setIsConfetti(false);
      }, 3000);
    },
    onError: (error) => {
      resetForm();
      toast.error(error.message || "과제 제출에 실패했습니다.");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubmission.trim() || !submissionLink.trim()) return;

    handleSubmit({
      name: userInfo.name,
      email: userInfo.email,
      link: submissionLink,
      text: newSubmission,
      imageFile: imageFile || undefined,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file)) {
        toast.error("이미지 파일 크기는 3MB를 초과할 수 없습니다.");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <form onSubmit={onSubmit} className="p-4 border-b border-gray-700">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <Input
                type="url"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                placeholder="과제 링크 (GitHub, CodeSandbox, CodePen 등)"
                className="bg-[#1C1F2B] border-gray-700"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-gray-400" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="bg-[#1C1F2B] border-gray-700 file:text-white file:cursor-pointer file:hover:text-gray-700 file:transition-colors file:duration-300"
              />
              <div className="h-14 w-14 rounded-lg border border-gray-700 flex items-center justify-center shrink-0 relative group">
                {imagePreview ? (
                  <ImagePreview
                    imageUrl={imagePreview}
                    onRemove={handleRemoveImage}
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Textarea
              value={newSubmission}
              onChange={(e) => setNewSubmission(e.target.value)}
              placeholder="과제에 대한 설명이나 코멘트를 입력하세요."
              className="bg-[#1C1F2B] border-gray-700 min-h-[80px] resize-none flex-1"
              required
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#5046E4] hover:bg-[#DCD9FF] text-[#1C1F2B] self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
      <AssignmentConfetti isActive={isConfetti} />
    </div>
  );
}
