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
import { getLectures } from "@/apis/lectures";
import { useQuery } from "@tanstack/react-query";

interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  upload_type: number;
}

const getYouTubeEmbedUrl = (url: string) => {
  const videoId = url.split("v=")[1];
  return `https://www.youtube.com/embed/${videoId}`;
};

const getYouTubeThumbnailUrl = (url: string) => {
  const videoId = url.split("v=")[1];
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

export default function LecturesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // 강의 목록 조회
  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures"],
    queryFn: getLectures,
  });

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
                <img
                  src={getYouTubeThumbnailUrl(lecture.url)}
                  alt={lecture.name}
                  className="w-full h-full object-cover"
                />
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

      <Dialog
        open={!!selectedLecture}
        onOpenChange={() => setSelectedLecture(null)}
      >
        <DialogContent className="sm:max-w-[800px] bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedLecture?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <div className="space-y-4">
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(selectedLecture.url)}
                  className="w-full h-full rounded-lg border border-gray-700/30"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="space-y-2">
                <p className="text-gray-400">{selectedLecture.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    업로드 타입:{" "}
                    {selectedLecture.upload_type === 0
                      ? "유튜브"
                      : "직접 업로드"}
                  </span>
                  <span>
                    생성일:{" "}
                    {new Date(selectedLecture.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
