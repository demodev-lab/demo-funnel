"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardAssignmentStat } from "@/types/assignment";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnrollmentRateDashboardProps {
  type: "submission" | "lecture";
  data?: DashboardAssignmentStat[];
}

interface DisplayItem {
  id: number;
  title: string;
  rate: number;
  count: number;
  total: number;
}

export default function EnrollmentRateDashboard({
  type,
  data,
}: EnrollmentRateDashboardProps) {
  // TODO: api 연결 후 삭제
  const lecturesMock = [
    { id: 1, title: "JavaScript 기초", rate: 78, count: 94, total: 120 },
    { id: 2, title: "함수와 스코프", rate: 65, count: 78, total: 120 },
    { id: 3, title: "객체와 배열", rate: 90, count: 108, total: 120 },
    { id: 4, title: "비동기 프로그래밍", rate: 72, count: 86, total: 120 },
    { id: 5, title: "웹 API 활용", rate: 60, count: 72, total: 120 },
  ];

  const displayData: DisplayItem[] =
    type === "submission" && data
      ? data.map((item) => ({
          id: item.lectureId,
          title: item.assignmentTitle,
          rate: item.submissionRate,
          count: item.submittedCount,
          total: item.totalParticipants,
        }))
      : lecturesMock.map((item) => ({
          // TODO: 서버 데이터로 수정
          id: item.id,
          title: item.title,
          rate: item.rate,
          count: item.count,
          total: item.total,
        }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {displayData.map((item, index) => (
          <div key={item.id} className="flex flex-col">
            <div className="mb-2 text-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-sm font-medium text-gray-400 cursor-help">
                      {type === "submission"
                        ? `과제 ${index + 1}`
                        : `${item.id}강`}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#252A3C] border border-gray-700/30 text-gray-300 text-xs px-2 py-1 rounded-md shadow-sm">
                    {type === "submission"
                      ? `${index + 1}. ${item.title}`
                      : `${item.id}강: ${item.title}`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative h-40 bg-[#1A1D29]/60 rounded-lg overflow-hidden border border-gray-700/30">
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-[#5046E4] to-[#8C7DFF] rounded-b-md transition-all duration-500"
                style={{ height: `${item.rate}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {item.rate}%
                </span>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-gray-400">
              {item.count}명 / {item.total}명
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-[#1A1D29]/40 border-gray-700/30 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1A1D29]/60">
            <TableRow className="border-b-gray-700/30 hover:bg-transparent">
              <TableHead className="text-gray-400">
                {type === "submission" ? "과제명" : "강의명"}{" "}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출률" : "수강률"}{" "}
              </TableHead>
              <TableHead className="text-right text-gray-400">
                {type === "submission" ? "제출 인원" : "수강 인원"}{" "}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((item, index) => (
              <TableRow
                key={item.id}
                className="border-b-gray-700/30 hover:bg-[#252A3C]/50 transition-colors"
              >
                <TableCell className="font-medium text-gray-300">
                  {type === "submission"
                    ? `${index + 1}. ${item.title}`
                    : `${item.id}강: ${item.title}`}{" "}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.rate >= 80
                        ? "bg-green-500/10 text-green-400"
                        : item.rate >= 60
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {item.rate}%
                  </span>
                </TableCell>
                <TableCell className="text-right text-gray-400">
                  <span className="font-medium text-white">{item.count}명</span>
                  / {item.total}명
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
