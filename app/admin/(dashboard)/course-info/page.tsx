"use client";

import { useState } from "react";
import SearchFilter from "@/components/admin/course-info/SearchFilter";
import CourseInfoTable from "@/components/admin/CourseInfoTable";

export default function CourseInfoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  return (
    <div className="space-y-4">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showCompletedOnly={showCompletedOnly}
        onCompletedChange={setShowCompletedOnly}
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
