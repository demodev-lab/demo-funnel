export interface Challenge {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
  startDate?: Date;
  endDate?: Date;
  lectureCount?: number;
}

export type ChallengeFormData = Pick<
  Challenge,
  "name" | "open_date" | "close_date" | "lecture_num"
>;

export type UserChallenges = Pick<Challenge, "id" | "name">;

export interface ChallengeUser {
  challenge_id: number;
  Challenges: {
    id: number;
    open_date: string;
    close_date: string;
  };
}

export interface ChallengeOrder {
  challengeId: number;
  order: number;
}
