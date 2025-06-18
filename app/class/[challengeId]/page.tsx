import { getLecturesByChallenge } from "@/apis/lectures";
import ClassPage from "@/components/class/ClassPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Class({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const queryClient = new QueryClient();
  const { challengeId } = await params;
  const currentChallengeId = Number(challengeId);

  await queryClient.prefetchQuery({
    queryKey: ["challenge-lectures", currentChallengeId],
    queryFn: async () => {
      const data = await getLecturesByChallenge(currentChallengeId);
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClassPage params={{ challengeId }} />
    </HydrationBoundary>
  );
}
