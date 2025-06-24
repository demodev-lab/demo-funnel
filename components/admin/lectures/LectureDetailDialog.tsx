"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteLecture } from "@/apis/lectures";
import { LectureWithSequence } from "@/types/lecture";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
import LectureForm from "@/components/admin/lectures/LectureForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";

interface LectureDetailDialogProps {
  lecture: LectureWithSequence | null;
  onClose: () => void;
}

export default function LectureDetailDialog({
  lecture,
  onClose,
}: LectureDetailDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!lecture) return;

    try {
      setIsDeleting(true);
      await deleteLecture(lecture.id);
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-challenges"] });
      toast.success("강의가 삭제되었습니다.");
      onClose();
    } catch (error) {
      toast.error("강의 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
    queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
    queryClient.invalidateQueries({ queryKey: ["lecture-challenges"] });
    onClose();
  };

  return (
    <Dialog open={!!lecture} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{lecture?.name}</DialogTitle>
        </DialogHeader>
        {lecture && (
          <div className="space-y-4">
            <div className="aspect-video">
              {lecture.upload_type === 0 ? (
                getYouTubeEmbedUrl(lecture.url) && (
                  <iframe
                    src={getYouTubeEmbedUrl(lecture.url) || undefined}
                    className="w-full h-full rounded-lg border border-gray-700/30"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <video
                  src={lecture.url}
                  className="w-full h-full rounded-lg border border-gray-700/30"
                  controls
                />
              )}
            </div>
            <div className="pt-4">
              <LectureForm
                isEdit
                initialData={{
                  name: lecture.name,
                  description: lecture.description || "",
                  url: lecture.url || "",
                  assignmentTitle: lecture.assignment_title || "",
                  assignment: lecture.assignment || "",
                }}
                lectureId={lecture.id}
                onSuccess={() => {
                  handleCloseModal();
                  queryClient.invalidateQueries({ queryKey: ["lectures"] });
                }}
                onDelete={handleDelete}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
