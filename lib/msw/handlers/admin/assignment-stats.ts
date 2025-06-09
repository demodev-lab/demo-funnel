import { http, HttpResponse } from "msw";
import { DashboardAssignmentStat } from "@/types/assignment";

const mockDataByChallengeId: Record<number, DashboardAssignmentStat[]> = {
  1: [
    {
      assignmentTitle: "React 기초 과제",
      lectureId: 1,
      lectureName: "React 기초",
      submissionRate: 75,
      submittedCount: 15,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "TypeScript 실습",
      lectureId: 2,
      lectureName: "TypeScript",
      submissionRate: 60,
      submittedCount: 12,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "Next.js 프로젝트",
      lectureId: 3,
      lectureName: "Next.js",
      submissionRate: 85,
      submittedCount: 17,
      totalParticipants: 20,
    },
  ],
  2: [
    {
      assignmentTitle: "React 심화 과제",
      lectureId: 1,
      lectureName: "React 심화",
      submissionRate: 85,
      submittedCount: 17,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "TypeScript 고급 실습",
      lectureId: 2,
      lectureName: "TypeScript 고급",
      submissionRate: 70,
      submittedCount: 14,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "Next.js 실전 프로젝트",
      lectureId: 3,
      lectureName: "Next.js 실전",
      submissionRate: 90,
      submittedCount: 18,
      totalParticipants: 20,
    },
  ],
  3: [
    {
      assignmentTitle: "React 상태관리",
      lectureId: 1,
      lectureName: "React 상태관리",
      submissionRate: 95,
      submittedCount: 19,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "TypeScript 유틸리티 타입",
      lectureId: 2,
      lectureName: "TypeScript 유틸리티",
      submissionRate: 80,
      submittedCount: 16,
      totalParticipants: 20,
    },
    {
      assignmentTitle: "Next.js 서버 컴포넌트",
      lectureId: 3,
      lectureName: "Next.js 서버",
      submissionRate: 88,
      submittedCount: 17,
      totalParticipants: 20,
    },
  ],
};

export const assignmentStatsHandlers = [
  http.get("/api/admin/assignments/stats/:challengeId", ({ params }) => {
    const challengeId = Number(params.challengeId);
    const mockData = mockDataByChallengeId[challengeId] || mockDataByChallengeId[1];
    return HttpResponse.json(mockData);
  }),
]; 