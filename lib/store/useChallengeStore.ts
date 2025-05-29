import { create } from "zustand";

interface ChallengeState {
  selectedChallengeId: number;
  setSelectedChallengeId: (id: number) => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  selectedChallengeId: 0,
  setSelectedChallengeId: (id: number) => set({ selectedChallengeId: id }),
}));
