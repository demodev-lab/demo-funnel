"use client";

import { ExternalLink, Clock } from "lucide-react";
import { userInfo } from "@/types/user";
import { timeAgo } from "@/utils/date/timeAgo";
import { SubmittedAssignment } from "@/types/submittedAssignment";
import { getLinkIcon } from "@/utils/link/linkUtils";

interface AssignmentSubmissionItemProps {
  userInfo: userInfo;
  submittedAssignment: SubmittedAssignment | null;
}

export function AssignmentSubmissionItem({
  userInfo,
  submittedAssignment,
}: AssignmentSubmissionItemProps) {

  return (
    <div className="bg-[#1C1F2B]/60 p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5046E4] to-[#8C7DFF] mr-3 flex items-center justify-center text-white font-bold shadow-md">
          {userInfo.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{userInfo.name}</p>
          <div className="flex items-center text-xs text-gray-400 mt-0.5">
            <Clock className="h-3 w-3 mr-1" />
            {timeAgo(submittedAssignment.submitted_at)}
          </div>
        </div>
      </div>
      {submittedAssignment.assignment_comment && (
        <p className="text-sm mb-3 text-gray-200 leading-relaxed">
          {submittedAssignment.assignment_comment}
        </p>
      )}
      {submittedAssignment.assignment_url && (
        <a
          href={submittedAssignment.assignment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#8C7DFF] hover:text-[#A99AFF] text-sm bg-[#1A1D29]/80 p-2.5 rounded-lg border border-gray-700/30 hover:border-[#5046E4]/30 max-w-full overflow-hidden transition-all duration-300 group"
        >
          <span className="bg-[#5046E4]/10 text-[#8C7DFF] text-xs px-2 py-1 rounded-md font-medium flex-shrink-0">
            {getLinkIcon(submittedAssignment.assignment_url)}
          </span>
          <span className="truncate overflow-ellipsis max-w-[calc(100%-80px)]">
            {submittedAssignment.assignment_url}
          </span>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
      )}
    </div>
  );
}
