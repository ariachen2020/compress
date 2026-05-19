export interface DimensionPreset {
  label: string;
  width?: number;
  height?: number;
  custom?: boolean;
}

export const DIMENSION_PRESETS: DimensionPreset[] = [
  { label: "Original" },
  { label: "HD (1920×1080)", width: 1920, height: 1080 },
  { label: "HD (1280×720)", width: 1280, height: 720 },
  { label: "Medium (800×600)", width: 800, height: 600 },
  { label: "Thumbnail (400×300)", width: 400, height: 300 },
  { label: "Avatar (200×200)", width: 200, height: 200 },
  { label: "Custom", custom: true },
];

export interface AspectRatioOption {
  label: string;
  value?: number;
}

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: "Free" },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "3:2", value: 3 / 2 },
  { label: "9:16", value: 9 / 16 },
];
