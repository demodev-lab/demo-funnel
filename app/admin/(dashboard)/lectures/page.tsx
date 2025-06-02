"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getLecturesByChallenge, deleteLecture } from "@/apis/lectures";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { Lecture } from "@/types/lecture";
import LectureCard from "@/components/admin/lectures/lecture-card";
import LectureDetailModal from "@/components/admin/lectures/lecture-detail-modal";
import LectureForm from "@/components/admin/lecture-form";

export default function LecturesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
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
      console.error("강의 삭제 실패:", error);
      toast.error("강의 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
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
              lecture={lecture}
              onClick={() => setSelectedLecture(lecture)}
            />
          ))
        )}
      </div>

      <LectureDetailModal
        lecture={selectedLecture}
        isOpen={!!selectedLecture}
        onClose={handleCloseModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onSuccess={handleCloseModal}
      />
    </>
  );
}
