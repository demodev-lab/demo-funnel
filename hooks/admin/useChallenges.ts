import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getChallenges,
  createChallenge,
  deleteChallenge,
  updateChallenge,
} from "@/apis/challenges";
import { Challenge, ChallengeFormData } from "@/types/challenge";
import { calculateLectureCount, validateDateRange } from "@/utils/date";
import { CHALLENGE_MESSAGES } from "@/constants/challenge";

export interface ChallengesState {
  challenges: Challenge[];
  editingChallenge: Challenge | null;
  newChallenge: ChallengeFormData;
}

export interface ChallengesStatus {
  isLoading: boolean;
  error: Error | null;
  isCreating: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
}

export interface ChallengesDialog {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  setIsEditDialogOpen: (open: boolean) => void;
}

export interface ChallengesActions {
  setNewChallenge: (challenge: ChallengeFormData) => void;
  setEditingChallenge: (challenge: Challenge | null) => void;
  handleNewChallengeDateChange: (
    field: "openDate" | "closeDate",
    value: string,
  ) => void;
  handleEditChallengeDateChange: (
    field: "openDate" | "closeDate",
    value: string,
  ) => void;
  handleAddChallenge: () => void;
  handleDeleteChallenge: (id: number) => void;
  handleEditChallenge: (challenge: Challenge) => void;
  handleUpdateChallenge: () => void;
}

