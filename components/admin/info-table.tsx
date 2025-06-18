"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/common/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/table";

interface Column {
  header: string;
  accessor: string;
  cell?: (value: any) => ReactNode;
  align?: "left" | "center" | "right";
}

interface InfoTableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  actions?: (item: any) => ReactNode;
}

export default function InfoTable({
  columns,
  data,
  isLoading = false,
  error = null,
  emptyMessage = "데이터가 없습니다.",
  actions,
}: InfoTableProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#8C7DFF]" />
          <span className="ml-2 text-gray-400">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
        <div className="flex flex-col justify-center items-center py-20">
          <div className="text-red-400 mb-2">오류가 발생했습니다</div>
          <div className="text-gray-400 text-sm mb-4">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-gray-700/30 bg-[#1A1D29]/50 text-gray-300 hover:bg-[#1A1D29]/70 hover:text-white"
          >
            페이지 새로고침
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#252A3C] border border-gray-700/30 rounded-xl overflow-hidden shadow-lg">
      <Table>
        <TableHeader className="bg-[#1A1D29]/60">
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={
                  column.align === "right" ? "text-right" : "text-left"
                }
              >
                {column.header}
              </TableHead>
            ))}
            {actions && <TableHead className="text-right">관리</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="text-center text-gray-400 py-8"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-[#1C1F2B]/50">
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={`${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                          ? "text-center"
                          : "text-left"
                    } ${colIndex === 0 ? "text-gray-300" : "text-gray-400"}`}
                  >
                    {column.cell
                      ? column.cell(item[column.accessor])
                      : item[column.accessor]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">{actions(item)}</TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
