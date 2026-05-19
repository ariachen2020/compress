"use client";

import { useState, useCallback } from "react";
import { ImageDown } from "lucide-react";
import { UploadZone } from "@/components/upload-zone";
import { ImageList } from "@/components/image-list";
import { CompressionControls } from "@/components/compression-controls";
import { BatchActions } from "@/components/batch-actions";
import { CropDialog } from "@/components/crop-dialog";
import { PreviewComparison } from "@/components/preview-comparison";
import { useImageStore } from "@/hooks/use-image-store";

export default function Home() {
  const images = useImageStore((s) => s.images);
  const [cropImageId, setCropImageId] = useState<string | null>(null);
  const [previewImageId, setPreviewImageId] = useState<string | null>(null);

  const cropImage = images.find((i) => i.id === cropImageId) ?? null;
  const previewImage = images.find((i) => i.id === previewImageId) ?? null;

  const handleCrop = useCallback((id: string) => setCropImageId(id), []);
  const handlePreview = useCallback((id: string) => setPreviewImageId(id), []);

  const hasImages = images.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <ImageDown className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">Image Compressor</h1>
            <p className="text-xs text-muted-foreground">
              Upload, resize, crop and compress images instantly
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 pb-24">
        <div className="space-y-6">
          <UploadZone />

          {hasImages && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-72 lg:shrink-0">
                <div className="lg:sticky lg:top-6 space-y-4">
                  <h2 className="text-sm font-semibold">Settings</h2>
                  <CompressionControls />
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                <ImageList onCrop={handleCrop} onPreview={handlePreview} />
              </div>
            </div>
          )}
        </div>
      </main>

      {hasImages && (
        <div className="sticky bottom-0">
          <BatchActions />
        </div>
      )}

      <CropDialog
        image={cropImage}
        open={cropImageId !== null}
        onClose={() => setCropImageId(null)}
      />

      <PreviewComparison
        image={previewImage}
        open={previewImageId !== null}
        onClose={() => setPreviewImageId(null)}
      />
    </div>
  );
}
