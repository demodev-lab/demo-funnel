"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const students = [
  {
    id: 1,
    name: "홍길동",
    email: "test@example.com",
    submissions: [true, true, false, false, true],
  },
  {
    id: 2,
    name: "김철수",
    email: "kim@example.com",
    submissions: [true, false, true, true, false],
  },
  {
    id: 3,
    name: "이영희",
    email: "lee@example.com",
    submissions: [false, true, true, false, false],
  },
  {
    id: 4,
    name: "박지민",
    email: "park@example.com",
    submissions: [true, true, true, true, true],
  },
  {
    id: 5,
    name: "최유리",
    email: "choi@example.com",
    submissions: [false, false, false, true, false],
  },
]

export default function CourseInfoTable() {
  const [selectedSubmission, setSelectedSubmission] = useState<{
    studentId: number
    lectureId: number
    submitted: boolean
  } | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>수강생 이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead className="text-center">1강</TableHead>
              <TableHead className="text-center">2강</TableHead>
              <TableHead className="text-center">3강</TableHead>
              <TableHead className="text-center">4강</TableHead>
              <TableHead className="text-center">5강</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                {student.submissions.map((submitted, index) => (
                  <TableCell
                    key={index}
                    className="text-center"
                    onClick={() =>
                      setSelectedSubmission({
                        studentId: student.id,
                        lectureId: index + 1,
                        submitted,
                      })
                    }
                  >
                    <div className="flex justify-center">
                      {submitted ? (
                        <div className="w-6 h-6 rounded-full bg-[#DCD9FF] flex items-center justify-center">
                          <Check className="h-4 w-4 text-[#5046E4]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <X className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={selectedSubmission !== null} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.submitted ? "과제 제출 정보" : "미제출 과제"}</DialogTitle>
          </DialogHeader>
          {selectedSubmission?.submitted ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">
                  {students.find((s) => s.id === selectedSubmission.studentId)?.name} -{selectedSubmission.lectureId}강
                  과제
                </h3>
                <p className="text-sm text-gray-500">제출일: 2024-05-15 14:30</p>
              </div>
              <div className="border rounded-md p-4 bg-gray-50">
                <p>
                  과제 내용이 여기에 표시됩니다. 실제 구현 시에는 과제 내용을 불러오거나 외부 링크로 연결할 수 있습니다.
                </p>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-[#5046E5] text-sm hover:underline">
                  외부 링크로 보기
                </a>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              <p>아직 과제가 제출되지 않았습니다.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
