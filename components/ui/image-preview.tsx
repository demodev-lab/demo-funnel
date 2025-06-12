"use client";

import { X } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  onRemove?: () => void;
  alt?: string;
}

export function ImagePreview({
  imageUrl,
  onRemove,
  alt = "미리보기",
}: ImagePreviewProps) {
  return (
    <div className="h-14 w-14 rounded-lg border border-gray-700 flex items-center justify-center shrink-0 relative group">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover rounded-lg border border-gray-700/30"
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
