"use client";

import { useState, useCallback } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ASPECT_RATIOS } from "@/lib/presets";
import { useImageStore } from "@/hooks/use-image-store";
import type { ImageItem } from "@/types";

interface CropDialogProps {
  image: ImageItem | null;
  open: boolean;
  onClose: () => void;
}

export function CropDialog({ image, open, onClose }: CropDialogProps) {
  const setCropRegion = useImageStore((s) => s.setCropRegion);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [selectedRatio, setSelectedRatio] = useState("Free");

  const handleRatioChange = useCallback(
    (label: string | null) => {
      if (!label) return;
      setSelectedRatio(label);
      const ratio = ASPECT_RATIOS.find((r) => r.label === label);
      if (ratio?.value) {
        const newWidth = 80;
        const newHeight = newWidth / ratio.value;
        setCrop({
          unit: "%",
          x: 10,
          y: Math.max(0, (100 - newHeight) / 2),
          width: newWidth,
          height: Math.min(newHeight, 90),
        });
      }
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (!image) return;
    setCropRegion(image.id, {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
    });
    onClose();
  }, [image, crop, setCropRegion, onClose]);

  if (!image) return null;

  const aspect = ASPECT_RATIOS.find((r) => r.label === selectedRatio)?.value;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs">Aspect Ratio</Label>
            <Select value={selectedRatio} onValueChange={handleRatioChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((r) => (
                  <SelectItem key={r.label} value={r.label}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-[60vh] overflow-auto flex justify-center bg-muted rounded-lg">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={aspect}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.originalUrl}
                alt="Crop preview"
                className="max-h-[55vh] object-contain"
              />
            </ReactCrop>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Apply Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
