"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EnrollmentRateDashboardProps {
  type: "submission" | "lecture"
}

export default function EnrollmentRateDashboard({ type }: EnrollmentRateDashboardProps) {
  // Mock data
  const lectures = [
    { id: 1, title: "1강: JavaScript 기초", rate: 78, count: 94 },
    { id: 2, title: "2강: 함수와 스코프", rate: 65, count: 78 },
    { id: 3, title: "3강: 객체와 배열", rate: 90, count: 108 },
    { id: 4, title: "4강: 비동기 프로그래밍", rate: 72, count: 86 },
    { id: 5, title: "5강: 웹 API 활용", rate: 60, count: 72 },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-4">
        {lectures.map((lecture) => (
          <div key={lecture.id} className="flex flex-col">
            <div className="text-sm font-medium mb-2">{lecture.id}강</div>
            <div className="relative h-40 bg-gray-100 rounded-md">
              <div
                className="absolute bottom-0 w-full bg-[#5046E4] rounded-md"
                style={{ height: `${lecture.rate}%` }}
              />
            </div>
            <div className="mt-2 text-center font-medium text-[#5046E4]">{lecture.rate}%</div>
          </div>
        ))}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>강의명</TableHead>
              <TableHead className="text-right">{type === "submission" ? "제출률" : "수강률"}</TableHead>
              <TableHead className="text-right">{type === "submission" ? "제출 인원" : "수강 인원"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures.map((lecture) => (
              <TableRow key={lecture.id}>
                <TableCell>{lecture.title}</TableCell>
                <TableCell className="text-right">{lecture.rate}%</TableCell>
                <TableCell className="text-right">{lecture.count}명 / 120명</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
