"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { useImageStore } from "@/hooks/use-image-store";
import type { ImageItem } from "@/types";

function readImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}

export function UploadZone() {
  const addImages = useImageStore((s) => s.addImages);
  const hasImages = useImageStore((s) => s.images.length > 0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const items: ImageItem[] = await Promise.all(
        acceptedFiles.map(async (file) => {
          const dims = await readImageDimensions(file);
          return {
            id: crypto.randomUUID(),
            file,
            originalUrl: URL.createObjectURL(file),
            originalSize: file.size,
            originalWidth: dims.width,
            originalHeight: dims.height,
            status: "idle" as const,
          };
        })
      );
      addImages(items);
    },
    [addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxSize: 20 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer
        ${hasImages ? "p-4" : "p-12"}
        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-center">
        {isDragActive ? (
          <>
            <Upload className="h-8 w-8 text-primary" />
            <p className="text-sm font-medium">Drop images here</p>
          </>
        ) : (
          <>
            <ImageIcon
              className={`text-muted-foreground ${hasImages ? "h-5 w-5" : "h-10 w-10"}`}
            />
            {!hasImages && (
              <div>
                <p className="text-sm font-medium">
                  Drag & drop images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WebP up to 20MB each
                </p>
              </div>
            )}
            {hasImages && (
              <p className="text-xs text-muted-foreground">
                Add more images
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
