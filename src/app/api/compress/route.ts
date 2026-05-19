import { compressImage } from "@/lib/compress";
import type { CompressionSettings } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const settingsRaw = formData.get("settings") as string | null;

    if (!file || !settingsRaw) {
      return new Response("Missing file or settings", { status: 400 });
    }

    const settings: CompressionSettings = JSON.parse(settingsRaw);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await compressImage(buffer, settings);

    return new Response(new Uint8Array(result.buffer), {
      headers: {
        "Content-Type": `image/${result.format}`,
        "X-Original-Size": String(buffer.byteLength),
        "X-Compressed-Size": String(result.buffer.byteLength),
        "X-Width": String(result.width),
        "X-Height": String(result.height),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Compression failed";
    return new Response(message, { status: 500 });
  }
}
