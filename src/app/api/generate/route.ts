"use server";

import { NextRequest } from "next/server";
import { createCanvas, loadImage } from "@napi-rs/canvas";

export async function POST(req: NextRequest) {
  const { overlayImage, mode = "share" } = await req.json();

  // 16:9 canvas
  const width = 1920, height = 1280;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ---- Layer 1: Background ----
  const bg = await loadImage(`${process.cwd()}/public/images/result-bg.webp`);
  ctx.drawImage(bg, 0, 0, width, height);

  // ---- Layer 2: Curved Text Overlay (from frontend PNG) ----
  if (overlayImage) {
    console.log("Overlay received length:", overlayImage.length);
    const overlay = await loadImage(overlayImage);
    const overlayWidth = 700;
    const overlayHeight = 310;

    const x = (canvas.width - overlayWidth) / 2 + 15;
    const y = (canvas.height - overlayHeight) / 2 - 330;

    ctx.drawImage(overlay, x, y, overlayWidth, overlayHeight);

  }

  // ---- Return PNG ----
  const buffer = canvas.toBuffer("image/png");
  const headers: HeadersInit = { "Content-Type": "image/png" };

  if (mode === "download") {
    headers["Content-Disposition"] = "attachment; filename=heinz.png";
  }

  return new Response(buffer, { headers });
}