export const useChallenges = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [newChallenge, setNewChallenge] = useState<ChallengeFormData>({
    name: "",
    openDate: new Date().toISOString().split("T")[0],
    closeDate: new Date().toISOString().split("T")[0],
    lectureNum: 0,
  });

  const queryClient = useQueryClient();

  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: getChallenges,
  });

  const { mutate: createChallengeMutation, isPending: isCreating } =
    useMutation({
      mutationFn: (data: ChallengeFormData) => createChallenge(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
        toast.success(CHALLENGE_MESSAGES.SUCCESS.CREATE);
        setIsAddDialogOpen(false);
        setNewChallenge({
          name: "",
          openDate: new Date().toISOString().split("T")[0],
          closeDate: new Date().toISOString().split("T")[0],
          lectureNum: 0,
        });
      },
      onError: (error: Error) => {
        toast.error(error.message || CHALLENGE_MESSAGES.ERROR_MESSAGE.CREATE);
      },
    });

  const { mutate: removeChallenge, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success(CHALLENGE_MESSAGES.SUCCESS.DELETE);
      setDeletingId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || CHALLENGE_MESSAGES.ERROR_MESSAGE.DELETE);
      setDeletingId(null);
    },
  });

  const { mutate: modifyChallenge, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Challenge> }) =>
      updateChallenge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      toast.success(CHALLENGE_MESSAGES.SUCCESS.UPDATE);
      setIsEditDialogOpen(false);
      setEditingChallenge(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : CHALLENGE_MESSAGES.ERROR_MESSAGE.UPDATE,
      );
    },
  });

  const handleNewChallengeDateChange = (
    field: "openDate" | "closeDate",
    value: string,
  ) => {
    const updatedChallenge = { ...newChallenge, [field]: value };
    const startDate = new Date(updatedChallenge.openDate);
    const endDate = new Date(updatedChallenge.closeDate);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      updatedChallenge.lectureNum = calculateLectureCount(startDate, endDate);
    }

    setNewChallenge(updatedChallenge);
  };

  const handleEditChallengeDateChange = (
    field: "openDate" | "closeDate",
    value: string,
  ) => {
    if (!editingChallenge) return;

    const updatedChallenge = { ...editingChallenge, [field]: value };

    if (updatedChallenge.openDate && updatedChallenge.closeDate) {
      updatedChallenge.lectureNum = calculateLectureCount(
        new Date(updatedChallenge.openDate),
        new Date(updatedChallenge.closeDate),
      );
    }

    setEditingChallenge(updatedChallenge);
  };

  const handleAddChallenge = () => {
    if (
      !newChallenge.name ||
      !newChallenge.openDate ||
      !newChallenge.closeDate
    ) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.REQUIRED);
      return;
    }

    const openDate = new Date(newChallenge.openDate);
    const closeDate = new Date(newChallenge.closeDate);

    if (!validateDateRange(openDate, closeDate)) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.DATE_RANGE);
      return;
    }

    if (newChallenge.lectureNum <= 0) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.LECTURE_COUNT);
      return;
    }

    createChallengeMutation(newChallenge);
  };

  const handleDeleteChallenge = (id: number) => {
    if (window.confirm(CHALLENGE_MESSAGES.CONFIRM_DELETE)) {
      setDeletingId(id);
      removeChallenge(id);
    }
  };

  const handleEditChallenge = (challenge: Challenge) => {
    const editChallenge = {
      ...challenge,
      openDate: challenge.openDate,
      closeDate: challenge.closeDate,
      lectureNum: challenge.lectureNum,
    };
    setEditingChallenge(editChallenge);
    setIsEditDialogOpen(true);
  };

  const handleUpdateChallenge = () => {
    if (!editingChallenge) return;

    if (
      !editingChallenge.name ||
      !editingChallenge.openDate ||
      !editingChallenge.closeDate
    ) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.REQUIRED);
      return;
    }

    if (
      !validateDateRange(
        new Date(editingChallenge.openDate),
        new Date(editingChallenge.closeDate),
      )
    ) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.DATE_RANGE);
      return;
    }

    if (editingChallenge.lectureNum && editingChallenge.lectureNum <= 0) {
      toast.error(CHALLENGE_MESSAGES.VALIDATION.LECTURE_COUNT);
      return;
    }

    // 원본 챌린지 데이터 조회
    const originalChallenge = challenges.find(
      (c) => c.id === editingChallenge.id,
    );
    if (!originalChallenge) return;

    // 변경된 필드만 업데이트하기 위한 객체
    const updatedFields: Partial<Challenge> = {};

    // 이름이 변경된 경우에만 업데이트
    if (editingChallenge.name !== originalChallenge.name) {
      updatedFields.name = editingChallenge.name;
    }

    // 날짜 형식을 YYYY-MM-DD로 변환
    const newOpenDate = new Date(editingChallenge.openDate)
      .toISOString()
      .split("T")[0];
    const newCloseDate = new Date(editingChallenge.closeDate)
      .toISOString()
      .split("T")[0];

    // 시작일이 변경된 경우에만 업데이트
    if (newOpenDate !== originalChallenge.openDate) {
      updatedFields.openDate = newOpenDate;
    }
    // 종료일이 변경된 경우에만 업데이트
    if (newCloseDate !== originalChallenge.closeDate) {
      updatedFields.closeDate = newCloseDate;
    }
    if (editingChallenge.lectureNum !== originalChallenge.lectureNum) {
      updatedFields.lectureNum = editingChallenge.lectureNum;
    }

    if (Object.keys(updatedFields).length > 0) {
      modifyChallenge({
        id: editingChallenge.id,
        data: updatedFields,
      });
    } else {
      toast.info("변경된 내용이 없습니다.");
      setIsEditDialogOpen(false);
      setEditingChallenge(null);
    }
  };

  return {
    // 상태 데이터
    state: {
      challenges,
      editingChallenge,
      newChallenge,
    } as ChallengesState,

    // 로딩/에러 상태
    status: {
      isLoading,
      error,
      isCreating,
      isDeleting,
      isUpdating,
    } as ChallengesStatus,

    // 다이얼로그 상태
    dialog: {
      isAddDialogOpen,
      isEditDialogOpen,
      setIsAddDialogOpen,
      setIsEditDialogOpen,
    } as ChallengesDialog,

    // 액션 메서드들
    actions: {
      setNewChallenge,
      setEditingChallenge,
      handleNewChallengeDateChange,
      handleEditChallengeDateChange,
      handleAddChallenge,
      handleDeleteChallenge,
      handleEditChallenge,
      handleUpdateChallenge,
    } as ChallengesActions,
  };
};
