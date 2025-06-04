"use client";

import { useState } from "react";
import PageTitle from "@/components/ui/page-title";
import SearchFilter from "@/components/admin/course-info/search-filter";
import MainContent from "@/components/admin/course-info/main-content";

export default function CourseInfoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnsubmittedOnly, setShowUnsubmittedOnly] = useState(false);

  return (
    <div className="space-y-4">
      <PageTitle title="수강 정보 관리" />
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showUnsubmittedOnly={showUnsubmittedOnly}
        onUnsubmittedChange={setShowUnsubmittedOnly}
      />
      <MainContent
        searchQuery={searchQuery}
        showUnsubmittedOnly={showUnsubmittedOnly}
      />
    </div>
  );
}
