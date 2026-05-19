"use client";

import { useImageStore } from "@/hooks/use-image-store";
import { ImageCard } from "./image-card";

interface ImageListProps {
  onCrop: (id: string) => void;
  onPreview: (id: string) => void;
}

export function ImageList({ onCrop, onPreview }: ImageListProps) {
  const images = useImageStore((s) => s.images);

  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          image={image}
          onCrop={onCrop}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
