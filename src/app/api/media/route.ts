import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

function safeDiskPathFromSrc(src: string): string | null {
  const clean = src.trim();
  if (!clean.startsWith("/uploads/") || clean.includes("..")) return null;
  return path.join(process.cwd(), "public", clean.replace(/^\//, ""));
}

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("src") ?? "";
  const diskPath = safeDiskPathFromSrc(src);
  if (!diskPath) return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });

  try {
    const file = await readFile(diskPath);
    const ext = path.extname(diskPath).toLowerCase();
    const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
}
