"use client";

import { useCallback, useRef } from "react";
import { useImageStore } from "./use-image-store";

const MAX_CONCURRENT = 3;

export function useCompression() {
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const compressOne = useCallback(async (imageId: string) => {
    const { images, settings, updateImage, updateImageStatus } =
      useImageStore.getState();
    const image = images.find((i) => i.id === imageId);
    if (!image) return;

    const controller = new AbortController();
    abortControllers.current.set(imageId, controller);

    updateImageStatus(imageId, "compressing");

    try {
      const formData = new FormData();
      formData.append("file", image.file);
      formData.append(
        "settings",
        JSON.stringify({
          ...settings,
          outputFormat: settings.outputFormat,
          crop: image.cropRegion,
        })
      );

      const response = await fetch("/api/compress", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const compressedUrl = URL.createObjectURL(blob);

      const existing = useImageStore
        .getState()
        .images.find((i) => i.id === imageId);
      if (existing?.compressedUrl) {
        URL.revokeObjectURL(existing.compressedUrl);
      }

      updateImage(imageId, {
        status: "done",
        compressedBlob: blob,
        compressedUrl,
        compressedSize: Number(response.headers.get("X-Compressed-Size")),
        compressedWidth: Number(response.headers.get("X-Width")),
        compressedHeight: Number(response.headers.get("X-Height")),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      updateImageStatus(
        imageId,
        "error",
        err instanceof Error ? err.message : "Compression failed"
      );
    } finally {
      abortControllers.current.delete(imageId);
    }
  }, []);

  const compressAll = useCallback(async () => {
    const { images } = useImageStore.getState();
    const pending = images.filter(
      (i) => i.status === "idle" || i.status === "error"
    );

    const queue = [...pending];
    const running: Promise<void>[] = [];

    const next = async (): Promise<void> => {
      const item = queue.shift();
      if (!item) return;
      await compressOne(item.id);
      await next();
    };

    for (let i = 0; i < Math.min(MAX_CONCURRENT, queue.length); i++) {
      running.push(next());
    }

    await Promise.all(running);
  }, [compressOne]);

  const cancelAll = useCallback(() => {
    abortControllers.current.forEach((controller) => controller.abort());
    abortControllers.current.clear();
    const { images, updateImageStatus } = useImageStore.getState();
    images.forEach((image) => {
      if (image.status === "compressing") {
        updateImageStatus(image.id, "idle");
      }
    });
  }, []);

  return { compressOne, compressAll, cancelAll };
}
