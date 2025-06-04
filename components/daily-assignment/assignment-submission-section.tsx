"use client";

import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AssignmentSubmissionItem } from "./assignment-submission-item";
import { AssignmentSubmissionForm } from "./assignment-submission-form";
import { useQuery } from "@tanstack/react-query";
import { getAssignment, getUserSubmission } from "@/apis/assignments";
import { userInfo } from "@/types/user";
import axios from "axios";
import { useSelectedLectureStore } from "@/lib/store/useSelectedLectureStore";
import { useEffect, useState } from "react";

interface AssignmentSubmissionSectionProps {
  userInfo: userInfo;
}

export function AssignmentSubmissionSection({
  userInfo,
}: AssignmentSubmissionSectionProps) {
  const { lectureId, challengeLectureId, open_at } = useSelectedLectureStore();
  const [serverTime, setServerTime] = useState<string>("");
  const [timeError, setTimeError] = useState<string>("");

  // 서버 시간 가져오기
  useEffect(() => {
    const getServerTime = async () => {
      try {
        const { data } = await axios.get("/api/server-time");
        setServerTime(data.serverTime);
        setTimeError("");
      } catch (error) {
        setTimeError(
          "일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 지속되면 문의해주세요.",
        );
      }
    };
    getServerTime();
  }, []);

  // 선택한 강의에 대한 과제 정보 가져오기
  const { data: assignmentInfo = [] } = useQuery({
    queryKey: ["assignment-info", lectureId],
    queryFn: async () => {
      if (!lectureId) return null;
      const data = await getAssignment(lectureId);
      return data[0]; // 하나의 강의에 하나의 과제만 있으므로 첫 번째 요소만 반환
    },
    enabled: !!lectureId,
  });

  // 현재 강의가 오늘 오픈된 강의인지 확인
  const isTodayLecture =
    serverTime && open_at
      ? new Date(serverTime.split("T")[0]).getTime() ===
        new Date(open_at.split("T")[0]).getTime()
      : false;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserSubmission({
        userId: userInfo.id,
        challengeLectureId,
      });
      console.log(data);
    };
    fetchData();
  }, [userInfo.id, challengeLectureId]);

  return (
    <div className="border-t border-gray-700/50 mt-6">
      <div>
        <div className="w-full pt-6 bg-[#1C1F2B]/70 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-3 text-[#8C7DFF]" />
            <span className="font-semibold text-xl">과제 제출</span>
          </div>
          {assignmentInfo && (
            <div className="text-sm px-3 py-1 rounded-full bg-[#5046E4]/10 text-[#8C7DFF] font-medium flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>과제: {assignmentInfo?.title}</span>
            </div>
          )}
        </div>

        {timeError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-4">
            <div className="flex items-center text-red-400">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{timeError}</span>
            </div>
          </div>
        )}

        <div className="p-6 bg-[#1A1D29]/30 border-b border-gray-700/50">
          <div className="prose prose-invert max-w-none">
            {assignmentInfo?.contents ? (
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {assignmentInfo.contents}
              </p>
            ) : (
              <p className="text-gray-400 italic">등록된 과제가 없습니다.</p>
            )}
          </div>
        </div>

        {!timeError && assignmentInfo?.contents && isTodayLecture && (
          <AssignmentSubmissionForm
            userInfo={userInfo}
            challengeLectureId={challengeLectureId}
          />
        )}

        <div className="p-6 bg-[#1A1D29]/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-[#8C7DFF]" />
            제출된 과제
          </h3>
          <AssignmentSubmissionItem
            userInfo={userInfo}
            challengeLectureId={challengeLectureId}
          />
        </div>
      </div>
    </div>
  );
}
