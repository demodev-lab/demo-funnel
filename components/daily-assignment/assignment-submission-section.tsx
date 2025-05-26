"use client";

import { FileText } from "lucide-react";
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
    <div className="border-t border-gray-700 mt-4">
      <div>
        <div className="w-full pt-6 bg-[#1C1F2B] border-b border-gray-700 p-2 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium text-xl">과제 제출</span>
          </div>
          <div className="text-xs text-gray-400">
            {/* TODO: 서버에서 fetch한 데이터로 변경 */}
            과제: React 컴포넌트 최적화 구현하기
          </div>
        </div>

        <AssignmentSubmissionForm onSubmit={handleAddSubmission} />
        
        <div className="p-4">
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