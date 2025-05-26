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
    <div className="bg-[#252A3C] rounded-xl overflow-hidden">
      {/* Lecture Section */}
      <DailyLectureSection
        isLockedModalOpen={isLockedModalOpen}
        lockedVideoTitle={lockedVideoTitle}
        onLockedClick={handleLockedVideoClick}
        onLockedModalChange={setIsLockedModalOpen}
      />

      {/* Assignment Submission Section */}
      <AssignmentSubmissionSection />
    </div>
  );
}
