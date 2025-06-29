"use client";

import { useState, useEffect } from "react";
import DailyLectureItem from "./DailyLectureItem";
import MainLecture from "./MainLecture";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/dialog";
import { PlayCircle, Lock, Calendar, Sparkles } from "lucide-react";
import { LectureWithSequence } from "@/types/lecture";

interface DailyLectureSectionProps {
  lectures: LectureWithSequence[];
  initialLecture?: LectureWithSequence;
}

export default function DailyLectureSection({
  lectures,
  initialLecture,
}: DailyLectureSectionProps) {
  const [selectedLecture, setSelectedLecture] = useState<LectureWithSequence | undefined>(
    initialLecture
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedLecture && lectures.length > 0) {
      setSelectedLecture(lectures[0]);
    }
  }, [lectures, selectedLecture]);

  const handleLectureSelect = (lecture: LectureWithSequence) => {
    if (lecture.isLocked) {
      setIsLockedModalOpen(true);
    } else {
      setSelectedLecture(lecture);
      setIsPlaying(false);
    }
  };

  const openLecturesCount = lectures.filter(l => !l.isLocked).length;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

 

  const handleLockedClick = () => {
    setIsLockedModalOpen(true);
  };


  const handleVideoSelect = (lecture: LectureWithSequence) => {
    if (lecture.isLocked) {
      setIsLockedModalOpen(true);
    } else {
      setSelectedLecture(lecture);
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Main Video Player */}
      <div className="relative">
        {selectedLecture ? (
          selectedLecture.isLocked ? (
            <div className="aspect-video bg-[#1A1D29] flex items-center justify-center relative overflow-hidden">
              {/* 배경 효과 */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5046E4]/10 to-[#8C7DFF]/10" />
              <div className="text-center text-gray-400 relative z-10">
                <Lock className="h-12 w-12 mx-auto mb-4 text-gray-600 animate-pulse" />
                <p className="text-lg font-medium">
                  아직 오픈되지 않은 강의입니다
                </p>
                <p className="text-sm mt-2 text-gray-500">
                  {new Date(selectedLecture.open_at).toLocaleDateString(
                    "ko-KR",
                    {
                      month: "long",
                      day: "numeric",
                    },
                  )}
                  에 공개 예정
                </p>
              </div>
            </div>
          ) : (
            <MainLecture
              title={selectedLecture.name}
              description={selectedLecture.description}
              lectureUrl={selectedLecture.url}
              upload_type={selectedLecture.upload_type}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          )
        ) : (
          <div className="aspect-video bg-[#1A1D29] flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium">강의를 선택해주세요</p>
              <p className="text-sm mt-2 text-gray-500">
                총 {lectures.length}개의 강의가 준비되어 있습니다
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center">
            <PlayCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            <span>강의 목록</span>
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({openLecturesCount}/{lectures.length} 공개됨)
            </span>
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>매일 업데이트</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {lectures.length > 0 ? (
          lectures.map((lecture, index) => (
            <div key={lecture.id} className="group">
              <DailyLectureItem
                dailyLecture={lecture}
                isSelected={selectedLecture?.id === lecture.id}
                onSelect={() => handleVideoSelect(lecture)} 
              />
              <div
                className={`mt-2 h-1 bg-gradient-to-r from-[#5046E4] to-[#8C7DFF] rounded-full transform transition-transform duration-300 ${
                  selectedLecture?.id === lecture.id
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-gray-600" />
              <p>아직 강의가 준비되지 않았습니다</p>
              <p className="text-sm mt-1 text-gray-500">
                곧 업데이트 예정입니다
              </p>
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
                <Calendar className="h-4 w-4 mr-2 mt-0.5 text-[#8C7DFF] flex-shrink-0" />
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
