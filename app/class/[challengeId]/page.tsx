import { getLecturesByChallenge } from "@/apis/lectures";
import ClassPage from "@/components/class/ClassPage";
import { findTodayLectureIndex } from '@/utils/date/serverTime';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

export default async function Class({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const queryClient = new QueryClient();
  const { challengeId } = await params;
  const currentChallengeId = Number(challengeId);

  if (isNaN(currentChallengeId)) {
    notFound();
  }

  const lectures = await getLecturesByChallenge(currentChallengeId);

  // 오늘 강의 찾기
  const todayIndex = await findTodayLectureIndex(lectures);
  const initialLecture = todayIndex !== -1 ? lectures[todayIndex] : lectures[0];

  await queryClient.prefetchQuery({
    queryKey: ["challenge-lectures", currentChallengeId],
    queryFn: () => lectures,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClassPage currentChallengeId={currentChallengeId} initialLecture={initialLecture} />
    </HydrationBoundary>
  );
}

// 정적 페이지 생성 설정
export const revalidate = 300; // 5분마다 재검증
