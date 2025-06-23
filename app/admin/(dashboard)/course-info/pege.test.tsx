import { render, screen, fireEvent } from "@testing-library/react";
import CourseInfoPage from "./page";

// Mock components
jest.mock("@/components/common/page-title", () => {
  return function MockPageTitle() {
    return null; // 테스트에서는 PageTitle 렌더링하지 않음
  };
});

jest.mock("@/components/admin/course-info/SearchFilter", () => {
  return function MockSearchFilter({
    searchQuery,
    onSearchChange,
    showCompletedOnly,
    onCompletedChange,
  }: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    showCompletedOnly: boolean;
    onCompletedChange: (value: boolean) => void;
  }) {
    return (
      <div>
        <input
          type="text"
          data-testid="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <input
          type="checkbox"
          data-testid="completed-checkbox"
          checked={showCompletedOnly}
          onChange={(e) => onCompletedChange(e.target.checked)}
        />
      </div>
    );
  };
});

jest.mock("@/components/admin/course-info/CourseInfoTable", () => {
  return function MockMainContent({
    searchQuery,
    showCompletedOnly,
  }: {
    searchQuery: string;
    showCompletedOnly: boolean;
  }) {
    return (
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <div>
          <div data-testid="passed-search-query">{searchQuery}</div>
          <div data-testid="passed-show-completed">
            {showCompletedOnly.toString()}
          </div>
        </div>
      </div>
    );
  };
});

describe("CourseInfoPage", () => {
  it("초기 상태가 올바르게 설정되어 있다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    expect(screen.getByTestId("passed-search-query")).toHaveTextContent("");
    expect(screen.getByTestId("passed-show-completed")).toHaveTextContent(
      "false",
    );
  });

  it("검색어 입력 시 검색 쿼리가 업데이트된다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "React" } });

    const passedSearchQuery = screen.getByTestId("passed-search-query");
    expect(passedSearchQuery).toHaveTextContent("React");
  });

  it("완료 여부 체크박스 토글이 정상 동작한다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    const checkbox = screen.getByTestId("completed-checkbox");
    const passedShowCompleted = screen.getByTestId("passed-show-completed");

    // 초기값 확인
    expect(passedShowCompleted).toHaveTextContent("false");

    // 체크박스 클릭
    fireEvent.click(checkbox);
    expect(passedShowCompleted).toHaveTextContent("true");

    // 다시 클릭
    fireEvent.click(checkbox);
    expect(passedShowCompleted).toHaveTextContent("false");
  });

  it("검색과 필터링이 함께 동작한다", () => {
    render(<CourseInfoPage searchParams={{}} />);

    // 검색어 입력
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "React" } });

    // 체크박스 클릭
    const checkbox = screen.getByTestId("completed-checkbox");
    fireEvent.click(checkbox);

    // 최종 상태 확인
    expect(screen.getByTestId("passed-search-query")).toHaveTextContent(
      "React",
    );
    expect(screen.getByTestId("passed-show-completed")).toHaveTextContent(
      "true",
    );
  });
});
