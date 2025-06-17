"use client";

import { Challenge, ChallengeFormData } from "@/types/challenge";
import { CHALLENGE_COLUMNS } from "@/constants/challenge";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import AddChallengeDialog from "./add-challenge-dialog";
import EditChallengeDialog from "./edit-challenge-dialog";
import InfoTable from "@/components/admin/info-table";
import { Button } from "@/components/ui/button";
import {
  ChallengesState,
  ChallengesStatus,
  ChallengesDialog,
  ChallengesActions,
} from "@/hooks/admin/useChallenges";

interface ChallengesContentProps {
  state: ChallengesState;
  status: ChallengesStatus;
  dialog: ChallengesDialog;
  actions: ChallengesActions;
}

export default function ChallengesContent({
  state,
  status,
  dialog,
  actions,
}: ChallengesContentProps) {
  if (status.isLoading) return <LoadingState />;
  if (status.error) return <ErrorState error={status.error} />;

  const renderActions = (challenge: Challenge) => (
    <>
      <Button
        onClick={() => actions.handleEditChallenge(challenge)}
        variant="ghost"
        className="h-8 w-8 p-0 mr-1 text-gray-400 hover:text-[#8C7DFF] hover:bg-[#1A1D29]/60"
      >
        <span className="sr-only">Edit</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
        </svg>
      </Button>
      <Button
        onClick={() => actions.handleDeleteChallenge(challenge.id)}
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-[#1A1D29]/60"
      >
        <span className="sr-only">Delete</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </Button>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddChallengeDialog
          isOpen={dialog.isAddDialogOpen}
          onOpenChange={dialog.setIsAddDialogOpen}
          newChallenge={state.newChallenge}
          onNewChallengeChange={(_, value) =>
            actions.setNewChallenge({ ...state.newChallenge, name: value })
          }
          onDateChange={actions.handleNewChallengeDateChange}
          onSubmit={actions.handleAddChallenge}
          isCreating={status.isCreating}
        />
      </div>

      <InfoTable
        columns={CHALLENGE_COLUMNS}
        data={state.challenges}
        isLoading={status.isLoading}
        error={status.error instanceof Error ? status.error : null}
        emptyMessage="등록된 챌린지가 없습니다."
        actions={renderActions}
      />

      <EditChallengeDialog
        isOpen={dialog.isEditDialogOpen}
        onOpenChange={dialog.setIsEditDialogOpen}
        challenge={state.editingChallenge}
        onChallengeChange={(_, value) =>
          actions.setEditingChallenge(
            state.editingChallenge
              ? { ...state.editingChallenge, name: value }
              : state.editingChallenge,
          )
        }
        onDateChange={actions.handleEditChallengeDateChange}
        onSubmit={actions.handleUpdateChallenge}
        isUpdating={status.isUpdating}
      />
    </div>
  );
}
