import { render, screen, fireEvent } from "@testing-library/react";
import CourseInfoPage from "./page";

// Mock components
jest.mock("@/components/ui/page-title", () => {
  return function MockPageTitle({ title }: { title: string }) {
    return <h1>{title}</h1>;
  };
});

jest.mock("@/components/admin/course-info/search-filter", () => {
  return function MockSearchFilter({
    searchQuery,
    onSearchChange,
    showUnsubmittedOnly,
    onUnsubmittedChange,
  }: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    showUnsubmittedOnly: boolean;
    onUnsubmittedChange: (value: boolean) => void;
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
          data-testid="unsubmitted-checkbox"
          checked={showUnsubmittedOnly}
          onChange={(e) => onUnsubmittedChange(e.target.checked)}
        />
      </div>
    );
  };
});

jest.mock("@/components/admin/course-info/main-content", () => {
  return function MockMainContent({
    searchQuery,
    showUnsubmittedOnly,
  }: {
    searchQuery: string;
    showUnsubmittedOnly: boolean;
  }) {
    return (
      <div>
        <div data-testid="passed-search-query">{searchQuery}</div>
        <div data-testid="passed-show-unsubmitted">
          {showUnsubmittedOnly.toString()}
        </div>
      </div>
    );
  };
});

describe("CourseInfoPage", () => {
  it("renders page title correctly", () => {
    render(<CourseInfoPage />);
    expect(screen.getByText("수강 정보 관리")).toBeInTheDocument();
  });

  it("updates searchQuery when input value changes", () => {
    render(<CourseInfoPage />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "React" } });

    const passedSearchQuery = screen.getByTestId("passed-search-query");
    expect(passedSearchQuery).toHaveTextContent("React");
  });

  it("toggles showUnsubmittedOnly when checkbox is clicked", () => {
    render(<CourseInfoPage />);

    const checkbox = screen.getByTestId("unsubmitted-checkbox");
    const passedShowUnsubmitted = screen.getByTestId("passed-show-unsubmitted");

    // 초기값 확인
    expect(passedShowUnsubmitted).toHaveTextContent("false");

    // 체크박스 클릭
    fireEvent.click(checkbox);
    expect(passedShowUnsubmitted).toHaveTextContent("true");

    // 다시 클릭
    fireEvent.click(checkbox);
    expect(passedShowUnsubmitted).toHaveTextContent("false");
  });

  it("passes correct props to MainContent", () => {
    render(<CourseInfoPage />);

    // 초기값 확인
    expect(screen.getByTestId("passed-search-query")).toHaveTextContent("");
    expect(screen.getByTestId("passed-show-unsubmitted")).toHaveTextContent(
      "false",
    );

    // 검색어 입력
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "React" } });

    // 체크박스 클릭
    const checkbox = screen.getByTestId("unsubmitted-checkbox");
    fireEvent.click(checkbox);

    // 최종 상태 확인
    expect(screen.getByTestId("passed-search-query")).toHaveTextContent(
      "React",
    );
    expect(screen.getByTestId("passed-show-unsubmitted")).toHaveTextContent(
      "true",
    );
  });
});
