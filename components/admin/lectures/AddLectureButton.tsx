"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Plus } from "lucide-react";
import LectureDialog from "@/components/admin/lectures/LectureDialog";

export default function AddLectureButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="bg-gradient-to-r from-[#5046E4] to-[#6A5AFF] hover:brightness-110 text-white shadow-md hover:shadow-xl transition-all duration-300"
        onClick={() => setOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        강의 추가
      </Button>
      <LectureDialog
        open={open}
        onOpenChange={setOpen}
        title="강의 추가"
        isEdit={false}
      />
    </>
  );
}
