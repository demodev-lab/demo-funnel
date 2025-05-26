import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LecturePlayerProps {
  title: string;
  description: string;
  videoUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function LecturePlayer({
  title,
  description,
  videoUrl,
  isPlaying,
  onTogglePlay,
}: LecturePlayerProps) {
  return (
    <>
      <h2 className="text-lg md:text-xl font-bold m-4">{title}</h2>
      <div className="relative aspect-video w-full bg-black">
        
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoUrl.split("v=")[1]}?autoplay=1`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={`https://img.youtube.com/vi/${videoUrl.split("v=")[1]}/maxresdefault.jpg`}
              alt={title}
              fill
              className="object-cover"
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-16 w-16 bg-[#000000]/20 border-[#5046E4] z-10"
              onClick={onTogglePlay}
            >
              <Play className="h-8 w-8 text-[#5046E4]" />
            </Button>
          </div>
        )}
      </div>
      <div className="bg-black p-4">
        <p className="text-sm font-medium">오늘의 강의: {title}</p>
      </div>
    </>
  );
}