"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSubmission } from '@/apis/assignments';

interface AssignmentSubmissionFormProps {
  userId: number;
  challengeLectureId: string;
}

export function AssignmentSubmissionForm({ userId, challengeLectureId }: AssignmentSubmissionFormProps) {
  const queryClient = useQueryClient();
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [newSubmission, setNewSubmission] = useState("");

  const { mutate: handleSubmit } = useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      link: string;
      text: string;
    }) => createSubmission({
      ...data,
      challengeLectureId,
      userId: userId.toString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
      setNewSubmission("");
      setSubmissionLink("");
      setSubmitterName("");
      setSubmitterEmail("");
      toast.success("과제가 성공적으로 제출되었습니다.");
    },
    onError: (error) => {
      console.error("과제 제출 실패:", error);
      toast.error("과제 제출에 실패했습니다.");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newSubmission.trim() ||
      !submitterName.trim() ||
      !submitterEmail.trim() ||
      !submissionLink.trim()
    )
      return;

    handleSubmit({
      name: submitterName,
      email: submitterEmail,
      link: submissionLink,
      text: newSubmission,
    });
  };

  return (
    <form onSubmit={onSubmit} className="p-4 border-b border-gray-700">
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="이름"
            className="bg-[#1C1F2B] border-gray-700"
            required
          />
          <Input
            type="email"
            value={submitterEmail}
            onChange={(e) => setSubmitterEmail(e.target.value)}
            placeholder="이메일"
            className="bg-[#1C1F2B] border-gray-700"
            required
          />
        </div>
        <div className="flex items-center gap-2">
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
  );
} 