"use client";

import { useImageStore } from "@/hooks/use-image-store";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIMENSION_PRESETS } from "@/lib/presets";
import type { CompressionMode, ImageFormat } from "@/types";
import { useState } from "react";

function QualityLabel({ value }: { value: number }) {
  let label = "Low";
  if (value >= 80) label = "High";
  else if (value >= 50) label = "Medium";
  return (
    <span className="text-xs text-muted-foreground">
      {label} ({value})
    </span>
  );
}

export function CompressionControls() {
  const settings = useImageStore((s) => s.settings);
  const setMode = useImageStore((s) => s.setMode);
  const setQuality = useImageStore((s) => s.setQuality);
  const setTargetWidth = useImageStore((s) => s.setTargetWidth);
  const setTargetHeight = useImageStore((s) => s.setTargetHeight);
  const setOutputFormat = useImageStore((s) => s.setOutputFormat);

  const [selectedPreset, setSelectedPreset] = useState("Original");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");

  const handlePresetChange = (value: string | null) => {
    if (!value) return;
    setSelectedPreset(value);
    const preset = DIMENSION_PRESETS.find((p) => p.label === value);
    if (!preset) return;

    if (preset.custom) {
      setTargetWidth(customWidth ? parseInt(customWidth) : undefined);
      setTargetHeight(customHeight ? parseInt(customHeight) : undefined);
    } else {
      setTargetWidth(preset.width);
      setTargetHeight(preset.height);
    }
  };

  const handleCustomWidth = (val: string) => {
    setCustomWidth(val);
    setTargetWidth(val ? parseInt(val) : undefined);
  };

  const handleCustomHeight = (val: string) => {
    setCustomHeight(val);
    setTargetHeight(val ? parseInt(val) : undefined);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide">
          Mode
        </Label>
        <Tabs
          value={settings.mode}
          onValueChange={(v) => setMode(v as CompressionMode)}
        >
          <TabsList className="w-full">
            <TabsTrigger value="scale" className="flex-1">
              Scale
            </TabsTrigger>
            <TabsTrigger value="crop" className="flex-1">
              Crop
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wide">
            Quality
          </Label>
          <QualityLabel value={settings.quality} />
        </div>
        <Slider
          value={[settings.quality]}
          onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)}
          min={1}
          max={100}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide">
          Size Preset
        </Label>
        <Select value={selectedPreset} onValueChange={handlePresetChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIMENSION_PRESETS.map((p) => (
              <SelectItem key={p.label} value={p.label}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPreset === "Custom" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Width (px)</Label>
            <Input
              type="number"
              placeholder="Width"
              value={customWidth}
              onChange={(e) => handleCustomWidth(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Height (px)</Label>
            <Input
              type="number"
              placeholder="Height"
              value={customHeight}
              onChange={(e) => handleCustomHeight(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide">
          Output Format
        </Label>
        <Select
          value={settings.outputFormat}
          onValueChange={(v) => v && setOutputFormat(v as ImageFormat)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">Original Format</SelectItem>
            <SelectItem value="jpeg">JPEG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
