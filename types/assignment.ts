export interface SubmittedAssignment {
  assignment_comment: string;
  assignment_url: string;
  challenge_lecture_id: number;
  id: number;
  is_submit: boolean;
  submitted_at: string;
  user_id: number;
}

export interface DashboardAssignmentStat {
  assignmentTitle: string;
  lectureId: number;
  lectureName: string;
  submissionRate: number;
  submittedCount: number;
  totalParticipants: number;
}