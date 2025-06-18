"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Label } from "@/components/common/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { Card, CardContent } from "@/components/common/Card";
import { Check, AlertTriangle, Upload } from "lucide-react";

// Mock data for preview
const previewData = [
  {
    id: 1,
    name: "홍길동",
    email: "test@example.com",
    phone: "010-1234-5678",
    status: "valid",
  },
  {
    id: 2,
    name: "이지은",
    email: "duplicate@example.com",
    phone: "010-1111-2222",
    status: "duplicate",
  },
  {
    id: 3,
    name: "김철수",
    email: "kim@example.com",
    phone: "010-3333-4444",
    status: "valid",
  },
  {
    id: 4,
    name: "박영수",
    email: "park@example.com",
    phone: "010-5555-6666",
    status: "valid",
  },
  {
    id: 5,
    name: "최민지",
    email: "invalid",
    phone: "010-7777-8888",
    status: "invalid",
  },
];

export default function StudentUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // In a real app, you would parse the file here
      setPreview(true);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      // In a real app, you would parse the file here
      setPreview(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base">엑셀 파일 업로드</Label>
            <div
              className="mt-2 flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">클릭하여 파일 선택</span> 또는
                  드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500">
                  XLSX, CSV 파일 (최대 10MB)
                </p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
              />
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                선택된 파일: {file.name}
              </p>
            )}
          </div>

          {preview && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">업로드 결과 미리보기</h3>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>전화번호</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>
                          {row.status === "duplicate" ? (
                            <span className="text-amber-500">(중복)</span>
                          ) : row.status === "invalid" ? (
                            <Input
                              defaultValue={row.email}
                              className="h-8 w-full max-w-xs bg-red-50 border-red-200"
                            />
                          ) : (
                            row.email
                          )}
                        </TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>
                          {row.status === "valid" ? (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-green-500">정상</span>
                            </div>
                          ) : row.status === "duplicate" ? (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-amber-500">중복</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-red-500">오류</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">취소</Button>
                <Button className="bg-[#5046E4] hover:bg-[#4038c7]">
                  등록하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
