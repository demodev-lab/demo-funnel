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

interface DailyLectureProps {
  videos: Video[];
  selectedVideoIndex: number;
  isPlaying: boolean;
  isLockedModalOpen: boolean;
  lockedVideoTitle: string;
  onLockedClick: (title: string) => void;
  onVideoSelect: (index: number) => void;
  onLockedModalChange: (open: boolean) => void;
  onTogglePlay: () => void;
}

export default function DailyLecture({
  videos,
  selectedVideoIndex,
  isPlaying,
  isLockedModalOpen,
  lockedVideoTitle,
  onLockedClick,
  onVideoSelect,
  onLockedModalChange,
  onTogglePlay,
}: DailyLectureProps) {
  const mainVideo = {
    title: videos[selectedVideoIndex].title,
    description: videos[selectedVideoIndex].description,
    videoUrl: videos[selectedVideoIndex].videoUrl,
  };

  return (
    <>
      {/* Main Video Player */}
      <LecturePlayer
        title={mainVideo.title}
        description={mainVideo.description}
        videoUrl={mainVideo.videoUrl}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
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
              onVideoSelect={onVideoSelect}
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