"use client";

import LectureForm from "@/components/admin/lectures/LectureForm";
import { Button } from "@/components/common/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/Dialog";
import { useState } from "react";

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 bg-[#252A3C] border-gray-700/30 text-white">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>강의 추가</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6">
            <LectureForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
