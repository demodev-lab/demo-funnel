import { http, HttpResponse } from "msw";

interface Lecture {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  isLocked: boolean;
  duration: string;
  thumbnailUrl: string;
}

const lectures: Lecture[] = [
  {
    id: 1,
    title: "React 컴포넌트 최적화 기초",
    description: "React의 성능 최적화에 대한 기본 개념을 배웁니다.",
    videoUrl: "https://example.com/videos/react-optimization-basics",
    isLocked: false,
    duration: "15:30",
    thumbnailUrl: "https://example.com/thumbnails/react-optimization-basics.jpg",
  },
  {
    id: 2,
    title: "useMemo와 useCallback 활용하기",
    description: "React의 메모이제이션 훅을 활용한 최적화 방법을 배웁니다.",
    videoUrl: "https://example.com/videos/react-memoization",
    isLocked: true,
    duration: "20:15",
    thumbnailUrl: "https://example.com/thumbnails/react-memoization.jpg",
  },
  {
    id: 3,
    title: "React.memo로 불필요한 리렌더링 방지하기",
    description: "React.memo를 사용하여 컴포넌트의 불필요한 리렌더링을 방지하는 방법을 배웁니다.",
    videoUrl: "https://example.com/videos/react-memo",
    isLocked: true,
    duration: "18:45",
    thumbnailUrl: "https://example.com/thumbnails/react-memo.jpg",
  },
];

export const getLecturesHandler = http.get("/api/classroom/lectures", () => {
  return HttpResponse.json(lectures);
}); 