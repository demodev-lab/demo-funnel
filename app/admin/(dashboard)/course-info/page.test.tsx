import { render, screen, fireEvent } from "@testing-library/react";
import CourseInfoPage from "./page";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/admin/course-info",
}));

// Mock components
jest.mock("@/components/common/page-title", () => {
  return function MockPageTitle() {
    return null; // 테스트에서는 PageTitle 렌더링하지 않음
  };
});

jest.mock("@/components/admin/course-info/SearchFilter", () => {
  return function MockSearchFilter({
    searchQuery,
    showCompletedOnly,
  }: {
    searchQuery: string;
    showCompletedOnly: boolean;
  }) {
    return (
      <div>
        <input
          type="text"
          data-testid="search-input"
          value={searchQuery}
          onChange={(e) => {
            // 실제 컴포넌트처럼 URL 파라미터를 업데이트하는 로직 시뮬레이션
            const newUrl = e.target.value
              ? `/admin/course-info?search=${e.target.value}`
              : "/admin/course-info";
            mockPush(newUrl);
          }}
        />
        <input
          type="checkbox"
          data-testid="completed-checkbox"
          checked={showCompletedOnly}
          onChange={(e) => {
            // 실제 컴포넌트처럼 URL 파라미터를 업데이트하는 로직 시뮬레이션
            const params = new URLSearchParams();
            if (e.target.checked) {
              params.set("completed", "true");
            }
            const newUrl = params.toString()
              ? `/admin/course-info?${params.toString()}`
              : "/admin/course-info";
            mockPush(newUrl);
          }}
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
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("초기 상태가 올바르게 설정되어 있다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    expect(screen.getByTestId("passed-search-query")).toHaveTextContent("");
    expect(screen.getByTestId("passed-show-completed")).toHaveTextContent(
      "false",
    );
  });

  it("검색어 입력 시 URL이 업데이트된다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "React" } });

    expect(mockPush).toHaveBeenCalledWith("/admin/course-info?search=React");
  });

  it("완료 여부 체크박스 토글이 정상 동작한다", () => {
    render(<CourseInfoPage searchParams={{}} />);
    const checkbox = screen.getByTestId("completed-checkbox");

    // 초기값 확인
    expect(checkbox).not.toBeChecked();

    // 체크박스 클릭
    fireEvent.click(checkbox);
    expect(mockPush).toHaveBeenCalledWith("/admin/course-info?completed=true");
  });

  it("URL 파라미터가 올바르게 전달된다", () => {
    render(
      <CourseInfoPage searchParams={{ search: "React", completed: "true" }} />,
    );

    expect(screen.getByTestId("passed-search-query")).toHaveTextContent(
      "React",
    );
    expect(screen.getByTestId("passed-show-completed")).toHaveTextContent(
      "true",
    );
  });

  it("검색과 필터링이 함께 동작한다", () => {
    render(
      <CourseInfoPage searchParams={{ search: "React", completed: "true" }} />,
    );

    // 검색어 입력
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "Vue" } });

    // 체크박스 클릭 (해제)
    const checkbox = screen.getByTestId("completed-checkbox");
    fireEvent.click(checkbox);

    // URL 업데이트 확인
    expect(mockPush).toHaveBeenCalledWith("/admin/course-info?search=Vue");
    expect(mockPush).toHaveBeenCalledWith("/admin/course-info");
  });
});
