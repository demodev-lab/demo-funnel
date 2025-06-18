"use client";

import { ADMIN_TITLE } from "@/constants/adminTitle";
import { usePathname } from "next/navigation";

type AdminTitleKey = keyof typeof ADMIN_TITLE;

export default function PageTitle({ title }: { title?: string }) {
  const pathname = usePathname();
  const getAdminTitle = () => {
    if (title) return title;

    const path = pathname.split("/").pop()?.toUpperCase() as AdminTitleKey;
    return ADMIN_TITLE[path] || "관리자";
  };

  return (
    <h1 className="text-2xl font-bold" data-testid="page-title">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5046E4] to-[#8C7DFF]">
        {getAdminTitle()}
      </span>
    </h1>
  );
}
