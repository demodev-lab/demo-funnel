import { Button } from "@/components/common/button";
import { FileText } from "lucide-react";

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

interface SubmissionDialogContentProps {
  submission: SubmissionDialogProps;
  onEdit: (url: string, comment: string) => void;
  onDelete: (submissionId: number) => void;
}

export function SubmissionDialogContent({
  submission,
  onEdit,
  onDelete,
}: SubmissionDialogContentProps) {
  if (!submission) return null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-200">
          {submission.studentName} - {submission.lectureNumber}강 과제
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-400">
            제출일: {submission.submissionDate}
          </p>
          {submission.assignments?.find((a) => a.url) && (
            <a
              href={submission.assignments.find((a) => a.url)?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-[#8C7DFF] hover:text-[#6A5AFF] transition-colors gap-1"
            >
              과제 보러가기
              <svg
                width="14"
                height="14"
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
          )}
        </div>
      </div>
      <div className="space-y-4">
        {submission.assignments?.map((assignment, index) => (
          <div
            key={index}
            className="border border-gray-700/30 rounded-md p-4 bg-[#1A1D29]/60"
          >
            <div className="space-y-3">
              {assignment.comment && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-300">
                      과제 설명{" "}
                      {submission.assignments!.length > 1
                        ? `#${index + 1}`
                        : ""}
                      :
                    </p>
                  </div>
                  <div className="bg-[#1A1D29]/80 p-4 rounded-lg border border-gray-700/30">
                    <p className="text-gray-300 whitespace-pre-wrap break-all">
                      {assignment.comment}
                    </p>
                  </div>
                </div>
              )}
              {assignment.imageUrl ? (
                <div>
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
                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    제출된 이미지:
                  </p>
                  <div className="bg-[#1A1D29] border border-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-gray-400">제출된 이미지가 없습니다.</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white w-full"
                  onClick={() =>
                    onEdit(assignment.url || "", assignment.comment || "")
                  }
                >
                  수정
                </Button>
                <Button
                  variant="destructive"
                  className="bg-[#3A2438] hover:bg-[#4E2D4A] text-[#FF9898] border-0 w-full"
                  onClick={() => onDelete(submission.submissionId || 0)}
                >
                  삭제
                </Button>
              </div>
            </div>
          </div>
        ))}
        {(!submission.assignments || submission.assignments.length === 0) && (
          <div className="border border-gray-700/30 rounded-md p-8 bg-[#1A1D29]/60">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2A2F42] flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-400">제출된 과제가 없습니다.</p>
              <Button
                className="bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
                onClick={() => {
                  // TODO: 과제 등록 로직
                }}
              >
                과제 등록
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { SubmissionDialogProps };
