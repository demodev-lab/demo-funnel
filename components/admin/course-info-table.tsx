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
import { Check, X, Pencil, Upload, Trash, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getStudentSubmissions } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { StudentSubmission } from "@/types/user";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createSubmission, updateSubmission } from "@/apis/assignments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { validateFileSize } from "@/utils/files";
import { Textarea } from "@/components/ui/textarea";

interface SubmissionFormData {
  url: string;
  comment: string;
  imageFile?: File;
}

interface SubmissionDialogProps {
  studentName: string;
  studentId: number;
  lectureNumber: number;
  lectureId: number;
  challengeLectureId: number;
  isSubmitted: boolean;
  dueDate?: string;
  submissionDate?: string;
  submissionId?: number;
  assignments?: {
    url: string;
    comment: string;
    imageUrl?: string;
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetIndex, setDeleteTargetIndex] = useState<number | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<{
    index: number;
    url: string;
    image?: string;
  } | null>(null);
  const [isNewAssignment, setIsNewAssignment] = useState(false);
  const { selectedChallengeId } = useChallengeStore();
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionFormData>({
    url: "",
    comment: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSubmissionId, setEditSubmissionId] = useState<number | null>(null);
  const queryClient = useQueryClient();

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

  const submitAssignmentMutation = useMutation({
    mutationFn: async ({
      userId,
      challengeLectureId,
      link,
      text,
      imageFile,
    }: {
      userId: number;
      challengeLectureId: number;
      link: string;
      text: string;
      imageFile?: File;
    }) => {
      return createSubmission({
        link,
        text,
        challengeLectureId,
        userId,
        imageFile,
      });
    },
    onSuccess: () => {
      toast.success("과제가 성공적으로 제출되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
      setSelectedSubmission(null);
      setSubmissionData({ url: "", comment: "" });
      setIsSubmitFormOpen(false);
    },
    onError: (error) => {
      toast.error("과제 제출 중 오류가 발생했습니다.");
      console.error("과제 제출 오류:", error);
    },
  });

  const updateSubmissionMutation = useMutation({
    mutationFn: async ({
      submissionId,
      link,
      text,
      imageFile,
    }: {
      submissionId: number;
      link: string;
      text: string;
      imageFile?: File;
    }) => {
      return updateSubmission({
        submissionId,
        link,
        text,
        imageFile,
      });
    },
    onSuccess: () => {
      toast.success("과제가 성공적으로 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
      setSelectedSubmission(null);
      setSubmissionData({ url: "", comment: "" });
      setIsSubmitFormOpen(false);
      setIsEditMode(false);
      setEditSubmissionId(null);
    },
    onError: (error) => {
      toast.error("과제 수정 중 오류가 발생했습니다.");
      console.error("과제 수정 오류:", error);
    },
  });

  const handleSubmit = async () => {
    if (
      !selectedSubmission?.challengeLectureId ||
      !selectedSubmission?.studentId
    )
      return;
    if (!submissionData.url.trim()) {
      toast.error("과제 URL을 입력해주세요.");
      return;
    }
    if (!submissionData.comment.trim()) {
      toast.error("과제 설명을 입력해주세요.");
      return;
    }

    if (
      submissionData.imageFile &&
      !validateFileSize(submissionData.imageFile)
    ) {
      toast.error("이미지 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    if (isEditMode && editSubmissionId) {
      console.log("수정중임..");
      updateSubmissionMutation.mutate({
        submissionId: editSubmissionId,
        link: submissionData.url,
        text: submissionData.comment,
        imageFile: submissionData.imageFile,
      });
    } else {
      submitAssignmentMutation.mutate({
        userId: selectedSubmission.studentId,
        challengeLectureId: selectedSubmission.challengeLectureId,
        link: submissionData.url,
        text: submissionData.comment,
        imageFile: submissionData.imageFile,
      });
    }
  };

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
          <div className="flex-1 bg-[#252A3C]">
            <Table>
              <TableHeader className="bg-[#1A1D29]">
                <TableRow className="hover:bg-transparent border-b border-gray-700/30">
                  <TableHead className="w-[60px] bg-[#1A1D29] h-[58px] px-4">
                    No.
                  </TableHead>
                  <TableHead className="bg-[#1A1D29] h-[58px] px-4">
                    수강생 이름
                  </TableHead>
                  <TableHead className="bg-[#1A1D29] h-[58px] px-4">
                    이메일
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow
                    key={`fixed-${student.userId}-${index}`}
                    className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
                  >
                    <TableCell className="w-[60px] bg-[#252A3C] font-medium text-gray-300 h-[58px] px-4">
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
          <div className="w-[320px] overflow-x-auto bg-[#252A3C] relative">
            <div
              style={{
                width:
                  filteredStudents[0]?.submissions.length <= 4
                    ? "320px"
                    : `${filteredStudents[0]?.submissions.length * 80}px`,
                minWidth: "320px",
              }}
            >
              <Table className="w-full table-fixed">
                <TableHeader className="sticky top-0 bg-[#1A1D29] z-10">
                  <TableRow className="hover:bg-transparent border-b border-gray-700/30">
                    {filteredStudents[0]?.submissions.map((_, index) => (
                      <TableHead
                        key={index}
                        className="text-center whitespace-nowrap h-[58px] px-4"
                        style={{
                          width:
                            filteredStudents[0].submissions.length <= 4
                              ? `${320 / filteredStudents[0].submissions.length}px`
                              : "80px",
                        }}
                      >
                        {index + 1}강
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={`scroll-${student.userId}-${index}`}
                      className="hover:bg-[#1C1F2B]/50 border-b border-gray-700/30 last:border-b-0"
                    >
                      {student.submissions.map((submission, lectureIndex) => (
                        <TableCell
                          key={`${student.userId}-${lectureIndex}`}
                          className="text-center cursor-pointer bg-[#252A3C] hover:bg-[#1C1F2B] h-[58px] px-4"
                          style={{
                            width:
                              student.submissions.length <= 4
                                ? `${320 / student.submissions.length}px`
                                : "80px",
                          }}
                          onClick={() => {
                            console.log(
                              "선택한 강의 ID:",
                              submission.lectureId,
                            );
                            setSelectedSubmission({
                              studentName: student.userName,
                              studentId: student.userId,
                              lectureNumber: lectureIndex + 1,
                              lectureId: submission.lectureId,
                              challengeLectureId: submission.challengeLectureId,
                              isSubmitted: submission.isSubmitted,
                              dueDate: submission.dueDate,
                              submissionId: submission.submissionId,
                              submissionDate: submission.isSubmitted
                                ? "2024-03-19 14:30"
                                : undefined,
                              assignments: submission.assignments,
                            });
                          }}
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
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSubmission(null);
          }
        }}
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
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-300">
                              과제 설명{" "}
                              {selectedSubmission.assignments!.length > 1
                                ? `#${index + 1}`
                                : ""}
                              :
                            </p>
                            <Button
                              className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
                              onClick={() => {
                                setIsEditMode(true);
                                setEditSubmissionId(
                                  selectedSubmission.submissionId || null,
                                );
                                setSubmissionData({
                                  url: assignment.url || "",
                                  comment: assignment.comment || "",
                                });
                                setIsSubmitFormOpen(true);
                              }}
                            >
                              수정
                            </Button>
                          </div>
                          <p className="text-gray-300 whitespace-pre-wrap">
                            {assignment.comment}
                          </p>
                        </div>
                      )}
                      {/* 이미지 표시 영역 */}
                      {assignment.imageUrl ? (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-300 mb-2">
                            제출된 이미지:
                          </p>
                          <img
                            src={assignment.imageUrl}
                            alt="제출된 과제 이미지"
                            className="w-full h-auto rounded-lg border border-gray-700/30"
                          />
                        </div>
                      ) : (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-300 mb-2">
                            제출된 이미지:
                          </p>
                          <div className="bg-[#1A1D29] border border-gray-700/30 rounded-lg p-4 text-center">
                            <p className="text-gray-400">
                              제출된 이미지가 없습니다.
                            </p>
                          </div>
                        </div>
                      )}
                      {assignment.url && (
                        <div className="flex justify-end mt-4">
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
                  <div className="border border-gray-700/30 rounded-md p-8 bg-[#1A1D29]/60">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#2A2F42] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-400">제출된 과제가 없습니다.</p>
                      <Button
                        className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
                        onClick={() => {
                          setIsNewAssignment(true);
                          setEditingAssignment({
                            index: 0,
                            url: "",
                            image: undefined,
                          });
                          setEditModalOpen(true);
                        }}
                      >
                        과제 등록
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2F42] flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-400">아직 과제가 제출되지 않았습니다.</p>
              {selectedSubmission?.dueDate &&
              new Date(selectedSubmission.dueDate) > new Date() ? (
                <Button
                  className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
                  onClick={() => {
                    setIsSubmitFormOpen(true);
                  }}
                >
                  과제 제출
                </Button>
              ) : (
                <p className="text-[#FF9898]">제출 기한이 지났습니다.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 AlertDialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-[#252A3C] border-gray-700/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              과제 삭제
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              정말 이 과제를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-[#1A1D29] hover:bg-[#252A3C] text-gray-300 border-gray-700/30"
              onClick={() => setDeleteTargetIndex(null)}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#3A2438] hover:bg-[#4E2D4A] text-[#FF9898] border-0"
              onClick={() => {
                // TODO: 삭제 기능 구현
                setDeleteTargetIndex(null);
              }}
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 과제 수정/등록 모달 */}
      <Dialog
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            setEditingAssignment(null);
            setIsNewAssignment(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isNewAssignment ? "과제 등록" : "과제 수정"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">과제 URL</Label>
              <Input
                value={editingAssignment?.url || ""}
                onChange={(e) =>
                  setEditingAssignment((prev) =>
                    prev ? { ...prev, url: e.target.value } : null,
                  )
                }
                className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4]"
                placeholder="https://"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-gray-300">제출된 이미지</Label>
              {editingAssignment?.image ? (
                <div className="relative group">
                  <img
                    src={editingAssignment.image}
                    alt="제출된 과제 이미지"
                    className="w-full h-auto rounded-lg border border-gray-700/30"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        // TODO: 이미지 변경 기능 구현
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      변경
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#FF9898] hover:bg-[#3A2438]"
                      onClick={() => {
                        // TODO: 이미지 삭제 기능 구현
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#1A1D29] border border-gray-700/30 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-500" />
                    <p className="text-gray-400">
                      {isNewAssignment
                        ? "이미지를 업로드해주세요."
                        : "제출된 이미지가 없습니다."}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[#8C7DFF] hover:bg-[#5046E4]/20"
                      onClick={() => {
                        // TODO: 이미지 업로드 기능 구현
                      }}
                    >
                      이미지 업로드
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              className="bg-[#1A1D29] hover:bg-[#252A3C] text-gray-300"
              onClick={() => {
                setEditingAssignment(null);
                setIsNewAssignment(false);
                setEditModalOpen(false);
              }}
            >
              취소
            </Button>
            <Button
              className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
              onClick={() => {
                // TODO: 수정/등록 기능 구현
                setEditingAssignment(null);
                setIsNewAssignment(false);
                setEditModalOpen(false);
              }}
            >
              {isNewAssignment ? "등록" : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 과제 제출/수정 폼 다이얼로그 */}
      <Dialog
        open={isSubmitFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsSubmitFormOpen(false);
            setSubmissionData({ url: "", comment: "" });
            setSelectedSubmission(null);
            setIsEditMode(false);
            setEditSubmissionId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditMode ? "과제 수정" : "과제 제출"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">과제 URL</Label>
              <Input
                value={submissionData.url}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
                className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4]"
                placeholder="https://"
              />
            </div>
            <div>
              <Label className="text-gray-300">과제 설명</Label>
              <Textarea
                value={submissionData.comment}
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4] min-h-[100px]"
                placeholder="과제에 대한 설명을 입력해주세요."
              />
            </div>
            <div>
              <Label className="text-gray-300">이미지 첨부</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setSubmissionData((prev) => ({
                    ...prev,
                    imageFile: e.target.files?.[0],
                  }))
                }
                className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4]"
              />
            </div>
            <Button
              className="w-full bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
              onClick={handleSubmit}
              disabled={
                submitAssignmentMutation.isPending ||
                updateSubmissionMutation.isPending
              }
            >
              {submitAssignmentMutation.isPending ||
              updateSubmissionMutation.isPending ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {isEditMode ? "수정 중..." : "제출 중..."}
                </div>
              ) : isEditMode ? (
                "과제 수정"
              ) : (
                "과제 제출"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
