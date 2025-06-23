"use client";

import { Button } from "@/components/common/button";
import { Student } from "@/types/user";
import { Loader2 } from "lucide-react";
import InfoTable from "@/components/admin/info-table";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onEdit: (student: Student) => void;
  onDelete: (studentId: number) => void;
}

export default function StudentTable({
  students,
  isLoading,
  error,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onEdit,
  onDelete,
}: StudentTableProps) {
  const observerRef = useInfiniteScroll({
    onIntersect: onFetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const columns = [
    { header: "No.", accessor: "index" },
    { header: "이름", accessor: "name" },
    { header: "이메일", accessor: "email" },
    { header: "전화번호", accessor: "phone" },
  ];

  const renderActions = (student: Student) => (
    <>
      <Button
        onClick={() => onEdit(student)}
        variant="ghost"
        className="h-8 w-8 p-0 mr-1 text-gray-400 hover:text-[#8C7DFF] hover:bg-[#1A1D29]/60"
      >
        <span className="sr-only">Edit</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" />
          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" />
        </svg>
      </Button>
      <Button
        onClick={() => onDelete(student.id!)}
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-[#1A1D29]/60"
      >
        <span className="sr-only">Delete</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </Button>
    </>
  );

  return (
    <>
      <InfoTable
        columns={columns}
        data={students.map((student, index) => ({
          ...student,
          index: index + 1,
        }))}
        isLoading={isLoading}
        error={error}
        emptyMessage="등록된 수강생이 없습니다."
        actions={renderActions}
      />

      {/* 무한 스크롤 옵저버 타겟 */}
      <div
        ref={observerRef}
        className="w-full h-4 flex items-center justify-center p-4"
      >
        {isFetchingNextPage && (
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </>
  );
}
