"use client";

import { useState } from "react";
import DailyLectureSection from "./daily-lecture-player/daily-lecture-section";
import { AssignmentSubmissionSection } from "./daily-assignment/assignment-submission-section";

export function DemoUI() {
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedVideoTitle, setLockedVideoTitle] = useState("");

  const handleLockedVideoClick = (videoTitle: string) => {
    setLockedVideoTitle(videoTitle);
    setIsLockedModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#252A3C] to-[#2A2F45] rounded-xl overflow-hidden shadow-lg border border-gray-700/50">
      {/* Lecture Section */}
      <div className="transition-all duration-300 hover:brightness-105">
        <DailyLectureSection
          isLockedModalOpen={isLockedModalOpen}
          lockedVideoTitle={lockedVideoTitle}
          onLockedClick={handleLockedVideoClick}
          onLockedModalChange={setIsLockedModalOpen}
        />
      </div>

      {/* Assignment Submission Section */}
      <AssignmentSubmissionSection />
    </div>
  );
}
