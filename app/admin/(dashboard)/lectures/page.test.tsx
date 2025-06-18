// app/admin/(dashboard)/lectures/page.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import LecturesPage from "./page";
import { useChallengeStore } from "@/lib/store/useChallengeStore";
import { deleteLecture } from "@/apis/lectures";

// ─── Jest 모킹 설정 ──────────────────────────────────────────────────────────

// React Query 훅 모킹
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

// Sonner toast 모킹
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Zustand 스토어 모킹
jest.mock("@/lib/store/useChallengeStore", () => ({
  useChallengeStore: jest.fn(),
}));

// API 함수 모킹
jest.mock("@/apis/lectures", () => ({
  getLecturesByChallenge: jest.fn(),
  deleteLecture: jest.fn(),
}));

// UI 컴포넌트 모킹: Button
jest.mock("@/components/common/Button", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// LectureCard 모킹: 클릭 시 onClick prop 실행
jest.mock("@/components/admin/lectures/LectureCard", () => ({
  __esModule: true,
  default: ({ lecture, onClick }: any) => (
    <div
      data-testid="lecture-card"
      data-lecture-id={lecture.id}
      onClick={() => onClick(lecture)}
    >
      {lecture.name}
    </div>
  ),
}));

// LectureForm 모킹: mode에 따라 'add' 또는 'edit' 버튼 제공, onSuccess / onDelete prop 실행
jest.mock("@/components/admin/LectureForm", () => ({
  __esModule: true,
  default: ({ onSuccess, onDelete, isDeleting, mode = "add" }: any) => (
    <div data-testid={`lecture-form-${mode}`}>
      <button
        data-testid={`form-success-${mode}`}
        onClick={() => onSuccess && onSuccess()}
      >
        Success
      </button>
      {onDelete && (
        <button
          data-testid="form-delete"
          disabled={isDeleting}
          onClick={() => onDelete()}
        >
          Delete
        </button>
      )}
    </div>
  ),
}));

// Dialog 모킹: open prop을 기준으로 렌더링, onOpenChange 호출 테스트 가능
jest.mock("@/components/common/Dialog", () => {
  return {
    Dialog: ({ open, onOpenChange, children }: any) => (
      <div data-testid="dialog" data-open={String(open)}>
        {/*
          실제로 LecturesPage가 Dialog 내부에서 onOpenChange(false) 등의 콜백을 호출할 텐데,
          모킹에서는 단순히 children을 렌더하기만 함.
        */}
        {children}
      </div>
    ),
    DialogTrigger: ({ children }: any) => (
      <div data-testid="dialog-trigger">{children}</div>
    ),
    DialogContent: ({ children }: any) => (
      <div data-testid="dialog-content">{children}</div>
    ),
    DialogHeader: ({ children }: any) => (
      <div data-testid="dialog-header">{children}</div>
    ),
    DialogTitle: ({ children }: any) => (
      <div data-testid="dialog-title">{children}</div>
    ),
  };
});

// ─── 테스트 데이터 ──────────────────────────────────────────────────────────

const mockLectures = [
  {
    id: 1,
    name: "강의 1",
    description: "설명 1",
    url: "https://youtube.com/watch?v=1",
    upload_type: 0,
  },
  {
    id: 2,
    name: "강의 2",
    description: "설명 2",
    url: "https://youtube.com/watch?v=2",
    upload_type: 0,
  },
];

// ─── 테스트 ─────────────────────────────────────────────────────────────────

describe("LecturesPage", () => {
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // React Query 클라이언트 리턴값 설정
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    // 선택된 챌린지 ID 리턴값 설정
    (useChallengeStore as unknown as jest.Mock).mockReturnValue({
      selectedChallengeId: 1,
    });
  });

  it("로딩 상태일 때 스피너를 표시합니다", () => {
    // useQuery가 isLoading=true를 반환하도록 설정
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<LecturesPage />);

    // 스피너는 data-testid="spinner"로 표시되어야 함
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("강의가 없을 때 빈 상태 메시지를 표시합니다", () => {
    // useQuery가 빈 배열과 isLoading=false를 반환하도록 설정
    (useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<LecturesPage />);

    // 빈 상태 메시지 텍스트 확인
    expect(screen.getByText("등록된 강의가 없습니다.")).toBeInTheDocument();
  });

  it("강의 목록을 렌더링합니다", () => {
    // useQuery가 mockLectures 데이터를 반환하도록 설정
    (useQuery as jest.Mock).mockReturnValue({
      data: mockLectures,
      isLoading: false,
      error: null,
    });

    render(<LecturesPage />);

    // LectureCard 모킹 컴포넌트가 2개 렌더링되는지 확인
    const lectureCards = screen.getAllByTestId("lecture-card");
    expect(lectureCards).toHaveLength(2);

    // 첫 번째 카드에 '강의 1' 텍스트가 있는지 확인
    expect(screen.getByText("강의 1")).toBeInTheDocument();
    // 두 번째 카드에 '강의 2' 텍스트가 있는지 확인
    expect(screen.getByText("강의 2")).toBeInTheDocument();
  });

  it("강의 삭제 성공 시 토스트 메시지를 표시합니다", async () => {
    // useQuery가 mockLectures 데이터를 반환하도록 설정
    (useQuery as jest.Mock).mockReturnValue({
      data: mockLectures,
      isLoading: false,
      error: null,
    });
    // deleteLecture가 성공(resolve)하도록 설정
    (deleteLecture as jest.Mock).mockResolvedValue(undefined);

    render(<LecturesPage />);

    // 첫 번째 LectureCard 클릭하여 상세 모달 열기
    fireEvent.click(screen.getAllByTestId("lecture-card")[0]);

    // 상세 모달이 열린 후, "Delete" 버튼 클릭 (form-delete)
    await waitFor(() => {
      const dialogs = screen.getAllByTestId("dialog");
      expect(dialogs[1]).toHaveAttribute("data-open", "true");
    });

    const deleteButton = screen.getByTestId("form-delete");
    fireEvent.click(deleteButton);

    // 삭제 성공 시 deleteLecture 호출 및 toast.success 호출 확인
    await waitFor(() => {
      expect(deleteLecture).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("강의가 삭제되었습니다.");
    });
  });

  it("강의 삭제 실패 시 에러 토스트 메시지를 표시합니다", async () => {
    // useQuery가 mockLectures 데이터를 반환하도록 설정
    (useQuery as jest.Mock).mockReturnValue({
      data: mockLectures,
      isLoading: false,
      error: null,
    });
    // deleteLecture가 실패(reject)하도록 설정
    (deleteLecture as jest.Mock).mockRejectedValue(new Error("삭제 실패"));

    render(<LecturesPage />);

    // 첫 번째 LectureCard 클릭하여 상세 모달 열기
    fireEvent.click(screen.getAllByTestId("lecture-card")[0]);

    // 상세 모달이 열린 후, "Delete" 버튼 클릭
    await waitFor(() => {
      const dialogs = screen.getAllByTestId("dialog");
      expect(dialogs[1]).toHaveAttribute("data-open", "true");
    });

    const deleteButton = screen.getByTestId("form-delete");
    fireEvent.click(deleteButton);

    // 삭제 실패 시 deleteLecture 호출 및 toast.error 호출 확인
    await waitFor(() => {
      expect(deleteLecture).toHaveBeenCalledWith(1);
      expect(toast.error).toHaveBeenCalledWith("강의 삭제에 실패했습니다.");
    });
  });
});
