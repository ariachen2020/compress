"use client";

import { Download, Loader2, Trash2, Crop, X, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SizeBadge } from "./size-badge";
import { useImageStore } from "@/hooks/use-image-store";
import { useCompression } from "@/hooks/use-compression";
import { saveAs } from "file-saver";
import type { ImageItem } from "@/types";

interface ImageCardProps {
  image: ImageItem;
  onCrop?: (id: string) => void;
  onPreview?: (id: string) => void;
}

export function ImageCard({ image, onCrop, onPreview }: ImageCardProps) {
  const removeImage = useImageStore((s) => s.removeImage);
  const mode = useImageStore((s) => s.settings.mode);
  const { compressOne } = useCompression();

  const previewUrl = image.compressedUrl || image.originalUrl;

  const handleDownload = () => {
    if (!image.compressedBlob) return;
    const ext = image.compressedBlob.type.includes("png")
      ? ".png"
      : image.compressedBlob.type.includes("webp")
        ? ".webp"
        : ".jpg";
    const name = image.file.name.replace(/\.[^.]+$/, "") + "_compressed" + ext;
    saveAs(image.compressedBlob, name);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt={image.file.name}
          className="w-full h-full object-contain"
        />
        {image.status === "compressing" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        {image.status === "done" && (
          <div className="absolute top-2 right-2">
            <div className="bg-emerald-500 text-white rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
          </div>
        )}
        {image.status === "error" && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white rounded-full p-1">
              <X className="h-3 w-3" />
            </div>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs font-medium truncate" title={image.file.name}>
          {image.file.name}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {image.originalWidth}×{image.originalHeight}
            {image.compressedWidth &&
              image.status === "done" &&
              ` → ${image.compressedWidth}×${image.compressedHeight}`}
          </span>
        </div>

        <SizeBadge
          originalSize={image.originalSize}
          compressedSize={
            image.status === "done" ? image.compressedSize : undefined
          }
        />

        {image.status === "error" && (
          <p className="text-xs text-red-500 truncate">{image.error}</p>
        )}

        <div className="flex gap-1.5 pt-1">
          {image.status !== "compressing" && image.status !== "done" && (
            <Button
              size="sm"
              variant="default"
              className="h-7 text-xs flex-1"
              onClick={() => compressOne(image.id)}
            >
              Compress
            </Button>
          )}
          {mode === "crop" && image.status !== "compressing" && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => onCrop?.(image.id)}
            >
              <Crop className="h-3 w-3" />
            </Button>
          )}
          {image.status === "done" && (
            <>
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs flex-1"
                onClick={handleDownload}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => onPreview?.(image.id)}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-muted-foreground"
            onClick={() => removeImage(image.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
