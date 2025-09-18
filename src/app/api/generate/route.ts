"use server";

import { NextRequest } from "next/server";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

// Register Thai font
GlobalFonts.registerFromPath(
  `${process.cwd()}/public/fonts/NotoSansThai-Bold.ttf`,
  "NotoSansThai"
);

export async function POST(req: NextRequest) {
  const { text, mode = "share" } = await req.json();

  if (!text || text.length > 12) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
  }

  // 16:9 HD canvas
  const width = 1920;
  const height = 1280;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // ---- Background ----
  const bg = await loadImage(`${process.cwd()}/public/images/result-bg.webp`);
  ctx.drawImage(bg, 0, 0, width, height);

  // ---- Straight Text ----
  ctx.font = "bold 60px NotoSansThaiBold"; // adjust size as needed
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  // position: horizontally centered, vertical around bottle label
  const x = width / 2;
  const y = 460; // adjust to sit on the label area

  ctx.fillText(text, x, y);

  // ---- Return PNG ----
  const buffer = canvas.toBuffer("image/png");

  const headers: HeadersInit = { "Content-Type": "image/png" };
  if (mode === "download") {
    headers["Content-Disposition"] = "attachment; filename=heinz.png";
  }

  return new Response(buffer, { headers });
}
