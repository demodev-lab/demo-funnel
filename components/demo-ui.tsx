"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Send,
  FileText,
  LinkIcon,
  ExternalLink,
  Clock,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DailyLectureSection from "./daily-lecture-player/daily-lecture-section";

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
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedVideoTitle, setLockedVideoTitle] = useState("");

  const handleAddSubmission = (e: { preventDefault: () => void; }) => {
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
      <div className="border-t border-gray-700/50 mt-6">
        <div>
          <div className="w-full pt-6 bg-[#1C1F2B]/70 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-[#8C7DFF]" />
              <span className="font-semibold text-xl">과제 제출</span>
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-[#5046E4]/10 text-[#8C7DFF] font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>과제: React 컴포넌트 최적화 구현하기</span>
            </div>
          </div>

          {/* Submission Form */}
          <form
            onSubmit={handleAddSubmission}
            className="p-6 border-b border-gray-700/50 bg-[#1A1D29]/50"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-300 font-medium">이름</label>
                  <Input
                    id="name"
                    value={submitterName}
                    onChange={(e) => setSubmitterName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="bg-[#1C1F2B]/70 border-gray-700/50 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-300 font-medium">이메일</label>
                  <Input
                    id="email"
                    type="email"
                    value={submitterEmail}
                    onChange={(e) => setSubmitterEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                    className="bg-[#1C1F2B]/70 border-gray-700/50 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="link" className="text-sm text-gray-300 font-medium">과제 링크</label>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-gray-400" />
                  <Input
                    id="link"
                    type="url"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    placeholder="과제 링크 (GitHub, CodeSandbox, CodePen 등)"
                    className="bg-[#1C1F2B]/70 border-gray-700/50 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="comment" className="text-sm text-gray-300 font-medium">설명 및 코멘트</label>
                <div className="flex gap-2">
                  <Textarea
                    id="comment"
                    value={newSubmission}
                    onChange={(e) => setNewSubmission(e.target.value)}
                    placeholder="과제에 대한 설명이나 코멘트를 입력하세요."
                    className="bg-[#1C1F2B]/70 border-gray-700/50 min-h-[100px] resize-none flex-1 focus:border-[#5046E4] focus:ring-[#5046E4]/20 transition-all rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white self-end h-12 w-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Submissions List */}
          <div className="p-6 bg-[#1A1D29]/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
              제출된 과제
            </h3>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-[#1C1F2B]/60 p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5046E4] to-[#8C7DFF] mr-3 flex items-center justify-center text-white font-bold shadow-md">
                      {submission.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{submission.user}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        {submission.time}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-3 text-gray-200 leading-relaxed">{submission.text}</p>
                  <a
                    href={submission.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#8C7DFF] hover:text-[#A99AFF] text-sm bg-[#1A1D29]/80 p-2.5 rounded-lg border border-gray-700/30 hover:border-[#5046E4]/30 max-w-full overflow-hidden transition-all duration-300 group"
                  >
                    <span className="bg-[#5046E4]/10 text-[#8C7DFF] text-xs px-2 py-1 rounded-md font-medium flex-shrink-0">
                      {getLinkIcon(submission.linkType)}
                    </span>
                    <span className="truncate overflow-ellipsis max-w-[calc(100%-80px)]">
                      {submission.link}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
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
