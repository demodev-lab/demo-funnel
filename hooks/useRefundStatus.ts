import { useQuery } from "@tanstack/react-query";
import { getUserAllAssignmentStatus } from "@/apis/users";
import { useParams } from "next/navigation";

export function useRefundStatus(userId: number, challengeLectures: any[]) {
  const params = useParams();
  const challengeId = Number(params.challengeId);

  const { data: allAssignmentStatus } = useQuery({
    queryKey: ["all-assignment-status", userId, challengeId],
    queryFn: async () => {
      if (!userId) {
        return { isAllSubmitted: false, submissions: [] };
      }
      const data = await getUserAllAssignmentStatus(
        userId,
        challengeId,
        challengeLectures,
      );
      return data;
    },
    enabled: !!userId,
  });

  return allAssignmentStatus?.isAllSubmitted ?? false;
}
