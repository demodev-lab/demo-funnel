"use client";

import { TabsContent } from "@/components/common/tabs";
import SubmissionStats from "@/components/admin/dashboard/SubmissionStats";
import { useAssignmentState } from "@/hooks/admin/useAssignmentState";
import { useChallengeStore } from "@/lib/store/useChallengeStore";

export default function DashboardTabsContent() {
  const selectedChallengeId = useChallengeStore(
    (state) => state.selectedChallengeId,
  );

  const { data: currentAssignmentState = [] } =
    useAssignmentState(selectedChallengeId);

  return (
    <div className="p-6">
      <TabsContent value="submission">
        <SubmissionStats type="submission" data={currentAssignmentState} />
      </TabsContent>
    </div>
  );
}
