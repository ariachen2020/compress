"use client";

import { Download, Play, Trash2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageStore } from "@/hooks/use-image-store";
import { useCompression } from "@/hooks/use-compression";
import { downloadAllAsZip } from "@/lib/zip";
import { formatBytes } from "@/lib/format-bytes";

export function BatchActions() {
  const images = useImageStore((s) => s.images);
  const clearAll = useImageStore((s) => s.clearAll);
  const { compressAll, cancelAll } = useCompression();

  if (images.length === 0) return null;

  const doneCount = images.filter((i) => i.status === "done").length;
  const compressingCount = images.filter(
    (i) => i.status === "compressing"
  ).length;
  const totalOriginal = images.reduce((sum, i) => sum + i.originalSize, 0);
  const totalCompressed = images
    .filter((i) => i.status === "done" && i.compressedSize)
    .reduce((sum, i) => sum + (i.compressedSize ?? 0), 0);
  const totalSaved = totalOriginal - totalCompressed;
  const isCompressing = compressingCount > 0;
  const hasCompressed = doneCount > 0;

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4">
        <div className="text-sm text-muted-foreground">
          {isCompressing && (
            <span>
              Compressing... {doneCount}/{images.length}
            </span>
          )}
          {!isCompressing && hasCompressed && (
            <span>
              {doneCount}/{images.length} compressed
              {totalSaved > 0 && ` · Saved ${formatBytes(totalSaved)}`}
            </span>
          )}
          {!isCompressing && !hasCompressed && (
            <span>{images.length} image{images.length !== 1 && "s"} ready</span>
          )}
        </div>

        <div className="flex gap-2">
          {isCompressing ? (
            <Button variant="destructive" size="sm" onClick={cancelAll}>
              <Square className="h-3.5 w-3.5 mr-1.5" />
              Cancel
            </Button>
          ) : (
            <Button size="sm" onClick={compressAll}>
              <Play className="h-3.5 w-3.5 mr-1.5" />
              Compress All
            </Button>
          )}

          {hasCompressed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadAllAsZip(images)}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download ZIP
            </Button>
          )}

          <Button variant="ghost" size="sm" onClick={clearAll}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
