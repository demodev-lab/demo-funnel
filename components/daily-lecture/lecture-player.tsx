import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVideoThumbnailUrl, getYouTubeEmbedUrl } from "@/utils/youtube";

interface LecturePlayerProps {
  title: string;
  description: string;
  lectureUrl: string;
  upload_type: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function LecturePlayer({
  title,
  description,
  lectureUrl,
  upload_type,
  isPlaying,
  onTogglePlay,
}: LecturePlayerProps) {
  return (
    <>
      <div className="p-4 md:p-6 bg-[#1A1D29]/80 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
      </div>

      <div className="relative aspect-video w-full bg-black">
        {isPlaying ? (
          <div className="relative h-full w-full">
            {upload_type === 0 ? (
              <iframe
                src={`${getYouTubeEmbedUrl(lectureUrl)}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={lectureUrl}
                className="absolute inset-0 w-full h-full"
                autoPlay
                controls
              />
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={onTogglePlay}
              className="absolute bottom-4 right-4 rounded-full h-10 w-10 bg-black/40 backdrop-blur-sm border-[#5046E4] z-10 opacity-0 hover:opacity-100 transition-opacity"
            >
              <Pause className="h-4 w-4 text-white" />
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-black/30" />
              {upload_type === 0 ? (
                getVideoThumbnailUrl(upload_type, lectureUrl) && (
                  <Image
                    src={
                      getVideoThumbnailUrl(upload_type, lectureUrl) || undefined
                    }
                    alt={title}
                    fill
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <video
                  src={lectureUrl}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              )}
            </div>
            <div className="z-10 flex flex-col items-center space-y-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-16 w-16 bg-[#5046E4]/80 hover:bg-[#5046E4] border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                onClick={onTogglePlay}
              >
                <Play className="h-8 w-8 text-white ml-1" />
              </Button>
              <p className="text-white text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                지금 시청하기
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
