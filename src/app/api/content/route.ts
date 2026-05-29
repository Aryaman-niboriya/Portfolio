import { NextResponse } from "next/server";
import {
  isBlobStorageConfigured,
  isVercelProduction,
  readContent,
  writeContent,
} from "@/lib/content-store";

export async function GET() {
  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (isVercelProduction() && !isBlobStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          "Vercel Blob is not set up. In your Vercel project: Storage → Create Database → Blob, then redeploy.",
      },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    await writeContent(body);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === "BLOB_NOT_CONFIGURED") {
      return NextResponse.json(
        {
          error:
            "Vercel Blob is not set up. In your Vercel project: Storage → Create Database → Blob, then redeploy.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
