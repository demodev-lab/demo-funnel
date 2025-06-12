// components/admin/student-list.test.tsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentList from "../../../../components/admin/student-list";

// 훅 및 스토어 모킹
import {
  useStudentsByChallenge,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/hooks/useStudents";
import { useChallengeStore } from "@/lib/store/useChallengeStore";

// useQuery 모킹: 챌린지 목록 조회용
import * as ReactQuery from "@tanstack/react-query";

// Jest 모킹 설정
jest.mock("@/hooks/useStudents");
jest.mock("@/lib/store/useChallengeStore");
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: jest.fn(),
  };
});
// getUserChallenges 모킹: 항상 [dummyChallengeId] 반환 (id만 반환)
jest.mock("@/apis/challenges", () => ({
  getUserChallenges: jest.fn().mockResolvedValue([42]),
}));

describe("StudentList 컴포넌트", () => {
  let queryClient: QueryClient;

  // 각 모킹 함수 참조
  const mockUseStudentsByChallenge = useStudentsByChallenge as jest.Mock;
  const mockUseCreateStudent = useCreateStudent as jest.Mock;
  const mockUseUpdateStudent = useUpdateStudent as jest.Mock;
  const mockUseDeleteStudent = useDeleteStudent as jest.Mock;
  const mockUseChallengeStore = useChallengeStore as unknown as jest.Mock;
  const mockUseQuery = ReactQuery.useQuery as unknown as jest.Mock;

  // 기본 목업 데이터
  const dummyChallengeId = 42;
  const dummyChallenges = [
    { id: 1, name: "2025년 1기" },
    { id: 2, name: "챌린지 B" },
  ];

  const dummyStudents = [
    {
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-2222",
    },
    { id: 2, name: "김철수", email: "kim@example.com", phone: "010-3333-4444" },
  ];

  // 각 테스트 전 초기화
  beforeEach(() => {
    queryClient = new QueryClient();
    // store: selectedChallengeId를 항상 dummyChallengeId로 반환
    mockUseChallengeStore.mockReturnValue({
      selectedChallengeId: dummyChallengeId,
    });

    // useStudentsByChallenge: 기본적으로 정상적으로 학생 목록 반환
    mockUseStudentsByChallenge.mockReturnValue({
      data: {
        pages: [
          {
            data: dummyStudents,
            total: dummyStudents.length,
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    // create/update/delete 훅: mutateAsync은 jest.fn()
    mockUseCreateStudent.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    mockUseUpdateStudent.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    });
    mockUseDeleteStudent.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue(undefined),
      isPending: false,
    });

    // useQuery: 챌린지 목록 조회. 기본적으로 dummyChallenges 반환
    mockUseQuery.mockReturnValue({
      data: dummyChallenges,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  function renderWithClient() {
    return render(
      <QueryClientProvider client={queryClient}>
        <StudentList />
      </QueryClientProvider>,
    );
  }

  it("로딩 상태인 경우 로더와 메시지가 보입니다", () => {
    mockUseStudentsByChallenge.mockReturnValue({
      data: { pages: [] },
      isLoading: true,
      isError: false,
      error: null,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    renderWithClient();

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.getByText("학생 목록을 불러오는 중...")).toBeInTheDocument();
  });

  it("에러 상태인 경우 에러 메시지와 새로고침 버튼이 보입니다", () => {
    mockUseStudentsByChallenge.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      isError: true,
      error: new Error("불러오기 실패"),
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: jest.fn(),
    });

    renderWithClient();

    expect(screen.getByText("오류가 발생했습니다")).toBeInTheDocument();
    expect(screen.getByText("불러오기 실패")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /페이지 새로고침/i }),
    ).toBeInTheDocument();
  });

  it("학생 목록이 테이블에 렌더링됩니다", () => {
    // 기본 dummyStudents 반환 중
    renderWithClient();

    dummyStudents.forEach((student) => {
      expect(screen.getByText(student.name)).toBeInTheDocument();
      expect(screen.getByText(student.email)).toBeInTheDocument();
      expect(screen.getByText(student.phone)).toBeInTheDocument();
    });

    // 각 학생마다 Edit, Delete 버튼이 렌더링되어 있어야 함
    const editButtons = screen.getAllByRole("button", { name: /Edit/i });
    const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
    expect(editButtons.length).toBe(dummyStudents.length);
    expect(deleteButtons.length).toBe(dummyStudents.length);
  });

  describe("수강생 추가 다이얼로그", () => {
    it("다이얼로그를 열고 닫을 수 있습니다", async () => {
      renderWithClient();

      // '수강생 추가' 버튼 클릭하여 다이얼로그 열기
      const addBtn = screen.getByRole("button", { name: /수강생 추가/i });
      userEvent.click(addBtn);

      // 다이얼로그 제목이 '수강생 추가'인지 확인
      expect(await screen.findByText("수강생 추가")).toBeInTheDocument();

      // 다이얼로그 내 input 요소들
      expect(screen.getByText("이름")).toBeInTheDocument();
      expect(screen.getByText("이메일")).toBeInTheDocument();
      expect(screen.getByText("전화번호")).toBeInTheDocument();

      expect(
        await screen.findByRole("button", { name: /추가하기/i }),
      ).toBeInTheDocument();

      // 다이얼로그 닫기: 외부 클릭 대신 ESC 혹은 onOpenChange 호출
      // 여기서는 DialogTrigger의 역할이므로, 클로즈 버튼 없이 ESC 이벤트로 닫기
      fireEvent.keyDown(document.activeElement || document.body, {
        key: "Escape",
      });

      await waitFor(() => {
        // 다이얼로그가 닫히면 제목이 더 이상 보이지 않아야 함
        expect(
          screen.queryByTestId("student-form-dialog"),
        ).not.toBeInTheDocument();
      });
    });

    it("빈 입력 시 유효성 에러가 나타납니다", async () => {
      renderWithClient();

      // 다이얼로그 열기
      const addBtn = screen.getByRole("button", { name: /수강생 추가/i });
      userEvent.click(addBtn);

      // 추가하기 버튼 클릭 (빈 입력 상태) - 이름 에러 발생
      const submitBtn = await screen.findByRole("button", {
        name: /추가하기/i,
      });
      userEvent.click(submitBtn);
      expect(
        await screen.findByText("이름을 입력해주세요."),
      ).toBeInTheDocument();

      // 이름 채운 후 그 다음 이메일 필수 에러
      userEvent.type(screen.getByLabelText(/이름/), "테스트");
      userEvent.click(submitBtn);
      expect(
        await screen.findByText("이메일을 입력해주세요."),
      ).toBeInTheDocument();

      // 이름만 채운 상태에서 잘못된 이메일 형식 에러
      await userEvent.clear(screen.getByLabelText(/이메일/));
      await userEvent.type(screen.getByLabelText(/이메일/), "invalidEmail");
      await userEvent.click(submitBtn);

      await waitFor(() => {
        expect(
          screen.getByText("올바른 이메일 형식을 입력해주세요."),
        ).toBeInTheDocument();
      });
    });

    it("올바른 입력 후 생성 요청을 보냅니다", async () => {
      // create 훅 모킹: mutateAsync 호출 추적
      const mockCreate = jest.fn().mockResolvedValue(undefined);
      mockUseCreateStudent.mockReturnValue({
        mutateAsync: mockCreate,
        isPending: false,
      });

      renderWithClient();

      // 다이얼로그 열기
      const addBtn = screen.getByRole("button", { name: /수강생 추가/i });
      await userEvent.click(addBtn);

      // 폼이 렌더링될 때까지 대기
      await waitFor(() => {
        expect(screen.getByLabelText(/이름/)).toBeInTheDocument();
      });

      // 필수 입력 채우기 - 각 입력마다 waitFor 사용
      await waitFor(async () => {
        await userEvent.type(screen.getByLabelText(/이름/), "새학생");
      });

      await waitFor(async () => {
        await userEvent.type(
          screen.getByLabelText(/이메일/),
          "new@example.com",
        );
      });

      await waitFor(async () => {
        await userEvent.type(
          screen.getByLabelText(/전화번호/),
          "010-5555-6666",
        );
      });

      // '추가하기' 클릭
      const submitBtn = screen.getByRole("button", { name: /추가하기/i });
      await userEvent.click(submitBtn);

      // 요청이 전송되었는지 확인
      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          name: "새학생",
          email: "new@example.com",
          phone: "010-5555-6666",
          challenges: [],
        });
      });
    });
  });

  describe("학생 정보 수정", () => {
    it("Edit 버튼 클릭 후 다이얼로그가 열리고 Update 요청이 전송됩니다", async () => {
      // update 훅 모킹
      const mockUpdate = jest.fn().mockResolvedValue(undefined);
      mockUseUpdateStudent.mockReturnValue({
        mutateAsync: mockUpdate,
        isPending: false,
      });

      renderWithClient();

      // 첫 번째 학생 행의 Edit 아이콘(버튼) 클릭
      const editButtons = screen.getAllByRole("button", { name: /Edit/i });
      await userEvent.click(editButtons[0]);

      // 다이얼로그 제목이 '수강생 수정'으로 변경되어야 함
      await waitFor(() => {
        expect(screen.getByText("수강생 수정")).toBeInTheDocument();
      });

      // 필드가 제대로 채워져 있는지 확인
      await waitFor(() => {
        expect((screen.getByLabelText(/이름/i) as HTMLInputElement).value).toBe(
          dummyStudents[0].name,
        );
      });

      // 입력 값 수정
      await userEvent.clear(screen.getByLabelText(/이름/i));
      await userEvent.type(screen.getByLabelText(/이름/i), "홍길자");

      // '수정하기' 버튼 클릭
      const updateBtn = screen.getByRole("button", { name: /수정하기/i });
      await userEvent.click(updateBtn);

      // 요청이 전송되었는지 확인
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({
          id: dummyStudents[0].id,
          name: "홍길자",
          email: dummyStudents[0].email,
          phone: dummyStudents[0].phone,
          challenges: [],
        });
      });
    });
  });

  describe("학생 삭제", () => {
    it("Delete 버튼 클릭 후 확인하고 삭제 요청을 보냅니다", async () => {
      // delete 훅 모킹
      const mockDelete = jest.fn().mockResolvedValue(undefined);
      mockUseDeleteStudent.mockReturnValue({
        mutateAsync: mockDelete,
        isPending: false,
      });

      renderWithClient();

      // 첫 번째 학생의 Delete 버튼 클릭
      const deleteButtons = screen.getAllByRole("button", { name: /Delete/i });
      userEvent.click(deleteButtons[0]);

      // 삭제 확인 다이얼로그가 열려야 함
      const deleteDialogTitle = await screen.findByText("수강생 삭제");
      expect(deleteDialogTitle).toBeInTheDocument();
      expect(
        screen.getByText("정말로 이 수강생을 삭제하시겠습니까?"),
      ).toBeInTheDocument();

      // '삭제' 버튼 클릭
      const confirmBtn = screen.getByRole("button", { name: /삭제$/i }); // 끝 단어가 '삭제'
      userEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith(dummyStudents[0].id);
      });

      // 모달이 닫혀야 함
      await waitFor(() => {
        expect(screen.queryByText("수강생 삭제")).not.toBeInTheDocument();
      });
    });
  });
});
