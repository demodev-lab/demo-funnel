"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 챌린지 데이터
const CHALLENGES = [
  { id: "1", name: "1기" },
  { id: "2", name: "2기" },
  { id: "3", name: "3기" },
];

export default function LectureForm({ onSuccess }: { onSuccess?: () => void }) {
  const [uploadType, setUploadType] = useState("url");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [assignmentContent, setAssignmentContent] = useState("");

  return (
    <form className="flex flex-col min-h-0">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">강의 제목</Label>
          <Input id="title" placeholder="예: 1강 - JavaScript 기초" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">강의 설명</Label>
          <Textarea
            id="description"
            placeholder="강의에 대한 설명을 입력하세요"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>업로드 방식</Label>
          <RadioGroup
            defaultValue="url"
            onValueChange={setUploadType}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="url" id="url" />
              <Label htmlFor="url">URL 입력</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="file" id="file" />
              <Label htmlFor="file">파일 업로드</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">
            영상 {uploadType === "url" ? "URL" : "업로드"}
          </Label>
          {uploadType === "url" ? (
            <Input id="video" placeholder="https://example.com/video" />
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">클릭하여 파일 선택</span>{" "}
                    또는 드래그 앤 드롭
                  </p>
                  <p className="text-xs text-gray-500">MP4, MOV (최대 500MB)</p>
                </div>
                <input id="video-upload" type="file" className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>챌린지</Label>
          <Select
            onValueChange={(value) => {
              if (!selectedChallenges.includes(value)) {
                setSelectedChallenges([...selectedChallenges, value]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="기수를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {CHALLENGES.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id}>
                  {challenge.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedChallenges.length > 0 && (
            <div className="mt-2 space-y-2">
              <div className="flex flex-wrap gap-2">
                {selectedChallenges.map((challengeId) => {
                  const challenge = CHALLENGES.find(
                    (c) => c.id === challengeId,
                  );
                  return (
                    <div
                      key={challengeId}
                      className="flex items-center gap-2 bg-[#DCD9FF] px-3 py-1 rounded-full text-sm"
                    >
                      <span>{challenge?.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChallenges(
                            selectedChallenges.filter(
                              (id) => id !== challengeId,
                            ),
                          );
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignment">과제 내용</Label>
          <Textarea
            id="assignment"
            placeholder="과제 내용을 입력하세요"
            rows={4}
            value={assignmentContent}
            onChange={(e) => setAssignmentContent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">강의 순서</Label>
          <Input id="order" type="number" min="1" placeholder="1" />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="auto-publish" />
          <Label htmlFor="auto-publish">오픈일 기준 자동 공개</Label>
        </div>
      </div>

      <div className="sticky bottom-0 pt-6 mt-6 border-t bg-white">
        <Button
          type="submit"
          className="w-full bg-[#5046E4] hover:bg-[#4038c7] mb-2  "
        >
          강의 등록하기
        </Button>
      </div>
    </form>
  );
}
