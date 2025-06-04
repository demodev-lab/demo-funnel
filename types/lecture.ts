export interface Lecture {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: string;
  challenge_lecture_id: number;
  open_at: string;
  challenge_id: string;
}

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
  lecture_id: number;
  sequence: number;
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
  name: string;
  description: string;
  url: string;
  upload_type: number;
  created_at: string;
  updated_at: string;
  sequence: number;
  assignment_title: string;
  assignment: string;
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
