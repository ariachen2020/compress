"use client";

import { ArrowRight } from "lucide-react";
import { formatBytes, savingsPercent } from "@/lib/format-bytes";

interface SizeBadgeProps {
  originalSize: number;
  compressedSize?: number;
}

export function SizeBadge({ originalSize, compressedSize }: SizeBadgeProps) {
  if (compressedSize === undefined) {
    return (
      <span className="text-xs text-muted-foreground">
        {formatBytes(originalSize)}
      </span>
    );
  }

  const savings = savingsPercent(originalSize, compressedSize);
  const increased = compressedSize > originalSize;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <span className="text-muted-foreground">{formatBytes(originalSize)}</span>
      <ArrowRight className="h-3 w-3 text-muted-foreground" />
      <span className={increased ? "text-orange-500" : "text-emerald-600"}>
        {formatBytes(compressedSize)}
      </span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
          increased
            ? "bg-orange-100 text-orange-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {increased ? "+" : "-"}
        {Math.abs(savings)}%
      </span>
    </div>
  );
}
