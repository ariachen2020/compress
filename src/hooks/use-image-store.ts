import { create } from "zustand";
import type {
  CompressionMode,
  CompressionSettings,
  CropRegion,
  ImageFormat,
  ImageItem,
  ImageStatus,
} from "@/types";

interface ImageStore {
  images: ImageItem[];
  settings: CompressionSettings;

  addImages: (items: ImageItem[]) => void;
  removeImage: (id: string) => void;
  clearAll: () => void;
  updateImage: (id: string, updates: Partial<ImageItem>) => void;
  updateImageStatus: (id: string, status: ImageStatus, error?: string) => void;
  setCropRegion: (id: string, crop: CropRegion) => void;

  setMode: (mode: CompressionMode) => void;
  setQuality: (quality: number) => void;
  setTargetWidth: (width?: number) => void;
  setTargetHeight: (height?: number) => void;
  setAspectRatio: (ratio?: string) => void;
  setOutputFormat: (format: ImageFormat) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  settings: {
    mode: "scale",
    quality: 80,
    outputFormat: "original",
  },

  addImages: (items) =>
    set((state) => ({ images: [...state.images, ...items] })),

  removeImage: (id) =>
    set((state) => {
      const image = state.images.find((i) => i.id === id);
      if (image) {
        URL.revokeObjectURL(image.originalUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      }
      return { images: state.images.filter((i) => i.id !== id) };
    }),

  clearAll: () =>
    set((state) => {
      state.images.forEach((image) => {
        URL.revokeObjectURL(image.originalUrl);
        if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
      });
      return { images: [] };
    }),

  updateImage: (id, updates) =>
    set((state) => ({
      images: state.images.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  updateImageStatus: (id, status, error) =>
    set((state) => ({
      images: state.images.map((i) =>
        i.id === id ? { ...i, status, error } : i
      ),
    })),

  setCropRegion: (id, crop) =>
    set((state) => ({
      images: state.images.map((i) =>
        i.id === id ? { ...i, cropRegion: crop } : i
      ),
    })),

  setMode: (mode) =>
    set((state) => ({ settings: { ...state.settings, mode } })),

  setQuality: (quality) =>
    set((state) => ({ settings: { ...state.settings, quality } })),

  setTargetWidth: (targetWidth) =>
    set((state) => ({ settings: { ...state.settings, targetWidth } })),

  setTargetHeight: (targetHeight) =>
    set((state) => ({ settings: { ...state.settings, targetHeight } })),

  setAspectRatio: (aspectRatio) =>
    set((state) => ({ settings: { ...state.settings, aspectRatio } })),

  setOutputFormat: (outputFormat) =>
    set((state) => ({ settings: { ...state.settings, outputFormat } })),
}));
