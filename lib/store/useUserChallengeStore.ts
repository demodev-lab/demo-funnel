import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserChallenge = {
  id: number;
  name: string;
};

interface UserChallengeState {
  selectedChallengeId: number;
  challengeList: UserChallenge[];
  setSelectedChallengeId: (id: number) => void;
  setChallengeList: (list: UserChallenge[]) => void;
}

export const useUserChallengeStore = create<UserChallengeState>()(
  persist(
    (set) => ({
      selectedChallengeId: 0,
      challengeList: [],
      setSelectedChallengeId: (id: number) => set({ selectedChallengeId: id }),
      setChallengeList: (list: UserChallenge[]) =>
        set({ challengeList: list }),
    }),
    {
      name: "user-challenge-store", // localStorage key
    }
  )
);
