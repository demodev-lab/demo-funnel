export interface Challenge {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  openDate: string;
  closeDate: string;
  lectureNum: number;
}

export type ChallengeFormData = Pick<
  Challenge,
  "name" | "openDate" | "closeDate" | "lectureNum"
>;

export type UserChallenges = Pick<Challenge, "id" | "name">;

export interface ChallengeUser {
  challengeId: number;
  Challenges: {
    id: number;
    openDate: string;
    closeDate: string;
  };
}

export interface ChallengeOrder {
  challengeId: number;
  order: number;
}
