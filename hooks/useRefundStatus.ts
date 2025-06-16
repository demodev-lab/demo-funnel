import { useQuery } from "@tanstack/react-query";
import { getUserAllAssignmentStatus } from "@/apis/users";
import { useParams } from "next/navigation";

// TODO: 타입 분리
interface ChallengeLecture {
  id: number;
  lecture_id: number;
}

export function useRefundStatus(
  userId: number,
  challengeLectures: ChallengeLecture[],
) {
  const params = useParams();
  const challengeId = Number(params.challengeId);

  const isQueryReady = (() => {
    if (!userId || isNaN(userId)) return false;
    if (!challengeId) return false;
    if (!challengeLectures?.length) return false;
    return true;
  })();

  const { data: allAssignmentStatus, error } = useQuery<{
    isAllSubmitted: boolean;
    submissions: any[];
  }>({
    queryKey: [
      "all-assignment-status",
      userId,
      challengeId,
      challengeLectures.map((lecture) => lecture.id),
    ],
    queryFn: async () => {
      try {
        const data = await getUserAllAssignmentStatus(
          userId,
          challengeId,
          challengeLectures,
        );
        return data;
      } catch (error) {
        // TODO: 에러 핸들링
        console.error(error, "Failed to fetch assignment status:");
        throw error;
      }
    },
    enabled: isQueryReady,
  });

  return allAssignmentStatus?.isAllSubmitted ?? false;
}
