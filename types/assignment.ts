export interface SubmittedAssignment {
  assignmentComment: string;
  assignmentUrl: string;
  challengeLectureId: number;
  id: number;
  isSubmit: boolean;
  submittedAt: string;
  userId: number;
  imageUrl?: string;
}

export interface DashboardAssignmentStat {
  assignmentTitle: string;
  lectureId: number;
  lectureName: string;
  submissionRate: number;
  submittedCount: number;
  totalParticipants: number;
  sequence: number;
}
