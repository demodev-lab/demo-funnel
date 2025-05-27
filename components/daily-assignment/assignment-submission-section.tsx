"use client";

import { FileText, Clock, CheckCircle } from "lucide-react";
import { AssignmentSubmissionForm } from './assignment-submission-form';
import { AssignmentSubmissionItem } from './assignment-submission-item';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAssignment, postAssignment, type Submission } from '@/apis/assignment';

export function AssignmentSubmissionSection() {
  const queryClient = useQueryClient();
  const { data: submissions = [] } = useQuery({
    queryKey: ['assignment-submissions'],
    queryFn: getAssignment,
  });

  const { mutate: handleAddSubmission } = useMutation({
    mutationFn: postAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-submissions'] });
    },
  });

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