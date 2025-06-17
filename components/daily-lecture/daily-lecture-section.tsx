"use client";

import { useState, useEffect } from "react";
import DailyLectureItem from "./daily-lecture-item";
import LecturePlayer from "./lecture-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlayCircle, Lock, Calendar } from "lucide-react";
import { Lecture, LectureWithSequence } from "@/types/lecture";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { isLectureOpen } from "@/utils/date/serverTime";

type UnifiedLecture = Lecture | LectureWithSequence;

interface DailyLectureSectionProps {
  lectures: UnifiedLecture[];
  isActiveChallenge: boolean;
}

export default function DailyLectureSection({
  lectures,
  isActiveChallenge,
}: DailyLectureSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedVideoTitle, setLockedVideoTitle] = useState("");
  const [mainLecture, setMainLecture] = useState<{
    title: string;
    description: string;
    lectureUrl: string;
    isLocked: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { lectureId } = useSelectedLectureStore();

  useEffect(() => {
    if (lectureId && lectures.length > 0) {
      const index = lectures.findIndex((lecture) => lecture.id === lectureId);
      if (index !== -1) {
        setSelectedVideoIdx(index);
      }
    }
  }, [lectureId]);

  useEffect(() => {
    const updateMainLecture = async () => {
      setIsLoading(true);
      try {
        if (lectures[selectedVideoIdx]) {
          const isLocked =
            isActiveChallenge && "open_at" in lectures[selectedVideoIdx]
              ? !(await isLectureOpen(lectures[selectedVideoIdx].open_at))
              : false;
          setMainLecture({
            title: lectures[selectedVideoIdx].name,
            description: lectures[selectedVideoIdx].description,
            lectureUrl: lectures[selectedVideoIdx].url,
            isLocked,
          });
        } else {
          setMainLecture(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    updateMainLecture();
  }, [lectures, selectedVideoIdx, isActiveChallenge]);

  const onSelectedLecture = useSelectedLectureStore(
    (state) => state.setSelectedLecture,
  );

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index: number) => {
    setSelectedVideoIdx(index);
    setIsPlaying(false);
  };

  const handleLockedClick = (title: string) => {
    setLockedVideoTitle(title);
    setIsLockedModalOpen(true);
  };

  return (
    <>
      {/* Main Video Player */}
      <div className="relative">
        {mainLecture ? (
          mainLecture.isLocked ? (
            <div className="aspect-video bg-[#1A1D29] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Lock className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <p>아직 오픈되지 않은 강의입니다.</p>
                <p className="text-sm mt-2">매일 새로운 강의가 공개됩니다.</p>
              </div>
            </div>
          ) : (
            <LecturePlayer
              title={mainLecture.title}
              description={mainLecture.description}
              lectureUrl={mainLecture.lectureUrl}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
            />
          )
        ) : isLoading ? (
          <div className="aspect-video bg-[#1A1D29] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8C7DFF] border-t-transparent mx-auto mb-4"></div>
              <p>강의 정보를 불러오는 중...</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-[#1A1D29] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <PlayCircle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p>아직 강의가 없습니다.</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <PlayCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            <span>강의 목록</span>
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>매일 업데이트</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {lectures.length > 0 ? (
            lectures.map((lecture, index) => (
              <div
                key={lecture.id}
                className="group"
                onClick={() => onSelectedLecture(lecture as LectureWithSequence)}
              >
                <DailyLectureItem
                  dailyLecture={lecture}
                  onLockedClick={handleLockedClick}
                  onVideoSelect={handleVideoSelect}
                  videoIndex={index}
                  isActiveChallenge={isActiveChallenge}
                />
                <div
                  className={`mt-2 h-1 bg-gradient-to-r from-[#5046E4] to-[#8C7DFF] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    index === selectedVideoIdx ? "scale-x-100" : ""
                  }`}
                ></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-400">
              아직 강의가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Locked Video Modal */}
      <Dialog open={isLockedModalOpen} onOpenChange={setIsLockedModalOpen}>
        <DialogContent className="bg-[#252A3C] border border-gray-700/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-[#8C7DFF]" />
              <span>잠긴 강의</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              강의는 매일 자정에 순차적으로 열립니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-sm text-gray-300 leading-relaxed">
              이 강의는 아직 오픈되지 않았습니다. 매일 새로운 강의가 공개됩니다.
            </p>
            <div className="p-3 bg-[#5046E4]/10 rounded-lg border border-[#5046E4]/20">
              <p className="text-sm flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-[#8C7DFF]" />
                <span>
                  추후 업데이트를 기다려주세요. 완료된 과제를 먼저 제출해보세요!
                </span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
