"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Play,
  Send,
  FileText,
  LinkIcon,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DailyLectureItem from "./daily-lecture-player/daily-lecture-item";
import LecturePlayer from "./daily-lecture-player/lecture-player";

// TODO: 더미 데이터 제거
const dummyLectures = [
  {
    id: 1,
    title: "피그마 MCP로 디자인 딸깍 가능?",
    description: "피그마 MCP로 디자인 딸깍 가능?",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: false,
  },
  {
    id: 2,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=LzsB2AJI90s",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: false,
  },
  {
    id: 3,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=Q4YV_bWrSkg",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
  {
    id: 4,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
  {
    id: 5,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
];

export function DemoUI() {
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      user: "김코딩",
      time: "2시간 전",
      text: "React 컴포넌트 최적화 과제 제출합니다. useMemo와 useCallback을 활용한 최적화 예제를 구현했습니다.",
      link: "https://github.com/kimcoding/react-optimization-example",
      linkType: "GitHub",
    },
    {
      id: 2,
      user: "이리액트",
      time: "3시간 전",
      text: "메모이제이션을 활용한 렌더링 최적화 과제입니다. 피드백 부탁드립니다!",
      link: "https://codesandbox.io/s/react-optimization-demo-x7y9z2",
      linkType: "CodeSandbox",
    },
    {
      id: 3,
      user: "박자바",
      time: "어제",
      text: "React.memo를 사용한 컴포넌트 최적화 예제입니다. 불필요한 리렌더링을 방지하는 방법을 구현했습니다.",
      link: "https://codepen.io/parkjava/pen/abcdef",
      linkType: "CodePen",
    },
  ]);

  const [newSubmission, setNewSubmission] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedVideoTitle, setLockedVideoTitle] = useState("");

  const mainVideo = {
    title: dummyLectures[selectedVideo].title,
    description: dummyLectures[selectedVideo].description,
    videoUrl: dummyLectures[selectedVideo].videoUrl,
  };

  const subVideos = dummyLectures
    .filter((_, index) => index !== selectedVideo)
    .slice(0, 4)
    .map((lecture) => ({
      id: lecture.id,
      title: lecture.title,
      locked: lecture.locked,
      videoUrl: lecture.videoUrl,
    }));

  const handleAddSubmission = (e) => {
    e.preventDefault();
    if (
      !newSubmission.trim() ||
      !submitterName.trim() ||
      !submitterEmail.trim() ||
      !submissionLink.trim()
    )
      return;

    let linkType = "링크";
    if (submissionLink.includes("github.com")) linkType = "GitHub";
    else if (submissionLink.includes("codesandbox.io"))
      linkType = "CodeSandbox";
    else if (submissionLink.includes("codepen.io")) linkType = "CodePen";
    else if (submissionLink.includes("replit.com")) linkType = "Replit";
    else if (submissionLink.includes("stackblitz.com")) linkType = "StackBlitz";

    const newSubmissionObj = {
      id: submissions.length + 1,
      user: submitterName,
      email: submitterEmail,
      time: "방금 전",
      text: newSubmission,
      link: submissionLink,
      linkType: linkType,
    };

    setSubmissions([newSubmissionObj, ...submissions]);
    setNewSubmission("");
    setSubmissionLink("");
    setSubmitterName("");
    setSubmitterEmail("");
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVideoSelect = (index) => {
    setSelectedVideo(index);
    setIsPlaying(false);
  };

  const handleLockedVideoClick = (videoTitle: string) => {
    setLockedVideoTitle(videoTitle);
    setIsLockedModalOpen(true);
  };

  // Function to get link icon based on link type
  const getLinkIcon = (linkType) => {
    switch (linkType) {
      case "GitHub":
        return "G";
      case "CodeSandbox":
        return "CS";
      case "CodePen":
        return "CP";
      case "Replit":
        return "RP";
      case "StackBlitz":
        return "SB";
      default:
        return "🔗";
    }
  };

  return (
    <div className="bg-[#252A3C] rounded-xl overflow-hidden">
      {/* Main Video Player */}
      <LecturePlayer
        title={mainVideo.title}
        description={mainVideo.description}
        videoUrl={mainVideo.videoUrl}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
      />

      {/* Sub Videos */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">강의 목록</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dummyLectures.map((video, index) => (
            <DailyLectureItem
              key={video.id}
              video={video}
              onLockedClick={handleLockedVideoClick}
              onVideoSelect={handleVideoSelect}
              videoIndex={index}
            />
          ))}
        </div>
      </div>

      {/* Locked Video Modal */}
      <Dialog open={isLockedModalOpen} onOpenChange={setIsLockedModalOpen}>
        <DialogContent className="bg-[#1C1F2B] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">강의 잠금</DialogTitle>
            <DialogDescription className="text-gray-400">
              {lockedVideoTitle} 강의는 아직 잠겨 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-400">
              이 강의는 아직 오픈되지 않았습니다. 추후 업데이트를 기다려주세요.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignment Submission Section */}
      <div className="border-t border-gray-700 mt-4">
        <div>
          <div className="w-full pt-6 bg-[#1C1F2B] border-b border-gray-700 p-2 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium text-xl">과제 제출</span>
            </div>
            <div className="text-xs text-gray-400">
              과제: React 컴포넌트 최적화 구현하기
            </div>
          </div>

          {/* Submission Form */}
          <form
            onSubmit={handleAddSubmission}
            className="p-4 border-b border-gray-700"
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={submitterName}
                  onChange={(e) => setSubmitterName(e.target.value)}
                  placeholder="이름"
                  className="bg-[#1C1F2B] border-gray-700"
                  required
                />
                <Input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="이메일"
                  className="bg-[#1C1F2B] border-gray-700"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                <Input
                  type="url"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  placeholder="과제 링크 (GitHub, CodeSandbox, CodePen 등)"
                  className="bg-[#1C1F2B] border-gray-700"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={newSubmission}
                  onChange={(e) => setNewSubmission(e.target.value)}
                  placeholder="과제에 대한 설명이나 코멘트를 입력하세요."
                  className="bg-[#1C1F2B] border-gray-700 min-h-[80px] resize-none flex-1"
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#5046E4] hover:bg-[#DCD9FF] text-[#1C1F2B] self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Submissions List */}
          <div className="p-4">
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-[#1C1F2B] p-3 rounded-lg"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center text-[#5046E4] font-medium">
                      {submission.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{submission.user}</p>
                      <p className="text-xs text-gray-400">{submission.time}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{submission.text}</p>
                  <a
                    href={submission.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#5046E4] hover:underline text-sm bg-[#1A1D29] p-2 rounded border border-gray-700 max-w-full overflow-hidden"
                  >
                    <span className="bg-[#000000]/20 text-[#5046E4] text-xs px-2 py-1 rounded font-medium flex-shrink-0">
                      {getLinkIcon(submission.linkType)}
                    </span>
                    <span className="truncate overflow-ellipsis max-w-[calc(100%-60px)]">
                      {submission.link}
                    </span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0 ml-auto" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
