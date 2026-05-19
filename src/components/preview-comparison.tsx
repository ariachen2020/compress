"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SizeBadge } from "./size-badge";
import type { ImageItem } from "@/types";

interface PreviewComparisonProps {
  image: ImageItem | null;
  open: boolean;
  onClose: () => void;
}

export function PreviewComparison({
  image,
  open,
  onClose,
}: PreviewComparisonProps) {
  const [view, setView] = useState<"side" | "slider">("slider");
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, x)));
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      setSliderPos(Math.max(0, Math.min(100, x)));
    },
    []
  );

  if (!image || !image.compressedUrl) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Preview Comparison</span>
            <SizeBadge
              originalSize={image.originalSize}
              compressedSize={image.compressedSize}
            />
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "side" | "slider")}
        >
          <TabsList>
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="side">Side by Side</TabsTrigger>
          </TabsList>
        </Tabs>

        {view === "side" && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <p className="text-xs text-center text-muted-foreground">
                Original
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.originalUrl}
                alt="Original"
                className="w-full rounded-lg border"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-center text-muted-foreground">
                Compressed
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.compressedUrl}
                alt="Compressed"
                className="w-full rounded-lg border"
              />
            </div>
          </div>
        )}

        {view === "slider" && (
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg border cursor-col-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.compressedUrl}
              alt="Compressed"
              className="w-full block"
              draggable={false}
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.originalUrl}
                alt="Original"
                className="block"
                style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
                draggable={false}
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                <span className="text-xs">⟷</span>
              </div>
            </div>
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Original
            </div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Compressed
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
