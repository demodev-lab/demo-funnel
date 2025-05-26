"use client";

import { ExternalLink } from "lucide-react";

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
    <div className="bg-[#1C1F2B] p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 flex items-center justify-center text-[#5046E4] font-medium">
          {user.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{user}</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>
      <p className="text-sm mb-3">{text}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-[#5046E4] hover:underline text-sm bg-[#1A1D29] p-2 rounded border border-gray-700 max-w-full overflow-hidden"
      >
        <span className="bg-[#000000]/20 text-[#5046E4] text-xs px-2 py-1 rounded font-medium flex-shrink-0">
          {getLinkIcon(linkType)}
        </span>
        <span className="truncate overflow-ellipsis max-w-[calc(100%-60px)]">
          {link}
        </span>
        <ExternalLink className="h-3 w-3 flex-shrink-0 ml-auto" />
      </a>
    </div>
  );
} 