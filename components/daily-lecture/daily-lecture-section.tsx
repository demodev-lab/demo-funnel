import { useState } from 'react';
import DailyLectureItem from "./daily-lecture-item";
import LecturePlayer from "./lecture-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlayCircle, Lock, Calendar } from "lucide-react";
import { Lecture } from '@/types/lecture';

interface DailyLectureSectionProps {
  lectures: Lecture[];
}

export default function DailyLectureSection({
  lectures,
}: DailyLectureSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedVideoTitle, setLockedVideoTitle] = useState("");

  const mainVideo = lectures[selectedVideoIdx] ? {
    title: lectures[selectedVideoIdx].name,
    description: lectures[selectedVideoIdx].description,
    videoUrl: lectures[selectedVideoIdx].url,
  } : null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIdx(index);
    setIsPlaying(false);
  };

  const handleLockedClick = (title: string) => {
    setLockedVideoTitle(title);
    setIsLockedModalOpen(true);
  };

  if (!mainVideo) return null;

  return (
    <>
      {/* Main Video Player */}
      <div className="relative">
        <LecturePlayer
          title={mainVideo.title}
          description={mainVideo.description}
          videoUrl={mainVideo.videoUrl}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <PlayCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            <span>강의 목록</span>
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>매일 업데이트</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {lectures.map((lecture, index) => (
            <div key={lecture.id} className="group">
              <DailyLectureItem
                video={{
                  id: lecture.id,
                  name: lecture.name,
                  description: lecture.description,
                  url: lecture.url,
                  locked: new Date(lecture.open_at) > new Date()
                }}
                onLockedClick={handleLockedClick}
                onVideoSelect={handleVideoSelect}
                videoIndex={index}
              />
              <div className={`mt-2 h-1 bg-gradient-to-r from-[#5046E4] to-[#8C7DFF] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${index === selectedVideoIdx ? 'scale-x-100' : ''}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Locked Video Modal */}
      <Dialog open={isLockedModalOpen} onOpenChange={setIsLockedModalOpen}>
        <DialogContent className="bg-gradient-to-b from-[#1A1D29] to-[#252A3C] border-gray-700/50 text-white rounded-lg shadow-xl">
          <DialogHeader className="pb-4 border-b border-gray-700/30">
            <DialogTitle className="text-xl font-bold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-[#8C7DFF]" />
              <span>강의 잠금</span>
            </DialogTitle>
            <DialogDescription className="text-gray-300 mt-2">
              {lockedVideoTitle} 강의는 아직 잠겨 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              이 강의는 아직 오픈되지 않았습니다. 매일 새로운 강의가 공개됩니다.
            </p>
            <div className="p-3 bg-[#5046E4]/10 rounded-lg border border-[#5046E4]/20">
              <p className="text-sm flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-[#8C7DFF]" />
                <span>추후 업데이트를 기다려주세요. 완료된 과제를 먼저 제출해보세요!</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
