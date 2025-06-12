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
import { useInfiniteQuery } from "@tanstack/react-query";
import { getStudentSubmissions } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { StudentSubmission } from "@/types/user";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface SubmissionDialogProps {
  studentName: string;
  lectureNumber: number;
  isSubmitted: boolean;
  submissionDate?: string;
  assignments?: {
    url: string;
    comment: string;
  }[];
}

interface CourseInfoTableProps {
  searchQuery: string;
  showCompletedOnly: boolean;
}

const PAGE_SIZE = 10;

export default function CourseInfoTable({
  searchQuery,
  showCompletedOnly,
}: CourseInfoTableProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionDialogProps | null>(null);
  const { selectedChallengeId } = useChallengeStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["student-submissions", selectedChallengeId, showCompletedOnly],
      queryFn: async ({ pageParam = 0 }) => {
        if (!selectedChallengeId) return { data: [], total: 0 };
        return getStudentSubmissions(
          selectedChallengeId,
          pageParam,
          PAGE_SIZE,
          showCompletedOnly,
        );
      },
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.data || lastPage.data.length < PAGE_SIZE)
          return undefined;
        return allPages.length;
      },
      initialPageParam: 0,
      enabled: !!selectedChallengeId,
    });

  const observerRef = useInfiniteScroll({
    onIntersect: () => fetchNextPage(),
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const filteredStudents = useMemo(() => {
    if (!data?.pages) return [];

    const allStudents = data.pages.flatMap((page) => page.data);

    return allStudents.filter((student) => {
      // 검색어 필터링
      const searchMatch =
        searchQuery.toLowerCase().trim() === "" ||
        student.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

      return searchMatch;
    });
  }, [data?.pages, searchQuery]);

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
        <div className="flex divide-x divide-gray-700/30">
          {/* 고정 영역 */}
          <div className="flex-none bg-[#252A3C]">
            <Table>
              <TableHeader className="bg-[#1A1D29]">
                <TableRow className="hover:bg-transparent border-b border-gray-700/30">
                  <TableHead className="w-[60px] bg-[#1A1D29] h-[58px] px-4">
                    No.
                  </TableHead>
                  <TableHead className="w-[120px] bg-[#1A1D29] h-[58px] px-4">
                    수강생 이름
                  </TableHead>
                  <TableHead className="w-[180px] bg-[#1A1D29] h-[58px] px-4">
                    이메일
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow
                    key={`${student.userId}-fixed`}
                    className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
                  >
                    <TableCell className="bg-[#252A3C] font-medium text-gray-300 h-[58px] px-4">
                      {index + 1}
                    </TableCell>
                    <TableCell className="bg-[#252A3C] font-medium text-gray-300 h-[58px] px-4">
                      {student.userName}
                    </TableCell>
                    <TableCell className="bg-[#252A3C] text-gray-400 h-[58px] px-4">
                      {student.userEmail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 스크롤 영역 (과제 제출) */}
          <div className="flex-1 overflow-x-auto bg-[#252A3C] relative">
            <div className="absolute inset-0 bg-[#1A1D29] h-[58px]" />
            <div className="min-w-[320px]">
              <Table
                className="table-layout-fixed"
                style={{
                  width: `${filteredStudents[0]?.submissions.length * 80}px`,
                }}
              >
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-700/30">
                    {filteredStudents[0]?.submissions.map((_, index) => (
                      <TableHead
                        key={index}
                        className="w-[80px] text-center whitespace-nowrap h-[58px] px-4"
                      >
                        {index + 1}강
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow
                      key={`${student.userId}-scroll`}
                      className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
                    >
                      {student.submissions.map((submission, lectureIndex) => (
                        <TableCell
                          key={submission.lectureId}
                          className="w-[80px] text-center cursor-pointer bg-[#252A3C] hover:bg-[#1C1F2B] h-[58px] px-4"
                          onClick={() =>
                            setSelectedSubmission({
                              studentName: student.userName,
                              lectureNumber: lectureIndex + 1,
                              isSubmitted: submission.isSubmitted,
                              submissionDate: submission.isSubmitted
                                ? "2024-03-19 14:30"
                                : undefined,
                              assignments: submission.assignments,
                            })
                          }
                        >
                          <div className="flex justify-center">
                            {submission.isSubmitted ? (
                              <div className="w-6 h-6 rounded-full bg-[#5046E4]/20 flex items-center justify-center">
                                <Check className="h-4 w-4 text-[#8C7DFF]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#1A1D29] flex items-center justify-center">
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
          </div>
        </div>

        {/* 무한 스크롤 옵저버 타겟 */}
        <div
          ref={observerRef}
          className="w-full h-4 flex items-center justify-center p-4"
        >
          {isFetchingNextPage && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
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
              <div className="space-y-4">
                {selectedSubmission.assignments?.map((assignment, index) => (
                  <div
                    key={index}
                    className="border border-gray-700/30 rounded-md p-4 bg-[#1A1D29]/60"
                  >
                    <div className="space-y-3">
                      {assignment.comment && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-300">
                            과제 설명{" "}
                            {selectedSubmission.assignments!.length > 1
                              ? `#${index + 1}`
                              : ""}
                            :
                          </p>
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {assignment.comment}
                          </p>
                        </div>
                      )}
                      {assignment.url && (
                        <div className="flex justify-end">
                          <a
                            href={assignment.url}
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
                  </div>
                ))}
                {(!selectedSubmission.assignments ||
                  selectedSubmission.assignments.length === 0) && (
                  <div className="border border-gray-700/30 rounded-md p-4 bg-[#1A1D29]/60">
                    <p className="text-gray-400 text-sm">
                      과제 정보가 없습니다.
                    </p>
                  </div>
                )}
              </div>
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
