"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getLecturesByChallenge, deleteLecture } from "@/apis/lectures";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { AdminLecture, LectureWithSequence } from "@/types/lecture";
import { getYouTubeEmbedUrl } from "@/utils/youtube";
import LectureForm from "@/components/admin/lecture-form";
import LectureCard from "@/components/admin/lectures/lecture-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function LecturesContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] =
    useState<LectureWithSequence | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { selectedChallengeId } = useChallengeStore();

  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures", selectedChallengeId],
    queryFn: () => getLecturesByChallenge(selectedChallengeId || 0),
    enabled: !!selectedChallengeId,
  });

  const handleCloseModal = () => {
    setSelectedLecture(null);
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
    queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
    queryClient.invalidateQueries({ queryKey: ["lecture-challenges"] });
  };

  const handleDelete = async () => {
    if (!selectedLecture) return;

    try {
      setIsDeleting(true);
      await deleteLecture(selectedLecture.id);
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
      queryClient.invalidateQueries({ queryKey: ["lecture-challenges"] });
      toast.success("강의가 삭제되었습니다.");
      setSelectedLecture(null);
      setIsOpen(false);
    } catch (error) {
      toast.error("강의 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          data-testid="spinner"
          className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
        ></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
            강의 관리
          </span>
        </h1>
        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300">
                강의 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 bg-[#252A3C] border-gray-700/30 text-white">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle className="text-white">강의 추가</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto px-6">
                <LectureForm onSuccess={() => setIsOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lectures.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-400">
            등록된 강의가 없습니다.
          </div>
        ) : (
          lectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              lecture={lecture as unknown as AdminLecture}
              onClick={() => setSelectedLecture(lecture)}
            />
          ))
        )}
      </div>

      <Dialog open={!!selectedLecture} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedLecture?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-4">
              <div className="aspect-video">
                {selectedLecture.upload_type === 0 ? (
                  getYouTubeEmbedUrl(selectedLecture.url) && (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedLecture.url) || undefined}
                      className="w-full h-full rounded-lg border border-gray-700/30"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )
                ) : (
                  <video
                    src={selectedLecture.url}
                    className="w-full h-full rounded-lg border border-gray-700/30"
                    controls
                  />
                )}
              </div>
              <div className="pt-4">
                <LectureForm
                  isEdit
                  initialData={{
                    name: selectedLecture.name,
                    description: selectedLecture.description || "",
                    url: selectedLecture.url || "",
                    assignmentTitle: selectedLecture.assignment_title || "",
                    assignment: selectedLecture.assignment || "",
                  }}
                  lectureId={selectedLecture.id}
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
    </>
  );
}
