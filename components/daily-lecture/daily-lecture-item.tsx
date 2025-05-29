import Image from "next/image";
import { Lock, Calendar } from "lucide-react";

interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  locked: boolean;
  description: string;
  url: string;
  locked: boolean;
  description: string;
}

interface DailyLectureItemProps {
  video: Lecture;
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
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl border border-gray-700/30 hover:border-gray-600/50 group"
      onClick={() =>
        video.locked
          ? onLockedClick(video.name)
          : onVideoSelect(videoIndex)
      }
    >
      <div className="aspect-video bg-gray-800 relative transform group-hover:-translate-y-1 transition-transform duration-300">
        <Image
          src={`https://img.youtube.com/vi/${video.url.split("watch?v=")[1]?.split(/[&/]/)[0]?.trim() || ""}/hqdefault.jpg`}
          alt={video.name}
          fill
          className={`object-cover transition-all duration-500 ${video.locked ? "opacity-40 blur-[1px]" : "hover:scale-105"}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/1280x720?text=No+Thumbnail";
          }}
        />
        {video.locked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 perspective-0">
            <div className="transform-none will-change-transform flex flex-col items-center justify-center">
              <Lock className="h-10 w-10 text-[#8C7DFF] drop-shadow-md mb-2" />
              <span className="text-xs font-medium text-white/90 bg-[#5046E4]/30 px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Coming Soon
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </div>
      <div className="p-3 bg-[#1C1F2B]/80 backdrop-blur-sm">
        <p className="text-sm font-medium truncate">{video.name}</p>
        <p className="text-xs text-gray-400 mt-1">
          {video.locked ? "잠금 상태" : "재생 가능"}
        </p>
      </div>
    </div>
  );
}
