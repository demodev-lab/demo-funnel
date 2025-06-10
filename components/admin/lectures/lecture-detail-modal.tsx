import { AdminLecture } from "@/types/lecture";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LectureForm from "@/components/admin/lecture-form";

interface LectureDetailModalProps {
  lecture: AdminLecture | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  onSuccess: () => void;
}

export default function LectureDetailModal({
  lecture,
  isOpen,
  onClose,
  onDelete,
  isDeleting,
  onSuccess,
}: LectureDetailModalProps) {
  if (!lecture) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#252A3C] border-gray-700/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">{lecture.name}</DialogTitle>
        </DialogHeader>
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
              onSuccess={onSuccess}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
