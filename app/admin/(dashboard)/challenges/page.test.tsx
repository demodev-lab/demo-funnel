import { render, screen, fireEvent } from "@testing-library/react";
import ChallengesPage from "./page";
import { useChallenges } from "@/hooks/admin/useChallenges";
import { Challenge } from "@/types/challenge";

// 모든 컴포넌트 모킹
jest.mock("@/components/admin/challenges/LoadingState", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-state">Loading...</div>,
}));

jest.mock("@/components/admin/challenges/ErrorState", () => ({
  __esModule: true,
  default: ({ error }: { error: Error }) => (
    <div data-testid="error-state">{error.message}</div>
  ),
}));

jest.mock("@/components/admin/InfoTable", () => ({
  __esModule: true,
  default: ({
    data,
    actions,
  }: {
    data: Challenge[];
    actions: (item: Challenge) => React.ReactNode;
  }) => (
    <div data-testid="info-table">
      {data.map((item) => (
        <div key={item.id} data-testid="challenge-row">
          <button
            onClick={() => {
              const actionsElement = actions(item);
              // actions 함수가 반환하는 JSX에서 첫 번째 버튼(Edit)을 클릭
              const editButton = (actionsElement as any).props.children[0];
              editButton.props.onClick();
            }}
            aria-label="Edit"
            data-testid="edit-button"
          >
            Edit
          </button>
          <button
            onClick={() => {
              const actionsElement = actions(item);
              // actions 함수가 반환하는 JSX에서 두 번째 버튼(Delete)을 클릭
              const deleteButton = (actionsElement as any).props.children[1];
              deleteButton.props.onClick();
            }}
            aria-label="Delete"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/admin/challenges/AddChallengeDialog", () => ({
  __esModule: true,
  default: ({
    onSubmit,
    isOpen,
    onOpenChange,
  }: {
    onSubmit: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div
      data-testid="add-challenge-dialog"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <button onClick={onSubmit} data-testid="add-submit-button">
        Submit
      </button>
    </div>
  ),
}));

jest.mock("@/components/admin/challenges/EditChallengeDialog", () => ({
  __esModule: true,
  default: ({
    onSubmit,
    isOpen,
    onOpenChange,
  }: {
    onSubmit: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div
      data-testid="edit-challenge-dialog"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <button onClick={onSubmit} data-testid="edit-submit-button">
        Submit
      </button>
    </div>
  ),
}));

jest.mock("@/components/common/PageTitle", () => ({
  __esModule: true,
  default: () => null,
}));

// useChallenges 훅 모킹
jest.mock("@/hooks/admin/useChallenges");

describe("ChallengesPage", () => {
  // 기본 모킹 데이터
  const mockChallenges = [
    { id: 1, name: "Challenge 1" },
    { id: 2, name: "Challenge 2" },
  ] as Challenge[];

  const mockActions = {
    handleEditChallenge: jest.fn(),
    handleDeleteChallenge: jest.fn(),
    handleAddChallenge: jest.fn(),
    handleUpdateChallenge: jest.fn(),
    setNewChallenge: jest.fn(),
    setEditingChallenge: jest.fn(),
    handleNewChallengeDateChange: jest.fn(),
    handleEditChallengeDateChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("로딩 상태일 때 LoadingState를 렌더링한다", () => {
    (useChallenges as jest.Mock).mockReturnValue({
      state: { challenges: [], newChallenge: null, editingChallenge: null },
      status: {
        isLoading: true,
        error: null,
        isCreating: false,
        isUpdating: false,
      },
      dialog: { isAddDialogOpen: false, isEditDialogOpen: false },
      actions: mockActions,
    });

    render(<ChallengesPage />);
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("에러 상태일 때 ErrorState를 렌더링한다", () => {
    const error = new Error("테스트 에러");
    (useChallenges as jest.Mock).mockReturnValue({
      state: { challenges: [], newChallenge: null, editingChallenge: null },
      status: { isLoading: false, error, isCreating: false, isUpdating: false },
      dialog: { isAddDialogOpen: false, isEditDialogOpen: false },
      actions: mockActions,
    });

    render(<ChallengesPage />);
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByText("테스트 에러")).toBeInTheDocument();
  });

  describe("정상 상태일 때", () => {
    beforeEach(() => {
      (useChallenges as jest.Mock).mockReturnValue({
        state: {
          challenges: mockChallenges,
          newChallenge: null,
          editingChallenge: null,
        },
        status: {
          isLoading: false,
          error: null,
          isCreating: false,
          isUpdating: false,
        },
        dialog: { isAddDialogOpen: false, isEditDialogOpen: false },
        actions: mockActions,
      });
    });

    it("챌린지 목록이 올바르게 표시된다", () => {
      render(<ChallengesPage />);
      const challengeRows = screen.getAllByTestId("challenge-row");
      expect(challengeRows).toHaveLength(mockChallenges.length);
    });

    it("수정 버튼 클릭 시 handleEditChallenge가 호출된다", () => {
      render(<ChallengesPage />);
      const editButtons = screen.getAllByTestId("edit-button");
      fireEvent.click(editButtons[0]);
      expect(mockActions.handleEditChallenge).toHaveBeenCalledWith(
        mockChallenges[0],
      );
    });

    it("삭제 버튼 클릭 시 handleDeleteChallenge가 호출된다", () => {
      render(<ChallengesPage />);
      const deleteButtons = screen.getAllByTestId("delete-button");
      fireEvent.click(deleteButtons[0]);
      expect(mockActions.handleDeleteChallenge).toHaveBeenCalledWith(
        mockChallenges[0].id,
      );
    });
  });

  describe("Dialog 동작 테스트", () => {
    it("AddChallengeDialog 제출 시 handleAddChallenge가 호출된다", () => {
      (useChallenges as jest.Mock).mockReturnValue({
        state: {
          challenges: mockChallenges,
          newChallenge: null,
          editingChallenge: null,
        },
        status: {
          isLoading: false,
          error: null,
          isCreating: false,
          isUpdating: false,
        },
        dialog: { isAddDialogOpen: true, isEditDialogOpen: false },
        actions: mockActions,
      });

      render(<ChallengesPage />);
      const submitButton = screen.getByTestId("add-submit-button");
      fireEvent.click(submitButton);
      expect(mockActions.handleAddChallenge).toHaveBeenCalled();
    });

    it("EditChallengeDialog 제출 시 handleUpdateChallenge가 호출된다", () => {
      (useChallenges as jest.Mock).mockReturnValue({
        state: {
          challenges: mockChallenges,
          newChallenge: null,
          editingChallenge: mockChallenges[0],
        },
        status: {
          isLoading: false,
          error: null,
          isCreating: false,
          isUpdating: false,
        },
        dialog: { isAddDialogOpen: false, isEditDialogOpen: true },
        actions: mockActions,
      });

      render(<ChallengesPage />);
      const submitButton = screen.getByTestId("edit-submit-button");
      fireEvent.click(submitButton);
      expect(mockActions.handleUpdateChallenge).toHaveBeenCalled();
    });
  });
});
