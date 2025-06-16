export interface userInfo {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface UserWithChallenges extends User {
  challenges?: number[];
}

export interface SubmissionStatus {
  lectureId: number;
  challengeLectureId: number;
  isSubmitted: boolean;
  dueDate: string;
  submissionId?: number;
  assignments?: {
    url: string;
    comment: string;
    imageUrl?: string;
  }[];
}

export interface StudentSubmission {
  userId: number;
  userName: string;
  userEmail: string;
  submissions: SubmissionStatus[];
}

export interface Student {
  id?: number;
  name: string;
  email: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}
