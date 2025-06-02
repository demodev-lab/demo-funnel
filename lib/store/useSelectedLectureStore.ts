import { Lecture } from '@/types/lecture';
import { create } from 'zustand';

interface SelectedLectureState {
  lectureId: number;
  challengeLectureId: number;
  setSelectedLecture: (selectedLecture: Lecture) => void;
}

export const useSelectedLectureStore = create<SelectedLectureState>(set => ({
  lectureId: 0,
  challengeLectureId: 0,
  setSelectedLecture: (selectedLecture: Lecture) => set({
    lectureId: selectedLecture.id,
    challengeLectureId: selectedLecture.challenge_lecture_id,
  })
}))