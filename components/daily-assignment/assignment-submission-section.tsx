"use client";

import { FileText, Clock, CheckCircle } from "lucide-react";
import { AssignmentSubmissionItem } from './assignment-submission-item';
import { AssignmentSubmissionForm } from './assignment-submission-form'
import { useQuery } from '@tanstack/react-query';
import { getAssignment } from '@/apis/assignments';
import { userInfo } from '@/types/user';
import axios from 'axios';

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
    queryKey: ['assignment-info', lectureId],
    queryFn: async () => {
      const data = await getAssignment(lectureId);
      return data;
    },
  });

  const { data: submittedAssignments } = useQuery({
    queryKey: ['submitted-assignments'],
    queryFn: async () => {
      // TODO: api 로직 완성 후 함수 수정
      const { data } = await axios.get('/api/classroom/assignment', {
        headers: {
          'Authorization': 'Bearer mock-token'
        }
      });
      return data.submissions;
    },
  });

  // TODO: 오픈된 강의에 해당하는 과제 선택
  const currentAssignment = assignmentInfo[0]; // 첫 번째 과제를 현재 과제로 사용

  return (
    <div className="border-t border-gray-700/50 mt-6">
        <div>
          <div className="w-full pt-6 bg-[#1C1F2B]/70 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-[#8C7DFF]" />
              <span className="font-semibold text-xl">과제 제출</span>
            </div>
            {currentAssignment && 
            <div className="text-sm px-3 py-1 rounded-full bg-[#5046E4]/10 text-[#8C7DFF] font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>과제: {currentAssignment?.title}</span>
            </div>}
          </div>

          <div className="p-6 bg-[#1A1D29]/30 border-b border-gray-700/50">
            <div className="prose prose-invert max-w-none">
              {currentAssignment?.contents ? (
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {currentAssignment.contents}
                </p>
              ) : (
                <p className="text-gray-400 italic">등록된 과제가 없습니다.</p>
              )}
            </div>
          </div>

          {currentAssignment?.contents && (
            <AssignmentSubmissionForm userInfo={userInfo} challengeLectureId={challengeLectureId} />
          )}
        
          <div className="p-6 bg-[#1A1D29]/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
              제출된 과제
            </h3>
            <div className="space-y-4">
              {submittedAssignments?.length > 0 ? (
                submittedAssignments.map((submission) => (
                  <AssignmentSubmissionItem
                    key={submission.id}
                    id={submission.id}
                    user={submission.user}
                    time={submission.time}
                    text={submission.text}
                    link={submission.link}
                    linkType={submission.linkType}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  아직 제출된 과제가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
} 