import SearchFilter from "@/components/admin/course-info/SearchFilter";
import CourseInfoTable from "@/components/admin/course-info/CourseInfoTable";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    completed?: string;
  }>;
}

export default async function CourseInfoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const searchQuery = params.search || "";
  const showCompletedOnly = params.completed === "true";

  return (
    <div className="space-y-4">
      <SearchFilter
        searchQuery={searchQuery}
        showCompletedOnly={showCompletedOnly}
      />
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <CourseInfoTable
          searchQuery={searchQuery}
          showCompletedOnly={showCompletedOnly}
        />
      </div>
    </div>
  );
}
