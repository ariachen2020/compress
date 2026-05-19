import { describe, it, expect, beforeEach } from "vitest";
import { useImageStore } from "./use-image-store";
import type { ImageItem } from "@/types";

function createMockImage(overrides: Partial<ImageItem> = {}): ImageItem {
  return {
    id: crypto.randomUUID(),
    file: new File(["test"], "test.jpg", { type: "image/jpeg" }),
    originalUrl: "blob:test",
    originalSize: 1000,
    originalWidth: 800,
    originalHeight: 600,
    status: "idle",
    ...overrides,
  };
}

describe("useImageStore", () => {
  beforeEach(() => {
    useImageStore.setState({
      images: [],
      settings: {
        mode: "scale",
        quality: 80,
        outputFormat: "original",
      },
    });
  });

  describe("images", () => {
    it("starts with empty images", () => {
      expect(useImageStore.getState().images).toEqual([]);
    });

    it("adds images", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      expect(useImageStore.getState().images).toHaveLength(1);
      expect(useImageStore.getState().images[0].id).toBe(img.id);
    });

    it("adds multiple images", () => {
      const imgs = [createMockImage(), createMockImage()];
      useImageStore.getState().addImages(imgs);
      expect(useImageStore.getState().images).toHaveLength(2);
    });

    it("removes an image", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      useImageStore.getState().removeImage(img.id);
      expect(useImageStore.getState().images).toHaveLength(0);
    });

    it("clears all images", () => {
      useImageStore
        .getState()
        .addImages([createMockImage(), createMockImage()]);
      useImageStore.getState().clearAll();
      expect(useImageStore.getState().images).toHaveLength(0);
    });

    it("updates image status", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      useImageStore.getState().updateImageStatus(img.id, "compressing");
      expect(useImageStore.getState().images[0].status).toBe("compressing");
    });

    it("updates image status with error", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      useImageStore
        .getState()
        .updateImageStatus(img.id, "error", "Something failed");
      expect(useImageStore.getState().images[0].status).toBe("error");
      expect(useImageStore.getState().images[0].error).toBe("Something failed");
    });

    it("updates image partial fields", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      useImageStore.getState().updateImage(img.id, {
        compressedSize: 500,
        status: "done",
      });
      const updated = useImageStore.getState().images[0];
      expect(updated.compressedSize).toBe(500);
      expect(updated.status).toBe("done");
    });

    it("sets crop region", () => {
      const img = createMockImage();
      useImageStore.getState().addImages([img]);
      useImageStore
        .getState()
        .setCropRegion(img.id, { x: 10, y: 10, width: 80, height: 80 });
      expect(useImageStore.getState().images[0].cropRegion).toEqual({
        x: 10,
        y: 10,
        width: 80,
        height: 80,
      });
    });
  });

  describe("settings", () => {
    it("has default settings", () => {
      const { settings } = useImageStore.getState();
      expect(settings.mode).toBe("scale");
      expect(settings.quality).toBe(80);
      expect(settings.outputFormat).toBe("original");
    });

    it("sets mode", () => {
      useImageStore.getState().setMode("crop");
      expect(useImageStore.getState().settings.mode).toBe("crop");
    });

    it("sets quality", () => {
      useImageStore.getState().setQuality(50);
      expect(useImageStore.getState().settings.quality).toBe(50);
    });

    it("sets target dimensions", () => {
      useImageStore.getState().setTargetWidth(1920);
      useImageStore.getState().setTargetHeight(1080);
      expect(useImageStore.getState().settings.targetWidth).toBe(1920);
      expect(useImageStore.getState().settings.targetHeight).toBe(1080);
    });

    it("sets output format", () => {
      useImageStore.getState().setOutputFormat("webp");
      expect(useImageStore.getState().settings.outputFormat).toBe("webp");
    });

    it("sets aspect ratio", () => {
      useImageStore.getState().setAspectRatio("16:9");
      expect(useImageStore.getState().settings.aspectRatio).toBe("16:9");
    });
  });
});
