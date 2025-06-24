import { AdminLecture, LectureWithSequence } from "@/types/lecture";
import LectureCard from "@/components/admin/lectures/LectureCard";

interface LectureGridProps {
  lectures: LectureWithSequence[];
  onLectureClick: (lecture: LectureWithSequence) => void;
}

export default function LectureCardList({
  lectures,
  onLectureClick,
}: LectureGridProps) {
  if (lectures.length === 0) {
    return (
      <div className="col-span-3 text-center py-8 text-gray-400">
        등록된 강의가 없습니다.
      </div>
    );
  }

  return (
    <>
      {lectures.map((lecture) => (
        <LectureCard
          key={lecture.id}
          lecture={lecture as unknown as AdminLecture}
          onClick={() => onLectureClick(lecture)}
        />
      ))}
    </>
  );
}
