"use client";

import { useState, useMemo } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getStudentSubmissions } from "@/apis/users";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
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
} from "@/components/common/alert-dialog";
import { Button } from "@/components/common/button";
import {
  createSubmission,
  updateSubmission,
  deleteSubmission,
} from "@/apis/assignments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { validateFileSize } from "@/utils/files";
import { StudentTable } from "./StudentTable";
import {
  SubmissionDialogContent,
  SubmissionDialogProps,
} from "./SubmissionDialogContent";
import { SubmissionForm, SubmissionFormData } from "./SubmissionForm";

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
  const { selectedChallengeId } = useChallengeStore();
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const [submissionData, setSubmissionData] = useState<SubmissionFormData>({
    url: "",
    comment: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSubmissionId, setEditSubmissionId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<number | null>(
    null,
  );

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

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (submissionId: number) => {
      return deleteSubmission(submissionId);
    },
    onSuccess: () => {
      toast.success("과제가 성공적으로 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
      setSelectedSubmission(null);
      setDeleteConfirmOpen(false);
      setDeleteSubmissionId(null);
    },
    onError: (error) => {
      toast.error("과제 삭제 중 오류가 발생했습니다.");
      console.error("과제 삭제 오류:", error);
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
      const imageFile =
        submissionData.imageFile === undefined &&
        selectedSubmission?.assignments?.[0]?.imageUrl
          ? null
          : submissionData.imageFile;

      updateSubmissionMutation.mutate({
        submissionId: editSubmissionId,
        link: submissionData.url,
        text: submissionData.comment,
        imageFile,
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

  const handleSubmissionClick = (student: any, lectureIndex: number) => {
    const submission = student.submissions[lectureIndex];
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
        ? submission.submittedAt
        : undefined,
      assignments: submission.assignments,
    });
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
        <StudentTable
          students={filteredStudents}
          onSubmissionClick={handleSubmissionClick}
        />

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

      {/* 과제 정보 모달 */}
      {selectedSubmission && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedSubmission(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md bg-[#252A3C] border-gray-700/30 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedSubmission.isSubmitted
                  ? "과제 제출 정보"
                  : "미제출 과제"}
              </DialogTitle>
            </DialogHeader>
            {selectedSubmission.isSubmitted ? (
              <SubmissionDialogContent
                submission={selectedSubmission}
                onEdit={(url, comment) => {
                  setIsEditMode(true);
                  setEditSubmissionId(selectedSubmission.submissionId || null);
                  setSubmissionData({
                    url,
                    comment,
                  });
                  setIsSubmitFormOpen(true);
                }}
                onDelete={(submissionId) => {
                  setDeleteSubmissionId(submissionId);
                  setDeleteConfirmOpen(true);
                }}
              />
            ) : (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#2A2F42] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-400">
                  아직 과제가 제출되지 않았습니다.
                </p>
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
      )}

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
              onClick={() => {
                setDeleteSubmissionId(null);
                setDeleteConfirmOpen(false);
              }}
            >
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#3A2438] hover:bg-[#4E2D4A] text-[#FF9898] border-0"
              onClick={() => {
                if (deleteSubmissionId) {
                  deleteSubmissionMutation.mutate(deleteSubmissionId);
                }
              }}
            >
              {deleteSubmissionMutation.isPending ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-[#FF9898] border-t-transparent rounded-full animate-spin mr-2" />
                  삭제 중...
                </div>
              ) : (
                "삭제"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <DialogContent className="sm:max-w-md bg-[#252A3C] border-gray-700/30 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {isEditMode ? "과제 수정" : "과제 제출"}
            </DialogTitle>
          </DialogHeader>
          <SubmissionForm
            submissionData={submissionData}
            setSubmissionData={setSubmissionData}
            selectedSubmission={selectedSubmission}
            isEditMode={isEditMode}
            isSubmitting={
              submitAssignmentMutation.isPending ||
              updateSubmissionMutation.isPending
            }
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
