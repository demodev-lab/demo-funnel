"use client";

import { FileText, Clock, CheckCircle } from "lucide-react";
import { AssignmentSubmissionForm } from './assignment-submission-form';
import { AssignmentSubmissionItem } from './assignment-submission-item';
import { useState } from 'react';


interface Submission {
  id: number;
  user: string;
  time: string;
  text: string;
  link: string;
  linkType: string;
}

interface AssignmentSubmissionSectionProps {
  submissions: Submission[];
  onSubmit: (submission: {
    name: string;
    email: string;
    link: string;
    text: string;
  }) => void;
}

export function AssignmentSubmissionSection() {
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

  const handleAddSubmission = (submission: {
    name: string;
    email: string;
    link: string;
    text: string;
  }) => {
    let linkType = "링크";
    if (submission.link.includes("github.com")) linkType = "GitHub";
    else if (submission.link.includes("codesandbox.io")) linkType = "CodeSandbox";
    else if (submission.link.includes("codepen.io")) linkType = "CodePen";
    else if (submission.link.includes("replit.com")) linkType = "Replit";
    else if (submission.link.includes("stackblitz.com")) linkType = "StackBlitz";

    const newSubmissionObj = {
      id: submissions.length + 1,
      user: submission.name,
      email: submission.email,
      time: "방금 전",
      text: submission.text,
      link: submission.link,
      linkType: linkType,
    };

    setSubmissions([newSubmissionObj, ...submissions]);
  };
  

  return (
    <div className="border-t border-gray-700/50 mt-6">
        <div>
          <div className="w-full pt-6 bg-[#1C1F2B]/70 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-[#8C7DFF]" />
              <span className="font-semibold text-xl">과제 제출</span>
            </div>
            <div className="text-sm px-3 py-1 rounded-full bg-[#5046E4]/10 text-[#8C7DFF] font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              {/* TODO: 서버에서 fetch한 데이터로 변경 */}
              <span>과제: React 컴포넌트 최적화 구현하기</span>
            </div>
          </div>

        <AssignmentSubmissionForm onSubmit={handleAddSubmission} />
        
        <div className="p-6 bg-[#1A1D29]/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            제출된 과제
          </h3>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <AssignmentSubmissionItem
                key={submission.id}
                {...submission}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 