export interface Challenge {
  id: number;
  name: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
  created_at?: string;
  updated_at?: string;
  startDate?: Date;
  endDate?: Date;
  lectureCount?: number;
}

export interface ChallengeFormData {
  name: string;
  open_date: string;
  close_date: string;
  lecture_num: number;
}
