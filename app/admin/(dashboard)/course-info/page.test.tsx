import { render, screen } from "@testing-library/react";
import { useSearchParams } from "next/navigation";
import CourseInfoPage from "./page";

// Next.js의 useSearchParams를 모킹
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

// CourseInfoContainer 컴포넌트를 모킹
jest.mock("@/components/admin/course-info/CourseInfoContainer", () => {
  return function MockCourseInfoContainer() {
    return <div data-testid="course-info-container">CourseInfoContainer</div>;
  };
});

describe("CourseInfoPage", () => {
  beforeEach(() => {
    // 각 테스트 전에 모킹 초기화
    jest.clearAllMocks();
  });

  it("CourseInfoContainer를 렌더링해야 한다", () => {
    render(<CourseInfoPage />);

    expect(screen.getByTestId("course-info-container")).toBeInTheDocument();
  });

  it("올바른 CSS 클래스를 가진 컨테이너를 렌더링해야 한다", () => {
    render(<CourseInfoPage />);

    const container = screen.getByTestId("course-info-container").parentElement;
    expect(container).toHaveClass("space-y-4");
  });

  it("CourseInfoContainer가 페이지의 유일한 자식 요소여야 한다", () => {
    render(<CourseInfoPage />);

    const container = screen.getByTestId("course-info-container").parentElement;
    expect(container?.children).toHaveLength(1);
  });
});
