import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ImageItem } from "@/types";

function getExtension(blob: Blob): string {
  const type = blob.type;
  if (type.includes("png")) return ".png";
  if (type.includes("webp")) return ".webp";
  return ".jpg";
}

export async function downloadAllAsZip(images: ImageItem[]) {
  const zip = new JSZip();
  const compressed = images.filter(
    (i) => i.status === "done" && i.compressedBlob
  );

  for (const image of compressed) {
    const baseName = image.file.name.replace(/\.[^.]+$/, "");
    const ext = getExtension(image.compressedBlob!);
    zip.file(`${baseName}_compressed${ext}`, image.compressedBlob!, {
      compression: "STORE",
    });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `compressed-images.zip`);
}
