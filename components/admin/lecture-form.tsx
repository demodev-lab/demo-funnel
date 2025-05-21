"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function LectureForm({ onSuccess }: { onSuccess?: () => void }) {
  const [uploadType, setUploadType] = useState("url");
  const [date, setDate] = useState<Date>();

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6">
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
                    <p className="text-xs text-gray-500">
                      MP4, MOV (최대 500MB)
                    </p>
                  </div>
                  <input id="video-upload" type="file" className="hidden" />
                </label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">오픈 날짜</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">강의 순서</Label>
            <Input id="order" type="number" min="1" placeholder="1" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="auto-publish" />
            <Label htmlFor="auto-publish">오픈일 기준 자동 공개</Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5046E4] hover:bg-[#4038c7]"
          >
            강의 등록하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
