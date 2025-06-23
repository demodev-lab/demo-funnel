"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchFilter from "./SearchFilter";
import CourseInfoTable from "./CourseInfoTable";

function CourseInfoContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const showCompletedOnly = searchParams.get("completed") === "true";

  return (
    <>
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
    </>
  );
}

export default function CourseInfoContainer() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <CourseInfoContent />
    </Suspense>
  );
}
