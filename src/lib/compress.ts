import sharp from "sharp";
import type { CompressionSettings, ImageFormat } from "@/types";

interface CompressResult {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
}

export async function compressImage(
  buffer: Buffer,
  settings: CompressionSettings
): Promise<CompressResult> {
  let pipeline = sharp(buffer).rotate();

  const metadata = await sharp(buffer).metadata();
  const origWidth = metadata.width ?? 0;
  const origHeight = metadata.height ?? 0;

  if (settings.mode === "crop" && settings.crop) {
    const left = Math.round((settings.crop.x / 100) * origWidth);
    const top = Math.round((settings.crop.y / 100) * origHeight);
    const width = Math.round((settings.crop.width / 100) * origWidth);
    const height = Math.round((settings.crop.height / 100) * origHeight);
    pipeline = pipeline.extract({
      left: Math.max(0, left),
      top: Math.max(0, top),
      width: Math.min(width, origWidth - left),
      height: Math.min(height, origHeight - top),
    });
  }

  if (settings.targetWidth || settings.targetHeight) {
    pipeline = pipeline.resize(settings.targetWidth, settings.targetHeight, {
      fit: settings.mode === "crop" ? "fill" : "inside",
      withoutEnlargement: true,
    });
  }

  const sourceFormat = metadata.format as string;
  const outputFormat: string =
    settings.outputFormat === "original" ? sourceFormat : settings.outputFormat;

  const quality = settings.quality;

  switch (outputFormat) {
    case "jpeg":
    case "jpg":
      pipeline = pipeline.jpeg({ quality });
      break;
    case "png":
      pipeline = pipeline.png({ quality });
      break;
    case "webp":
      pipeline = pipeline.webp({ quality });
      break;
    default:
      pipeline = pipeline.jpeg({ quality });
  }

  const result = await pipeline.toBuffer({ resolveWithObject: true });

  return {
    buffer: result.data,
    format: outputFormat === "jpg" ? "jpeg" : outputFormat,
    width: result.info.width,
    height: result.info.height,
  };
}
