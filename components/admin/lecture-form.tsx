"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createLecture,
  updateLecture,
  getLectureChallenges,
} from "@/apis/lectures";
import { getChallenges } from "@/apis/challenges";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Challenge {
  id: string;
  name: string;
  lecture_num?: number;
}

interface ChallengeOrder {
  challengeId: string;
  order: number;
}

interface LectureFormProps {
  onSuccess?: () => void;
  isEdit?: boolean;
  initialData?: {
    title: string;
    description: string;
    url: string;
    assignmentTitle?: string;
    assignment?: string;
  };
  lectureId?: string;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function LectureForm({
  onSuccess,
  isEdit = false,
  initialData = {
    title: "",
    description: "",
    url: "",
    assignmentTitle: "",
    assignment: "",
  },
  lectureId,
  onDelete,
  isDeleting = false,
}: LectureFormProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [videoUrl, setVideoUrl] = useState(initialData.url);
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [challengeOrders, setChallengeOrders] = useState<ChallengeOrder[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState(
    initialData.assignmentTitle,
  );
  const [assignment, setAssignment] = useState(initialData.assignment);
  const [uploadType, setUploadType] = useState("url");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 챌린지 데이터 가져오기
  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery<
    Challenge[]
  >({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // 현재 강의의 챌린지 정보 가져오기
  const {
    data: lectureChallenges = [],
    isLoading: isLoadingLectureChallenges,
  } = useQuery<Challenge[]>({
    queryKey: ["lecture-challenges", lectureId],
    queryFn: () => getLectureChallenges(lectureId || ""),
    enabled: isEdit && !!lectureId,
  });

  // 초기 챌린지 데이터 설정
  useEffect(() => {
    if (lectureChallenges.length > 0) {
      setSelectedChallenges(
        lectureChallenges.map((challenge) => String(challenge.id)),
      );
    }
  }, [lectureChallenges]);

  // 챌린지별 강의 순서 설정
  const handleOrderChange = (challengeId: string, order: number) => {
    setChallengeOrders((prev) => {
      const filtered = prev.filter((co) => co.challengeId !== challengeId);
      return [...filtered, { challengeId, order }];
    });
  };

  // 챌린지별 현재 선택된 순서 가져오기
  const getSelectedOrder = (challengeId: string) => {
    return (
      challengeOrders.find((co) => co.challengeId === challengeId)?.order ||
      null
    );
  };

  // 챌린지별 최대 강의 수 가져오기
  const getMaxLectureNum = (challengeId: string) => {
    const challenge = challenges.find((c) => String(c.id) === challengeId);
    return challenge?.lecture_num || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEdit && lectureId) {
        // 강의 수정 로직
        const updateData = {
          name: title,
          description,
          url: videoUrl,
          challenges: selectedChallenges,
        };

        console.log("수정 전송 데이터:", updateData);

        await updateLecture(lectureId, updateData);

        // 관련된 쿼리들 무효화
        await queryClient.invalidateQueries({ queryKey: ["lectures"] });
        await queryClient.invalidateQueries({
          queryKey: ["lecture-challenges", lectureId],
        });

        toast.success("강의가 수정되었습니다.");
      } else {
        // 필수 필드 검증
        if (!title.trim()) {
          toast.error("강의 제목을 입력해주세요.");
          return;
        }

        if (!videoUrl.trim()) {
          toast.error("영상 URL을 입력해주세요.");
          return;
        }

        // 강의 추가 로직
        const lectureData = {
          title: title.trim(),
          description: description.trim(),
          url: videoUrl.trim(),
          challenges: selectedChallenges,
          assignmentTitle: assignmentTitle.trim(),
          assignment: assignment.trim(),
        };

        console.log("강의 추가 시도:", lectureData);

        await createLecture(lectureData);

        // 강의 목록 쿼리 무효화
        await queryClient.invalidateQueries({ queryKey: ["lectures"] });

        // 폼 초기화
        setTitle("");
        setDescription("");
        setVideoUrl("");
        setSelectedChallenges([]);
        setAssignmentTitle("");
        setAssignment("");

        toast.success("강의가 추가되었습니다.");
      }

      onSuccess?.();
    } catch (error) {
      console.error("강의 저장 실패:", error);
      if (error instanceof Error) {
        toast.error(`강의 저장 실패: ${error.message}`);
      } else {
        toast.error("강의 저장에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingChallenges || (isEdit && isLoadingLectureChallenges)) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">강의 제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-[#1A1D29] border-gray-700/30 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">강의 설명</Label>
        <Textarea
          id="description"
          placeholder="강의에 대한 설명을 입력하세요"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-[#1A1D29] border-gray-700/30 text-white placeholder:text-gray-500"
        />
      </div>

      <div className="space-y-2">
        <Label>업로드 방식</Label>
        <RadioGroup
          defaultValue="url"
          value={uploadType}
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
          <Input
            id="video"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video"
            className="bg-[#1A1D29] border-gray-700/30 text-white placeholder:text-gray-500"
          />
        ) : (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700/30 border-dashed rounded-lg cursor-pointer bg-[#1A1D29] hover:bg-[#252A3C] transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">클릭하여 파일 선택</span> 또는
                  드래그 앤 드롭
                </p>
                <p className="text-xs text-gray-500">MP4, MOV (최대 500MB)</p>
              </div>
              <input id="video-upload" type="file" className="hidden" />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>챌린지 및 강의 순서</Label>
        <Select
          onValueChange={(value) => {
            if (!selectedChallenges.includes(value)) {
              setSelectedChallenges([...selectedChallenges, value]);
            }
          }}
        >
          <SelectTrigger className="bg-[#1A1D29] border-gray-700/30 text-white">
            <SelectValue
              placeholder="기수를 선택하세요"
              className="text-gray-400"
            />
          </SelectTrigger>
          <SelectContent className="bg-[#1A1D29] border-gray-700/30">
            {challenges.map((challenge) => (
              <SelectItem
                key={String(challenge.id)}
                value={String(challenge.id)}
                className="text-white hover:bg-[#252A3C] focus:bg-[#252A3C] focus:text-white"
              >
                {challenge.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedChallenges.length > 0 && (
          <div className="mt-4 space-y-4">
            {selectedChallenges.map((challengeId) => {
              const challenge = challenges.find(
                (c) => String(c.id) === challengeId,
              );
              return (
                <div
                  key={challengeId}
                  className="p-4 bg-[#1A1D29] border border-gray-700/30 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {challenge?.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedChallenges(
                          selectedChallenges.filter((id) => id !== challengeId),
                        );
                        setChallengeOrders((prev) =>
                          prev.filter((co) => co.challengeId !== challengeId),
                        );
                      }}
                      className="text-white/80 hover:text-white"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">강의 순서</Label>
                    <Select
                      value={getSelectedOrder(challengeId)?.toString()}
                      onValueChange={(value) =>
                        handleOrderChange(challengeId, Number(value))
                      }
                    >
                      <SelectTrigger className="bg-[#252A3C] border-gray-700/30 text-white">
                        <SelectValue
                          placeholder="강의 순서를 선택하세요"
                          className="text-gray-400"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1D29] border-gray-700/30">
                        {Array.from(
                          { length: getMaxLectureNum(challengeId) },
                          (_, i) => i + 1,
                        ).map((num) => (
                          <SelectItem
                            key={num}
                            value={num.toString()}
                            className="text-white hover:bg-[#252A3C] focus:bg-[#252A3C] focus:text-white"
                          >
                            {num}번째
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="assignmentTitle">과제 제목</Label>
          <Input
            id="assignmentTitle"
            placeholder="과제의 제목을 입력하세요"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            className="bg-[#1A1D29] border-gray-700/30 text-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignment">과제 내용</Label>
          <Textarea
            id="assignment"
            placeholder="과제 내용을 입력하세요"
            rows={4}
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            className="bg-[#1A1D29] border-gray-700/30 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex justify-end items-center pt-4">
        <div className="flex space-x-2">
          {isEdit && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제하기"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>강의 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>삭제</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110"
          >
            {isSubmitting ? "저장 중..." : isEdit ? "수정하기" : "추가하기"}
          </Button>
        </div>
      </div>
    </form>
  );
}
