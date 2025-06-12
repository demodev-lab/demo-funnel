"use client";

import { FileText, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { AssignmentSubmissionItem } from "./assignment-submission-item";
import { AssignmentSubmissionForm } from "./assignment-submission-form";
import { useQuery } from "@tanstack/react-query";
import { getAssignment, getUserSubmission } from "@/apis/assignments";
import { userInfo } from "@/types/user";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { useEffect, useState } from "react";
import { SubmittedAssignment } from "@/types/assignment";
import { checkIsTodayLecture } from "@/utils/date/serverTime";

interface AssignmentSubmissionSectionProps {
  userInfo: userInfo;
}

export function AssignmentSubmissionSection({
  userInfo,
}: AssignmentSubmissionSectionProps) {
  const { lectureId, challengeLectureId, open_at } = useSelectedLectureStore();
  const [isTodayLecture, setIsTodayLecture] = useState(false);

  useEffect(() => {
    const checkTodayLecture = async () => {
      if (open_at) {
        const isToday = await checkIsTodayLecture(open_at);
        setIsTodayLecture(isToday);
      }
    };
    checkTodayLecture();
  }, [open_at]);

  // 선택한 강의에 대한 과제 정보 가져오기
  const { data: assignmentInfo = [], isLoading: isAssignmentLoading } =
    useQuery({
      queryKey: ["assignment-info", lectureId],
      queryFn: async () => {
        if (!lectureId) return null;
        const data = await getAssignment(lectureId);
        return data[0]; // NOTE: 하나의 강의에 하나의 과제만 존재
      },
      enabled: !!lectureId,
    });

  // 제출된 과제 정보 가져오기
  const { data: submittedAssignment, isLoading: isSubmissionLoading } =
    useQuery<SubmittedAssignment | null>({
      queryKey: ["submitted-assignment", userInfo.id, challengeLectureId],
      queryFn: async () => {
        if (!userInfo.id || !challengeLectureId) return null;
        const data = await getUserSubmission({
          userId: userInfo.id,
          challengeLectureId,
        });
        return data;
      },
      enabled: !!userInfo.id && !!challengeLectureId,
    });

  return (
    <div className="border-t border-gray-700/50 mt-6">
      <div>
        <div className="w-full pt-6 bg-[#1C1F2B]/70 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-3 text-[#8C7DFF]" />
            <span className="font-semibold text-xl">과제 제출</span>
            <div className="group relative ml-2">
              <Info className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block">
                <div className="bg-[#1C1F2B] text-sm text-gray-300 px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                  과제는 해당 강의일 자정까지 제출 가능합니다
                </div>
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1C1F2B] rotate-45"></div>
              </div>
            </div>
          </div>
          {assignmentInfo && (
            <div className="text-sm px-3 py-1 rounded-full bg-[#5046E4]/10 text-[#8C7DFF] font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>과제: {assignmentInfo?.title}</span>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#1A1D29]/30 border-b border-gray-700/50">
          <div className="prose prose-invert max-w-none">
            {isAssignmentLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8C7DFF] border-t-transparent"></div>
              </div>
            ) : assignmentInfo?.contents ? (
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {assignmentInfo.contents}
              </p>
            ) : (
              <p className="text-gray-400 italic">등록된 과제가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 제출 폼 (제출되지 않았고, 과제 내용 있고, 오늘 강의일 때 표시) */}
        {isTodayLecture &&
          assignmentInfo?.contents &&
          !submittedAssignment?.is_submit && (
            <AssignmentSubmissionForm
              userInfo={userInfo}
              challengeLectureId={challengeLectureId}
            />
          )}

        {/* 과제 제출 기간 마감 안내 */}
        {!isTodayLecture &&
          assignmentInfo?.contents &&
          !submittedAssignment?.is_submit && (
            <div className="p-6 bg-[#1A1D29]/30 border-b border-gray-700/50">
              <div className="flex items-center justify-center text-gray-400">
                <AlertCircle className="h-5 w-5 mr-2 text-[#FF6B6B]" />
                <span>과제 제출 기간이 마감되었습니다.</span>
              </div>
            </div>
          )}

        <div className="p-6 bg-[#1A1D29]/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            제출된 과제
          </h3>
          {isSubmissionLoading ? (
            <p className="text-gray-400">제출 정보 로딩 중...</p>
          ) : submittedAssignment && submittedAssignment.is_submit ? (
            <AssignmentSubmissionItem
              userInfo={userInfo}
              submittedAssignment={submittedAssignment}
              isTodayLecture={isTodayLecture}
            />
          ) : (
            <div className="text-gray-400 text-center py-6">
              제출된 과제가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
