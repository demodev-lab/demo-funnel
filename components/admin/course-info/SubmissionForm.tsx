import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { SubmissionDialogProps } from "./SubmissionDialogContent";

interface SubmissionFormData {
  url: string;
  comment: string;
  imageFile?: File;
}

interface SubmissionFormProps {
  submissionData: SubmissionFormData;
  setSubmissionData: (data: SubmissionFormData) => void;
  selectedSubmission: SubmissionDialogProps | null;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function SubmissionForm({
  submissionData,
  setSubmissionData,
  selectedSubmission,
  isEditMode,
  isSubmitting,
  onSubmit,
}: SubmissionFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-gray-300">과제 URL</Label>
        <Input
          value={submissionData.url}
          onChange={(e) =>
            setSubmissionData({
              ...submissionData,
              url: e.target.value,
            })
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
            setSubmissionData({
              ...submissionData,
              comment: e.target.value,
            })
          }
          className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4] min-h-[100px]"
          placeholder="과제에 대한 설명을 입력해주세요."
        />
      </div>
      <div>
        <Label className="text-gray-300">이미지 첨부</Label>
        <div className="space-y-4">
          <div className="image-preview-container">
            {selectedSubmission?.assignments?.[0]?.imageUrl &&
              !submissionData.imageFile && (
                <div className="relative">
                  <img
                    src={selectedSubmission.assignments[0].imageUrl}
                    alt="현재 제출된 이미지"
                    className="w-full h-auto rounded-lg border border-gray-700/30"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    현재 제출된 이미지
                  </p>
                </div>
              )}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSubmissionData({
                  ...submissionData,
                  imageFile: file,
                });

                const reader = new FileReader();
                reader.onload = (e) => {
                  const container = document.querySelector(
                    ".image-preview-container",
                  );
                  if (container && e.target?.result) {
                    const img = document.createElement("img");
                    img.src = e.target.result as string;
                    img.className =
                      "w-full h-auto rounded-lg border border-gray-700/30";
                    container.innerHTML = "";
                    container.appendChild(img);
                    const caption = document.createElement("p");
                    caption.className = "text-sm text-gray-400 mt-2";
                    caption.textContent = "새로 선택한 이미지";
                    container.appendChild(caption);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            className="bg-[#1A1D29] border-gray-700/30 text-gray-200 focus-visible:ring-[#5046E4]"
          />
        </div>
      </div>
      <Button
        className="w-full bg-[#5046E4] hover:bg-[#6A5AFF] text-white"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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
  );
}

export type { SubmissionFormData };
