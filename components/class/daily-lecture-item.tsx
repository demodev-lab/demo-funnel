import { useEffect, useState } from "react";
import Image from "next/image";
import { Lock, Calendar } from "lucide-react";
import { getVideoThumbnailUrl } from "@/utils/youtube";
import { LectureWithSequence } from "@/types/lecture";
import { isLectureOpen } from "@/utils/date/serverTime";

interface DailyLectureItemProps {
  dailyLecture: LectureWithSequence;
  onLockedClick: (title: string) => void;
  onVideoSelect: (index: number) => void;
  videoIndex: number;
}

export default function DailyLectureItem({
  dailyLecture,
  onLockedClick,
  onVideoSelect,
  videoIndex,
}: DailyLectureItemProps) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const checkLockStatus = async () => {
      if ("open_at" in dailyLecture) {
        const locked = !(await isLectureOpen(dailyLecture.open_at));
        setIsLocked(locked);
      } else {
        setIsLocked(false);
      }
    };
    checkLockStatus();
  }, [dailyLecture]);

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl border border-gray-700/30 hover:border-gray-600/50 group"
      onClick={() =>
        isLocked ? onLockedClick(dailyLecture.name) : onVideoSelect(videoIndex)
      }
    >
      <div className="aspect-video bg-gray-800 relative transform group-hover:-translate-y-1 transition-transform duration-300">
        {dailyLecture.upload_type === 0 ? (
          // YouTube 동영상인 경우 Image 태그 사용
          <Image
            src={
              getVideoThumbnailUrl(
                dailyLecture.upload_type,
                dailyLecture.url,
              ) || undefined
            }
            alt={dailyLecture.name}
            fill
            priority={videoIndex === 0}
            className={`object-cover transition-all duration-500 ${
              isLocked ? "opacity-40 blur-[1px]" : "hover:scale-105"
            }`}
          />
        ) : (
          // 직접 업로드 동영상인 경우 Video 태그 사용
          <video
            src={dailyLecture.url}
            className={`w-full h-full object-cover ${
              isLocked ? "opacity-40 blur-[1px]" : ""
            }`}
            preload="metadata"
            muted
            playsInline
            controlsList="no-controls"
          />
        )}

        {isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 perspective-0">
            <div className="transform-none will-change-transform flex flex-col items-center justify-center">
              <Lock className="h-10 w-10 text-[#8C7DFF] drop-shadow-md mb-2" />
              <span className="text-xs font-medium text-white/90 bg-[#5046E4]/30 px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {"open_at" in dailyLecture ? dailyLecture.open_at : ""}
              </span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </div>
      <div className="p-3 bg-[#1C1F2B]/80 backdrop-blur-sm">
        <p className="text-sm font-medium truncate">{dailyLecture.name}</p>
        <p className="text-xs text-gray-400 mt-1">
          {isLocked ? "잠금 상태" : "재생 가능"}
        </p>
      </div>
    </div>
  );
}
