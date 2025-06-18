"use client";

import { useChallenges } from "@/hooks/admin/useChallenges";
import ChallengesContent from "@/components/admin/challenges/challengesContent";

export default function ChallengesPage() {
  const { state, status, dialog, actions } = useChallenges();

  return (
    <ChallengesContent
      state={state}
      status={status}
      dialog={dialog}
      actions={actions}
    />
  );
}
