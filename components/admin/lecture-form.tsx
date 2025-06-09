"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  getLectureDetail,
} from "@/apis/lectures";
import { getChallenges } from "@/apis/challenges";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { type LectureDetail, type LectureFormProps } from "@/types/lecture";
import { Challenge, ChallengeOrder } from "@/types/challenge";

export default function LectureForm({
  onSuccess,
  isEdit = false,
  initialData = {
    name: "",
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
  const supabase = createClient();
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [videoUrl, setVideoUrl] = useState(initialData.url || "");
  const [selectedChallenges, setSelectedChallenges] = useState<number[]>([]);
  const [challengeOrders, setChallengeOrders] = useState<ChallengeOrder[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState(
    initialData.assignmentTitle || "",
  );
  const [assignment, setAssignment] = useState(initialData.assignment || "");
  const [uploadType, setUploadType] = useState("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 유튜브 비디오 ID 추출 함수
  const getYouTubeVideoId = (url: string) => {
    try {
      // 다양한 유튜브 URL 형식 처리
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
      ];

      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    } catch (e) {
      console.error("비디오 ID 추출 실패:", e);
      return null;
    }
  };

  // URL이 유튜브 URL인지 확인
  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // URL이 Supabase Storage URL인지 확인
  const isSupabaseStorageUrl = (url: string) => {
    return url.includes("supabase.co/storage/v1");
  };

  // Supabase Storage URL을 공개 URL로 변환
  const getPublicUrl = (url: string) => {
    if (isSupabaseStorageUrl(url)) {
      // URL에서 파일 경로 추출
      const pathMatch = url.match(
        /\/storage\/v1\/object\/public\/videos\/(.+)/,
      );
      if (pathMatch && pathMatch[1]) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("videos").getPublicUrl(pathMatch[1]);
        return publicUrl;
      }
    }
    return url;
  };

  // 챌린지 데이터 가져오기
  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery<
    Challenge[]
  >({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  // 강의 상세 정보 가져오기
  const { data: lectureDetail, isLoading: isLoadingDetail } =
    useQuery<LectureDetail | null>({
      queryKey: ["lecture-detail", lectureId],
      queryFn: async () => {
        try {
          const data = await getLectureDetail(lectureId);
          return data;
        } catch (error) {
          if (error.code === "PGRST116") {
            return null;
          }
          throw error;
        }
      },
      enabled: isEdit && !!lectureId,
    });

  // 상세 정보가 로드되면 폼 데이터 설정
  useEffect(() => {
    if (lectureDetail) {
      // console.log(lectureDetail);
      setName(lectureDetail.name);
      setDescription(lectureDetail.description);
      setVideoUrl(lectureDetail.url);
      setUploadType(lectureDetail.upload_type === 0 ? "url" : "file");

      // 과제 정보 설정
      if (lectureDetail.Assignments?.[0]) {
        setAssignmentTitle(lectureDetail.Assignments[0].title);
        setAssignment(lectureDetail.Assignments[0].contents);
      }

      // 챌린지 정보 설정
      if (lectureDetail.ChallengeLectures?.length > 0) {
        const challenges = lectureDetail.ChallengeLectures.map((cl) =>
          cl.Challenges.id.toString(),
        );
        setSelectedChallenges(challenges.map(Number));

        const orders = lectureDetail.ChallengeLectures.map((cl) => ({
          challengeId: cl.Challenges.id.toString(),
          order: cl.sequence,
        }));
        setChallengeOrders(
          orders.map((co) => ({
            challengeId: Number(co.challengeId),
            order: co.order,
          })),
        );
      }
    }
  }, [lectureDetail]);

  // 챌린지별 강의 순서 설정
  const handleOrderChange = (challengeId: number, order: number) => {
    setChallengeOrders((prev) => {
      const filtered = prev.filter((co) => co.challengeId !== challengeId);
      return [...filtered, { challengeId, order }];
    });
  };

  // 챌린지별 현재 선택된 순서 가져오기
  const getSelectedOrder = (challengeId: number) => {
    return (
      challengeOrders.find((co) => co.challengeId === challengeId)?.order ||
      null
    );
  };

  // 챌린지별 최대 강의 수 가져오기
  const getMaxLectureNum = (challengeId: number) => {
    const challenge = challenges.find(
      (c) => String(c.id) === String(challengeId),
    );
    return challenge?.lecture_num || 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoUrl(""); // URL 입력 필드 초기화

      // 비디오 미리보기 URL 생성
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 컴포넌트 언마운트 시 미리보기 URL 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEdit && lectureId) {
        // 강의 수정 로직
        const updateData = {
          name: name,
          description,
          url: videoUrl,
          challenges: selectedChallenges,
          assignmentTitle: assignmentTitle.trim(),
          assignment: assignment.trim(),
          challengeOrders: challengeOrders,
          file: selectedFile,
          upload_type: uploadType === "url" ? 0 : 1,
        };

        // console.log("수정 전송 데이터:", updateData);

        await updateLecture(lectureId, updateData);

        // 관련된 쿼리들 무효화
        await queryClient.invalidateQueries({ queryKey: ["lectures"] });
        await queryClient.invalidateQueries({ queryKey: ["lecture-detail"] });
        await queryClient.invalidateQueries({
          queryKey: ["lecture-challenges"],
        });

        toast.success("강의가 수정되었습니다.");
      } else {
        // 필수 필드 검증
        if (!name.trim()) {
          toast.error("강의 제목을 입력해주세요.");
          return;
        }

        if (uploadType === "url" && !videoUrl.trim()) {
          toast.error("영상 URL을 입력해주세요.");
          return;
        }

        if (uploadType === "file" && !selectedFile) {
          toast.error("영상 파일을 선택해주세요.");
          return;
        }

        // 강의 추가 로직
        const lectureData = {
          name: name.trim(),
          description: description.trim(),
          url: videoUrl.trim(),
          challenges: selectedChallenges,
          assignmentTitle: assignmentTitle.trim(),
          assignment: assignment.trim(),
          challengeOrders: challengeOrders,
          file: selectedFile,
          upload_type: uploadType === "url" ? 0 : 1,
        };

        // console.log("강의 추가 시도:", lectureData);

        await createLecture(lectureData);

        // 강의 목록 쿼리 무효화
        await queryClient.invalidateQueries({ queryKey: ["lectures"] });

        // 폼 초기화
        setName("");
        setDescription("");
        setVideoUrl("");
        setSelectedChallenges([]);
        setAssignmentTitle("");
        setAssignment("");
        setSelectedFile(null);

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

  if (isLoadingChallenges || (isEdit && isLoadingDetail)) {
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
                {selectedFile && (
                  <p className="mt-2 text-sm text-white">
                    선택된 파일: {selectedFile.name}
                  </p>
                )}
              </div>
              <input
                id="video-upload"
                type="file"
                accept="video/mp4,video/quicktime"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
        {previewUrl && (
          <div className="mt-2 aspect-video relative rounded-lg overflow-hidden">
            <video
              src={previewUrl}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>챌린지 및 강의 순서</Label>
        <Select
          onValueChange={(value) => {
            if (!selectedChallenges.includes(Number(value))) {
              setSelectedChallenges([...selectedChallenges, Number(value)]);
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
              const challenge = challenges.find((c) => c.id === challengeId);
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
