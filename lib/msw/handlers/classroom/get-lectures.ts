import { http, HttpResponse } from "msw";

interface Lecture {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  createdAt: string;
  locked: boolean;
}

const lectures: Lecture[] = [
  {
    id: 1,
    title: "피그마 MCP로 디자인 딸깍 가능?",
    description: "피그마 MCP로 디자인 딸깍 가능?",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: false,
  },
  {
    id: 2,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=LzsB2AJI90s",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: false,
  },
  {
    id: 3,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=Q4YV_bWrSkg",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
  {
    id: 4,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
  {
    id: 5,
    title: "React 기초 강의",
    description: "React의 기본 개념과 사용법을 배웁니다.",
    videoUrl: "https://www.youtube.com/watch?v=H-yo6dzJ13g",
    duration: "2시간 30분",
    createdAt: "2024-03-15",
    locked: true,
  },
];

export const getLecturesHandler = http.get("/api/classroom/lectures", () => {
  return HttpResponse.json(lectures);
}); 