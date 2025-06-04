import { Lecture } from "@/types/lecture";
import { getVideoThumbnailUrl } from "@/utils/youtube";

interface LectureCardProps {
  lecture: Lecture;
  onClick: () => void;
}

export default function LectureCard({ lecture, onClick }: LectureCardProps) {
  return (
    <div
      className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-video relative">
        {lecture.upload_type === 0 ? (
          getVideoThumbnailUrl(lecture) && (
            <img
              src={getVideoThumbnailUrl(lecture) || undefined}
              alt={lecture.name}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <video
            src={lecture.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
          />
        )}
        <div className="absolute top-2 left-2 bg-[#5046E4] text-white px-2 py-1 rounded-md text-sm font-medium">
          {lecture.sequence}번째 강의
        </div>
      </div>
      <div className="p-4 flex flex-col h-[180px]">
        <h3 className="font-semibold text-lg text-white line-clamp-1">
          {lecture.name}
        </h3>
        <p className="text-gray-400 mt-2 flex-1 line-clamp-3">
          {lecture.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mt-2 pt-2 border-t border-gray-700/30">
          <span>
            업로드 타입: {lecture.upload_type === 0 ? "유튜브" : "직접 업로드"}
          </span>
          <span>
            생성일: {new Date(lecture.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
