import Image from "next/image";
import { Lock } from "lucide-react";

interface Video {
  id: number;
  title: string;
  videoUrl: string;
  locked: boolean;
}

interface DailyLectureItemProps {
  video: Video;
  onLockedClick: (title: string) => void;
  onVideoSelect: (index: number) => void;
  videoIndex: number;
}

export default function DailyLectureItem({
  video,
  onLockedClick,
  onVideoSelect,
  videoIndex,
}: DailyLectureItemProps) {
  return (
    <div
      key={video.id}
      className="relative rounded-lg overflow-hidden cursor-pointer"
      onClick={() =>
        video.locked
          ? onLockedClick(video.title)
          : onVideoSelect(videoIndex)
      }
    >
      <div className="aspect-video bg-gray-800 relative">
        <Image
          src={`https://img.youtube.com/vi/${
            video.videoUrl.split("v=")[1]
          }/maxresdefault.jpg`}
          alt={video.title}
          fill
          className={`object-cover ${
            video.locked ? "opacity-50 blur-[2px]" : ""
          }`}
        />
        {video.locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Lock className="h-8 w-8 text-[#5046E4]" />
          </div>
        )}
      </div>
      <div className="p-2 bg-[#1C1F2B]">
        <p className="text-sm font-medium truncate">{video.title}</p>
      </div>
    </div>
  );
}