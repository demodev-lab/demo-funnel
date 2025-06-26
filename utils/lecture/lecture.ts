import { LectureWithSequence } from "@/types/lecture";

export function findCurrentLecture(
  lectures: LectureWithSequence[]
): LectureWithSequence | undefined {
  if (!lectures || lectures.length === 0) return undefined;
  
  const openLectures = lectures.filter(lecture => !lecture.isLocked);
  return openLectures[openLectures.length - 1] || lectures[0];
}

export function findLectureIndex(
  lectures: LectureWithSequence[], 
  lectureId: number
): number {
  return lectures.findIndex(lecture => lecture.id === lectureId);
}