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

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  locked: boolean;
  description: string;
}

interface DailyLectureSectionProps {
  videos: Video[];
  isLockedModalOpen: boolean;
  lockedVideoTitle: string;
  onLockedClick: (title: string) => void;
  onLockedModalChange: (open: boolean) => void;
}

export default function DailyLectureSection({
  videos,
  isLockedModalOpen,
  lockedVideoTitle,
  onLockedClick,
  onLockedModalChange,
}: DailyLectureSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const mainVideo = {
    title: videos[selectedVideoIdx].title,
    description: videos[selectedVideoIdx].description,
    videoUrl: videos[selectedVideoIdx].videoUrl,
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index) => {
    setSelectedVideoIdx(index);
    setIsPlaying(false);
  };

  return (
    <>
      {/* Main Video Player */}
      <LecturePlayer
        title={mainVideo.title}
        description={mainVideo.description}
        videoUrl={mainVideo.videoUrl}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">강의 목록</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* TODO: 4개로 고정 후 슬라이더 or 페이지네이션 추가 */}
          {videos.map((video, index) => (
            <DailyLectureItem
              key={video.id}
              video={video}
              onLockedClick={onLockedClick}
              onVideoSelect={handleVideoSelect}
              videoIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Locked Video Modal */}
      <Dialog open={isLockedModalOpen} onOpenChange={onLockedModalChange}>
        <DialogContent className="bg-[#1C1F2B] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">강의 잠금</DialogTitle>
            <DialogDescription className="text-gray-400">
              {lockedVideoTitle} 강의는 아직 잠겨 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              이 강의는 아직 오픈되지 않았습니다. 추후 업데이트를 기다려주세요.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}