import { useMemo, useState } from "react";
import Image from "next/image";
import { Lock, Calendar, PlayCircle } from "lucide-react";
import { getVideoThumbnailUrl } from "@/utils/youtube";
import { LectureWithSequence } from "@/types/lecture";

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
  // 이미지 로딩 상태 관리
  const [imageLoaded, setImageLoaded] = useState(false);

  // apis/lectures.ts 에 추가한 isLocked 바로 사용
  const { isLocked } = dailyLecture;

  const thumbnailUrl = useMemo(
    () =>
      dailyLecture.upload_type === 0
        ? getVideoThumbnailUrl(dailyLecture.upload_type, dailyLecture.url)
        : null,
    [dailyLecture.upload_type, dailyLecture.url],
  );

  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl border border-gray-700/30 hover:border-gray-600/50 group"
      onClick={() =>
        isLocked ? onLockedClick(dailyLecture.name) : onVideoSelect(videoIndex)
      }
    >
      <div className="aspect-video bg-gray-800 relative transform group-hover:-translate-y-1 transition-transform duration-300">
        {dailyLecture.upload_type === 0 && thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={dailyLecture.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={videoIndex < 8}
            loading={videoIndex < 8 ? "eager" : "lazy"}
            quality={videoIndex < 4 ? 90 : 75}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
            className={`object-cover transition-all duration-500 ${
              isLocked ? "opacity-40 blur-[1px]" : "group-hover:scale-105"
            } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          dailyLecture.upload_type !== 0 && (
            <video
              src={dailyLecture.url}
              className={`w-full h-full object-cover ${
                isLocked ? "opacity-40 blur-[1px]" : ""
              }`}
              preload="metadata"
              muted
              playsInline
              controlsList="nodownload nofullscreen noremoteplayback"
            />
          )
        )}

        {isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <Lock className="h-10 w-10 text-[#8C7DFF] drop-shadow-md mb-2 animate-pulse" />
            <span className="text-xs font-medium text-white/90 bg-[#5046E4]/30 px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(dailyLecture.open_at).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}{" "}
              오픈
            </span>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </div>

      <div className="p-3 bg-[#1C1F2B]/80 backdrop-blur-sm">
        <p className="text-sm font-medium truncate">{dailyLecture.name}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          {isLocked ? (
            <>
              <Lock className="h-3 w-3" />
              <span>잠금 상태</span>
            </>
          ) : (
            <>
              <PlayCircle className="h-3 w-3" />
              <span>재생 가능</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
