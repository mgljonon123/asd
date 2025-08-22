import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const fileEntry of files) {
      if (!(fileEntry instanceof File)) continue;

      const file = fileEntry as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const ext = path.extname(file.name) || ".png";
      const base = path.basename(file.name, ext).replace(/[^a-z0-9_-]/gi, "");
      const safeBase = base.length > 0 ? base : "upload";
      const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      const filename = `${unique}-${safeBase}${ext}`;

      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, buffer);

      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}

