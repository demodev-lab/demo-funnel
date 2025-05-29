"use client";

import { FileText, Clock, CheckCircle } from "lucide-react";
import { AssignmentSubmissionItem } from './assignment-submission-item';
import { AssignmentSubmissionForm } from './assignment-submission-form'
import { useQuery } from '@tanstack/react-query';
import { getAssignment } from '@/apis/assignments';
import { userInfo } from '@/types/user';

interface AssignmentSubmissionSectionProps {
  userInfo: userInfo;
  lectureId: number;
  challengeLectureId: number;
}

export function AssignmentSubmissionSection({
  userInfo,
  lectureId,
  challengeLectureId,
}: AssignmentSubmissionSectionProps) {
  const { data: assignmentInfo = [] } = useQuery({
    queryKey: ['assignment-submissions', lectureId],
    queryFn: async () => {
      const data = await getAssignment(lectureId);
      return data;
    },
  });

  const currentAssignment = assignmentInfo[0]; // 첫 번째 과제를 현재 과제로 사용

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
              <span>과제: {currentAssignment?.title}</span>
            </div>
          </div>

        <AssignmentSubmissionForm userInfo={userInfo} challengeLectureId={challengeLectureId} />
        
        <div className="p-6 bg-[#1A1D29]/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            제출된 과제
          </h3>
          <div className="space-y-4">
            {/* TODO: 제출된 과제 목록으로 수정 */}
            {/* {assignments?.map((submission) => (
              <AssignmentSubmissionItem
                key={submission.id}
                id={submission.id}
                user="사용자"
                time={new Date(submission.submitted_at).toLocaleString()}
                text={submission.assignment_comment}
                link={submission.assignment_url}
                linkType="GitHub"
              />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
} 