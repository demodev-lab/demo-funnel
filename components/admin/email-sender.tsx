"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data
const students = [
  { id: 1, name: "홍길동", email: "test@example.com", selected: false },
  { id: 2, name: "김철수", email: "kim@example.com", selected: false },
  { id: 3, name: "이영희", email: "lee@example.com", selected: false },
  { id: 4, name: "박지민", email: "park@example.com", selected: false },
  { id: 5, name: "최유리", email: "choi@example.com", selected: false },
]

const emailLogs = [
  { id: 1, date: "2024-05-18", template: "강의 오픈 알림", targets: 120, success: 118 },
  { id: 2, date: "2024-05-15", template: "과제 제출 독려", targets: 45, success: 45 },
]

export default function EmailSender() {
  const [selectedTemplate, setSelectedTemplate] = useState("lecture-open")
  const [selectAll, setSelectAll] = useState(false)
  const [studentList, setStudentList] = useState(students)

  const handleSelectAll = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)
    setStudentList(
      studentList.map((student) => ({
        ...student,
        selected: newSelectAll,
      })),
    )
  }

  const handleSelectStudent = (id: number) => {
    const updatedList = studentList.map((student) =>
      student.id === id ? { ...student, selected: !student.selected } : student,
    )
    setStudentList(updatedList)
    setSelectAll(updatedList.every((student) => student.selected))
  }

  const getTemplatePreview = () => {
    switch (selectedTemplate) {
      case "lecture-open":
        return "안녕하세요, {이름}님!\n\n코드언락의 새로운 강의가 오픈되었습니다. 지금 바로 확인해보세요.\n\n강의명: {강의명}\n오픈일: {오픈일}\n\n코드언락 드림"
      case "assignment-reminder":
        return "안녕하세요, {이름}님!\n\n아직 제출하지 않은 과제가 있습니다. 기한 내에 제출해주세요.\n\n과제명: {과제명}\n제출기한: {제출기한}\n\n코드언락 드림"
      default:
        return ""
    }
  }

  return (
    <Tabs defaultValue="send">
      <TabsList>
        <TabsTrigger value="send">이메일 발송</TabsTrigger>
        <TabsTrigger value="logs">발송 로그</TabsTrigger>
      </TabsList>

      <TabsContent value="send">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">대상 선택</Label>
                  <div className="mt-2">
                    <Input placeholder="이름 또는 이메일 검색" className="mb-2" />

                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                            </TableHead>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentList.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>
                                <Checkbox
                                  checked={student.selected}
                                  onCheckedChange={() => handleSelectStudent(student.id)}
                                />
                              </TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      {studentList.filter((s) => s.selected).length}명 선택됨
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">템플릿 선택</Label>
                  <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="lecture-open" id="lecture-open" />
                      <Label htmlFor="lecture-open" className="flex-1">
                        📢 강의 오픈 알림
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="assignment-reminder" id="assignment-reminder" />
                      <Label htmlFor="assignment-reminder" className="flex-1">
                        📬 과제 제출 독려
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base">이메일 미리보기</Label>
                  <div className="mt-2 p-4 border rounded-md bg-gray-50 whitespace-pre-line">
                    {getTemplatePreview()}
                  </div>
                </div>

                <Button className="w-full bg-[#5046E4] hover:bg-[#4038c7]">발송하기</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="logs">
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>발송 날짜</TableHead>
                  <TableHead>템플릿 유형</TableHead>
                  <TableHead className="text-right">대상 수</TableHead>
                  <TableHead className="text-right">수신 성공 수</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.template}</TableCell>
                    <TableCell className="text-right">{log.targets}명</TableCell>
                    <TableCell className="text-right">{log.success}명</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
