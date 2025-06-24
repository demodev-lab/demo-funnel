import AddLectureButton from "@/components/admin/lectures/AddLectureButton";
import LecturesContainer from "@/components/admin/lectures/LecturesContainer";

export default function LecturesPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddLectureButton />
      </div>
      <LecturesContainer />
    </div>
  );
}
