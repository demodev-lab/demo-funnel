"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLecturesByChallenge } from "@/apis/lectures";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { LectureWithSequence } from "@/types/lecture";
import LectureCardList from "@/components/admin/lectures/LectureCardList";
import LectureDialog from "@/components/admin/lectures/LectureDialog";

export default function LecturesContainer() {
  const [selectedLecture, setSelectedLecture] =
    useState<LectureWithSequence | null>(null);
  const { selectedChallengeId } = useChallengeStore();

  const { data: lectures = [], isLoading } = useQuery({
    queryKey: ["lectures", selectedChallengeId],
    queryFn: () => getLecturesByChallenge(selectedChallengeId || 0),
    enabled: !!selectedChallengeId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          data-testid="spinner"
          className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"
        ></div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LectureCardList
          lectures={lectures}
          onLectureClick={setSelectedLecture}
        />
      </div>

      <LectureDialog
        open={!!selectedLecture}
        onOpenChange={(open) => !open && setSelectedLecture(null)}
        title={selectedLecture?.name || ""}
        maxWidth="lg"
        isEdit={true}
        lecture={selectedLecture}
      />
    </>
  );
}
