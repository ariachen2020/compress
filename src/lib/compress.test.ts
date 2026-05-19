import { describe, it, expect } from "vitest";
import { compressImage } from "./compress";
import sharp from "sharp";
import type { CompressionSettings } from "@/types";

async function createTestImage(
  width: number,
  height: number
): Promise<Buffer> {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .jpeg({ quality: 100 })
    .toBuffer();
}

describe("compressImage", () => {
  it("compresses a JPEG image", async () => {
    const buffer = await createTestImage(800, 600);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 50,
      outputFormat: "jpeg",
    };

    const result = await compressImage(buffer, settings);
    expect(result.format).toBe("jpeg");
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
    expect(result.buffer.byteLength).toBeGreaterThan(0);
  });

  it("resizes image with scale mode", async () => {
    const buffer = await createTestImage(1920, 1080);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 80,
      targetWidth: 800,
      targetHeight: 600,
      outputFormat: "jpeg",
    };

    const result = await compressImage(buffer, settings);
    expect(result.width).toBeLessThanOrEqual(800);
    expect(result.height).toBeLessThanOrEqual(600);
  });

  it("does not upscale with withoutEnlargement", async () => {
    const buffer = await createTestImage(200, 150);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 80,
      targetWidth: 1920,
      targetHeight: 1080,
      outputFormat: "jpeg",
    };

    const result = await compressImage(buffer, settings);
    expect(result.width).toBe(200);
    expect(result.height).toBe(150);
  });

  it("converts format to webp", async () => {
    const buffer = await createTestImage(400, 300);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 80,
      outputFormat: "webp",
    };

    const result = await compressImage(buffer, settings);
    expect(result.format).toBe("webp");
  });

  it("converts format to png", async () => {
    const buffer = await createTestImage(400, 300);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 80,
      outputFormat: "png",
    };

    const result = await compressImage(buffer, settings);
    expect(result.format).toBe("png");
  });

  it("crops image in crop mode", async () => {
    const buffer = await createTestImage(1000, 1000);
    const settings: CompressionSettings = {
      mode: "crop",
      quality: 80,
      outputFormat: "jpeg",
      crop: {
        x: 10,
        y: 10,
        width: 50,
        height: 50,
      },
    };

    const result = await compressImage(buffer, settings);
    expect(result.width).toBe(500);
    expect(result.height).toBe(500);
  });

  it("crops and resizes", async () => {
    const buffer = await createTestImage(1000, 1000);
    const settings: CompressionSettings = {
      mode: "crop",
      quality: 80,
      targetWidth: 200,
      targetHeight: 200,
      outputFormat: "jpeg",
      crop: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    };

    const result = await compressImage(buffer, settings);
    expect(result.width).toBe(200);
    expect(result.height).toBe(200);
  });

  it("uses original format when set to original", async () => {
    const buffer = await createTestImage(400, 300);
    const settings: CompressionSettings = {
      mode: "scale",
      quality: 80,
      outputFormat: "original",
    };

    const result = await compressImage(buffer, settings);
    expect(result.format).toBe("jpeg");
  });

  it("lower quality produces smaller file", async () => {
    const buffer = await createTestImage(800, 600);

    const highQ = await compressImage(buffer, {
      mode: "scale",
      quality: 95,
      outputFormat: "jpeg",
    });

    const lowQ = await compressImage(buffer, {
      mode: "scale",
      quality: 20,
      outputFormat: "jpeg",
    });

    expect(lowQ.buffer.byteLength).toBeLessThan(highQ.buffer.byteLength);
  });
});
