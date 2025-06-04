import { Lecture } from '@/types/lecture';
import { create } from 'zustand';

interface SelectedLectureState {
  lectureId: number;
  challengeLectureId: number;
  open_at: string;
  setSelectedLecture: (selectedLecture: Lecture) => void;
}

export const useSelectedLectureStore = create<SelectedLectureState>(set => ({
  lectureId: 0,
  challengeLectureId: 0,
  open_at: "",
  setSelectedLecture: (selectedLecture: Lecture) => set({
    lectureId: selectedLecture.id,
    challengeLectureId: selectedLecture.challenge_lecture_id,
    open_at: selectedLecture.open_at,
  })
}))