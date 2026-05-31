import { NextResponse } from "next/server";

// Server-side proxy to avoid CORS and cache the response
let cache: { data: unknown; ts: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache

export async function GET() {
  // Return cached data if still fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data);
  }

  try {
    const res = await fetch(
      "https://github-contributions-api.jogruber.de/v4/Aryaman-niboriya",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
    }

    const data = await res.json();
    cache = { data, ts: Date.now() };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
