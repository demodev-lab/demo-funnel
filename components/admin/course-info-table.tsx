"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getStudentSubmissions } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";

interface SubmissionDialogProps {
  studentName: string;
  lectureNumber: number;
  isSubmitted: boolean;
  submissionDate?: string;
  assignmentUrl?: string;
  assignmentComment?: string;
}

interface CourseInfoTableProps {
  searchQuery: string;
  showUnsubmittedOnly: boolean;
}

export default function CourseInfoTable({
  searchQuery,
  showUnsubmittedOnly,
}: CourseInfoTableProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDialogProps | null>(null);
  const { selectedChallengeId } = useChallengeStore();

  const { data: studentSubmissions = [], isLoading } = useQuery({
    queryKey: ["student-submissions", selectedChallengeId],
    queryFn: () => getStudentSubmissions(selectedChallengeId || ""),
    enabled: !!selectedChallengeId,
  });

  const filteredStudents = useMemo(() => {
    return studentSubmissions.filter((student) => {
      // 검색어 필터링
      const searchMatch =
        searchQuery.toLowerCase().trim() === "" ||
        student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      // 미제출자 필터링
      const unsubmittedMatch =
        !showUnsubmittedOnly ||
        student.submissions.some((submission) => !submission.isSubmitted);

      return searchMatch && unsubmittedMatch;
    });
  }, [studentSubmissions, searchQuery, showUnsubmittedOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (filteredStudents.length === 0) {
    return (
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl p-8 text-center text-gray-400">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader className="bg-[#1A1D29]/60">
            <TableRow className="hover:bg-transparent">
              <TableHead>수강생 이름</TableHead>
              <TableHead>이메일</TableHead>
              {filteredStudents[0]?.submissions.map((_, index) => (
                <TableHead key={index} className="text-center">
                  {index + 1}강
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.userId} className="hover:bg-[#1C1F2B]/50">
                <TableCell className="font-medium text-gray-300">
                  {student.userName}
                </TableCell>
                <TableCell className="text-gray-400">
                  {student.userEmail}
                </TableCell>
                {student.submissions.map((submission, index) => (
                  <TableCell
                    key={submission.lectureId}
                    className="text-center cursor-pointer"
                    onClick={() =>
                      setSelectedSubmission({
                        studentName: student.userName,
                        lectureNumber: index + 1,
                        isSubmitted: submission.isSubmitted,
                        submissionDate: submission.isSubmitted
                          ? "2024-03-19 14:30"
                          : undefined,
                        assignmentUrl: submission.assignmentUrl,
                        assignmentComment: submission.assignmentComment,
                      })
                    }
                  >
                    <div className="flex justify-center">
                      {submission.isSubmitted ? (
                        <div className="w-6 h-6 rounded-full bg-[#5046E4]/20 flex items-center justify-center">
                          <Check className="h-4 w-4 text-[#8C7DFF]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#1A1D29]/60 flex items-center justify-center">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedSubmission}
        onOpenChange={() => setSelectedSubmission(null)}
      >
        <DialogContent className="sm:max-w-md bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedSubmission?.isSubmitted
                ? "과제 제출 정보"
                : "미제출 과제"}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission?.isSubmitted ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-200">
                  {selectedSubmission.studentName} -{" "}
                  {selectedSubmission.lectureNumber}강 과제
                </h3>
                <p className="text-sm text-gray-400">
                  제출일: {selectedSubmission.submissionDate}
                </p>
              </div>
              <div className="border border-gray-700/30 rounded-md p-4 bg-[#1A1D29]/60">
                {selectedSubmission.assignmentComment ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">
                      과제 설명:
                    </p>
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {selectedSubmission.assignmentComment}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">과제 설명이 없습니다.</p>
                )}
              </div>
              {selectedSubmission.assignmentUrl && (
                <div className="flex justify-end">
                  <a
                    href={selectedSubmission.assignmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5046E4] hover:bg-[#6A5AFF] transition-colors text-white font-medium"
                  >
                    과제 보러가기
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-400">
              <p>아직 과제가 제출되지 않았습니다.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
