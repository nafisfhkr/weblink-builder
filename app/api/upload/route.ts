import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { nanoid } from "nanoid";
import * as fs from "fs";
import * as path from "path";

import { put } from "@vercel/blob";


const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak didukung" }, { status: 415 });
    }

    // Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file melebihi 5MB" }, { status: 413 });
    }

    const fileExtension = file.name.split(".").pop() || "png";
    const uniqueFilename = `${nanoid()}.${fileExtension}`;

    // Check if Vercel Blob Token is set and the package is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(uniqueFilename, file, {
        access: "public",
      });
      return NextResponse.json({
        url: blob.url,
        storageKey: blob.pathname || uniqueFilename,
      });
    } else {
      if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
        console.error("Missing BLOB_READ_WRITE_TOKEN on production. Vercel Blob Storage is not configured.");
        return NextResponse.json({ error: "Storage Vercel Blob belum dikonfigurasi di Environment Variables Vercel." }, { status: 500 });
      }

      // Fallback: Local storage mock for local development
      console.log("No Vercel Blob Token found. Saving file locally.");
      
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueFilename);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        url: `/uploads/${uniqueFilename}`,
        storageKey: uniqueFilename,
      });
    }
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
