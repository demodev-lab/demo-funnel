export interface AdminLecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  upload_type: number;
  sequence: number;
  assignment_title?: string;
  assignment?: string;
}

export interface LectureData {
  id?: number;
  name: string;
  description: string;
  url: string;
  challenges: number[];
  assignmentTitle?: string;
  assignment?: string;
  challengeOrders?: { challengeId: number; order: number }[];
  file?: File;
  upload_type: number;
}

export interface ChallengeLectures {
  id: number;
  lecture_id: number;
  challenge_id: number;
  sequence: number;
  open_at: string;
  Lectures: {
    id: number;
    name: string;
    description: string;
    url: string;
    upload_type: number;
    created_at: string;
    updated_at: string;
    Assignments: Array<{
      title: string;
      contents: string;
    }>;
  };
}

export interface LectureDetail {
  id: number;
  name: string;
  description: string;
  url: string;
  upload_type: number;
  created_at: string;
  updated_at: string;
  Assignments: {
    id: number;
    title: string;
    contents: string;
  }[];
  ChallengeLectures: {
    id: number;
    sequence: number;
    Challenges: {
      id: number;
      name: string;
    };
  }[];
}

export interface LectureWithSequence {
  id: number;
  challenge_lecture_id: number;
  name: string;
  description: string;
  url: string;
  upload_type: number;
  open_at: string;
  created_at: string;
  updated_at: string;
  sequence: number;
  assignment_title: string;
  assignment: string;
  challenge_id: number;
  isLocked: boolean;
}

export interface LectureFormInitialData {
  name: string;
  description: string;
  url: string;
  assignmentTitle: string;
  assignment: string;
}

export interface LectureFormProps {
  onSuccess: () => void;
  isEdit?: boolean;
  initialData?: LectureFormInitialData;
  lectureId?: number;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export interface ChallengeLecture {
  id: number;
  lecture_id: number;
  Lectures: {
    id: number;
    name: string;
  };
}
