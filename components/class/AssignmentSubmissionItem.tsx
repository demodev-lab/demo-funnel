"use client";

import { ExternalLink, Clock, ImageIcon, LinkIcon } from "lucide-react";
import { userInfo } from "@/types/user";
import { timeAgo } from "@/utils/date/timeAgo";
import { SubmittedAssignment } from "@/types/assignment";
import { getLinkIcon } from "@/utils/link/linkUtils";
import { useState, useRef } from "react";
import { updateSubmission } from "@/apis/assignments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { validateFileSize } from "@/utils/files";
import { ImagePreview } from "@/components/common/ImagePreview";
import { Input } from "@/components/common/Input";

interface AssignmentSubmissionItemProps {
  userInfo: userInfo;
  submittedAssignment: SubmittedAssignment | null;
  isTodayLecture: boolean;
}

export function AssignmentSubmissionItem({
  userInfo,
  submittedAssignment,
  isTodayLecture,
}: AssignmentSubmissionItemProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(
    submittedAssignment?.assignmentComment || "",
  );
  const [editedUrl, setEditedUrl] = useState(
    submittedAssignment?.assignmentUrl || "",
  );
  const [editedImageUrl, setEditedImageUrl] = useState(
    submittedAssignment?.imageUrl || "",
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    submittedAssignment?.imageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: handleSubmit } = useMutation({
    mutationFn: async (submissionId: number) => {
      const imageFile = editedImageUrl
        ? await fetch(editedImageUrl)
            .then((r) => r.blob())
            .then(
              (blob) => new File([blob], "image.jpg", { type: "image/jpeg" }),
            )
        : undefined;
      return updateSubmission({
        submissionId,
        link: editedUrl,
        text: editedComment,
        imageFile: imageFile || undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "submitted-assignment",
          userInfo.id,
          submittedAssignment.challengeLectureId,
        ],
      });
      setIsEditing(false);
      toast.success("과제가 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message || "과제 수정에 실패했습니다.");
    },
  });

  // TODO: 이미지 업로드, 삭제 로직 유틸 분리 필
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileSize(file)) {
        toast.error("이미지 파일 크기는 3MB를 초과할 수 없습니다.");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setEditedImageUrl(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditedImageUrl("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#1C1F2B]/60 p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5046E4] to-[#8C7DFF] mr-3 flex items-center justify-center text-white font-bold shadow-md">
            {userInfo.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{userInfo.name}</p>
            <div className="flex items-center text-xs text-gray-400 mt-0.5">
              <Clock className="h-3 w-3 mr-1" />
              {timeAgo(submittedAssignment.submittedAt)}
            </div>
          </div>
        </div>
        {isTodayLecture && (
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                setEditedImageUrl(submittedAssignment?.imageUrl || "");
                setImagePreview(submittedAssignment?.imageUrl || null);
              }
            }}
            className="text-sm text-[#8C7DFF] hover:text-[#A99AFF]"
          >
            {isEditing ? "취소" : "수정"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-2 rounded-lg bg-[#1A1D29]/80 border border-gray-700/30 text-sm text-gray-200"
            placeholder="과제 코멘트를 입력하세요"
            rows={3}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <Input
                type="url"
                value={editedUrl}
                onChange={(e) => setEditedUrl(e.target.value)}
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
          <button
            onClick={() => handleSubmit(submittedAssignment.id)}
            className="w-full py-2 bg-[#5046E4] hover:bg-[#4338CA] text-white rounded-lg text-sm font-medium transition-colors"
          >
            저장하기
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {submittedAssignment.assignmentComment && (
            <p className="text-sm text-gray-200 leading-relaxed">
              {submittedAssignment.assignmentComment}
            </p>
          )}
          {submittedAssignment.assignmentUrl && (
            <a
              href={submittedAssignment.assignmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#8C7DFF] hover:text-[#A99AFF] text-sm bg-[#1A1D29]/80 p-2.5 rounded-lg border border-gray-700/30 hover:border-[#5046E4]/30 max-w-full overflow-hidden transition-all duration-300 group"
            >
              <span className="bg-[#5046E4]/10 text-[#8C7DFF] text-xs px-2 py-1 rounded-md font-medium flex-shrink-0">
                {getLinkIcon(submittedAssignment.assignmentUrl)}
              </span>
              <span className="truncate overflow-ellipsis max-w-[calc(100%-80px)]">
                {submittedAssignment.assignmentUrl}
              </span>
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
          {submittedAssignment.imageUrl && (
            <div>
              <img
                src={submittedAssignment.imageUrl}
                alt="과제 이미지"
                className="w-1/5 h-auto rounded-lg border border-gray-700/30"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
