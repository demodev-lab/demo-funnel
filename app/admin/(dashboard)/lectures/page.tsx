"use client";

import Header from "@/components/admin/header";
import LectureForm from "@/components/admin/lecture-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getLectures, deleteLecture } from "@/apis/lectures";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  upload_type: number;
  assignment_title?: string;
  assignment?: string;
}

const getYouTubeVideoId = (url: string) => {
  try {
    // URL에서 마지막 v= 파라미터를 찾습니다
    const parts = url.split("watch?v=");
    if (parts.length > 1) {
      // 마지막 부분을 가져옵니다
      const lastPart = parts[parts.length - 1];
      // 추가 파라미터가 있다면 제거
      return lastPart.split("/")[0].split("&")[0];
    }
    return null;
  } catch (e) {
    console.error("비디오 ID 추출 실패:", e);
    return null;
  }
};

const getYouTubeThumbnailUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  console.log("URL:", url, "Video ID:", videoId);
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
};

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function LecturesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  // 강의 목록 조회
  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures"],
    queryFn: getLectures,
  });

  const handleCloseModal = () => {
    setSelectedLecture(null);
    queryClient.invalidateQueries({ queryKey: ["lectures"] });
  };

  const handleDelete = async () => {
    if (!selectedLecture) return;

    try {
      setIsDeleting(true);
      await deleteLecture(String(selectedLecture.id));
      toast.success("강의가 삭제되었습니다.");
      handleCloseModal();
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
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
    <div className="space-y-4">
      <Header />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">강의 관리</h1>
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

      {/* 강의 목록 컴포넌트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lectures.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-400">
            등록된 강의가 없습니다.
          </div>
        ) : (
          lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedLecture(lecture)}
            >
              <div className="aspect-video relative">
                {getYouTubeThumbnailUrl(lecture.url) && (
                  <img
                    src={getYouTubeThumbnailUrl(lecture.url) || undefined}
                    alt={lecture.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-white">
                  {lecture.name}
                </h3>
                <p className="text-gray-400 mb-2 line-clamp-2">
                  {lecture.description}
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    업로드 타입:{" "}
                    {lecture.upload_type === 0 ? "유튜브" : "직접 업로드"}
                  </span>
                  <span>
                    생성일: {new Date(lecture.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
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
                {getYouTubeEmbedUrl(selectedLecture.url) && (
                  <iframe
                    src={getYouTubeEmbedUrl(selectedLecture.url) || undefined}
                    className="w-full h-full rounded-lg border border-gray-700/30"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
              <div className="pt-4">
                <LectureForm
                  isEdit
                  initialData={{
                    title: selectedLecture.name,
                    description: selectedLecture.description || "",
                    url: selectedLecture.url || "",
                    assignmentTitle: selectedLecture.assignment_title || "",
                    assignment: selectedLecture.assignment || "",
                  }}
                  lectureId={String(selectedLecture.id)}
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
    </div>
  );
}
