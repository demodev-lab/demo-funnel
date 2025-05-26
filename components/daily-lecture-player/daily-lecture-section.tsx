import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
  isLockedModalOpen: boolean;
  lockedVideoTitle: string;
  onLockedClick: (title: string) => void;
  onLockedModalChange: (open: boolean) => void;
}

// TODO: api 경로 수정 및 분리
const fetchLectures = async () => {
  const { data } = await axios.get('/api/test');
  return data.lectures;
};

export default function DailyLectureSection({
  isLockedModalOpen,
  lockedVideoTitle,
  onLockedClick,
  onLockedModalChange,
}: DailyLectureSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);

  const { data: videos = [] } = useQuery({
    queryKey: ['lectures'],
    queryFn: fetchLectures,
  });

  const mainVideo = videos[selectedVideoIdx] ? {
    title: videos[selectedVideoIdx].title,
    description: videos[selectedVideoIdx].description,
    videoUrl: videos[selectedVideoIdx].videoUrl,
  } : null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIdx(index);
    setIsPlaying(false);
  };

  if (!mainVideo) return null;

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
          {videos.map((video: Video, index: number) => (
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