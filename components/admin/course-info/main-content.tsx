import CourseInfoTable from "@/components/admin/course-info-table";

interface MainContentProps {
  searchQuery: string;
  showUnsubmittedOnly: boolean;
}

export default function MainContent({
  searchQuery,
  showUnsubmittedOnly,
}: MainContentProps) {
  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
      <CourseInfoTable
        searchQuery={searchQuery}
        showUnsubmittedOnly={showUnsubmittedOnly}
      />
    </div>
  );
}
