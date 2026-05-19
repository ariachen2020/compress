export type CompressionMode = "scale" | "crop";
export type ImageFormat = "jpeg" | "png" | "webp" | "original";

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CompressionSettings {
  mode: CompressionMode;
  quality: number;
  targetWidth?: number;
  targetHeight?: number;
  aspectRatio?: string;
  outputFormat: ImageFormat;
  crop?: CropRegion;
}

export type ImageStatus = "idle" | "compressing" | "done" | "error";

export interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  compressedWidth?: number;
  compressedHeight?: number;
  status: ImageStatus;
  error?: string;
  cropRegion?: CropRegion;
}
