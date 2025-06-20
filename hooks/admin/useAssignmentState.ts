import { useQuery } from "@tanstack/react-query";
import { DashboardAssignmentStat } from "@/types/assignment";
import { getAssignmentStats } from "@/apis/assignments";

export const useAssignmentState = (challengeId: number) => {
  return useQuery<DashboardAssignmentStat[]>({
    queryKey: ["challengeUsers", challengeId],
    queryFn: async () => {
      const data = await getAssignmentStats(challengeId);
      return data;
    },
    enabled: !!challengeId,
  });
};
