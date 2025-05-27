"use client";

import { ExternalLink, Clock } from "lucide-react";

interface AssignmentSubmissionItemProps {
  id: number;
  user: string;
  time: string;
  text: string;
  link: string;
  linkType: string;
}

export function AssignmentSubmissionItem({
  user,
  time,
  text,
  link,
  linkType,
}: AssignmentSubmissionItemProps) {
  const getLinkIcon = (linkType: string) => {
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
    <div className="bg-[#1C1F2B]/60 p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5046E4] to-[#8C7DFF] mr-3 flex items-center justify-center text-white font-bold shadow-md">
          {user.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{user}</p>
          <div className="flex items-center text-xs text-gray-400 mt-0.5">
            <Clock className="h-3 w-3 mr-1" />
            {time}
          </div>
        </div>
      </div>
      <p className="text-sm mb-3 text-gray-200 leading-relaxed">{text}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#8C7DFF] hover:text-[#A99AFF] text-sm bg-[#1A1D29]/80 p-2.5 rounded-lg border border-gray-700/30 hover:border-[#5046E4]/30 max-w-full overflow-hidden transition-all duration-300 group"
      >
        <span className="bg-[#5046E4]/10 text-[#8C7DFF] text-xs px-2 py-1 rounded-md font-medium flex-shrink-0">
          {getLinkIcon(linkType)}
        </span>
        <span className="truncate overflow-ellipsis max-w-[calc(100%-80px)]">
          {link}
        </span>
        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
} 