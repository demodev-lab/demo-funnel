"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AssignmentSubmissionFormProps {
  onSubmit: (submission: {
    name: string;
    email: string;
    link: string;
    text: string;
  }) => void;
}

export function AssignmentSubmissionForm({ onSubmit }: AssignmentSubmissionFormProps) {
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [newSubmission, setNewSubmission] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newSubmission.trim() ||
      !submitterName.trim() ||
      !submitterEmail.trim() ||
      !submissionLink.trim()
    )
      return;

    onSubmit({
      name: submitterName,
      email: submitterEmail,
      link: submissionLink,
      text: newSubmission,
    });

    setNewSubmission("");
    setSubmissionLink("");
    setSubmitterName("");
    setSubmitterEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-700">
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