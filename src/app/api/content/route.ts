import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "src/data/content.json");

export async function GET() {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ error: "Failed to read content" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await fs.writeFile(CONTENT_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
