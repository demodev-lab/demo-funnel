import { create } from "zustand";

interface ChallengeState {
  selectedChallengeId: string;
  setSelectedChallengeId: (id: string) => void;
}

export const useChallengeStore = create<ChallengeState>((set) => ({
  selectedChallengeId: "",
  setSelectedChallengeId: (id: string) => set({ selectedChallengeId: id }),
}));
