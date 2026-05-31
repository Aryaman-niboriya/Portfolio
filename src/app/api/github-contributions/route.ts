import { NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/githubContributions";

const CACHE_TTL_MS = 3 * 60 * 1000;
let cache: { data: Awaited<ReturnType<typeof fetchGitHubContributions>>; ts: number } | null =
  null;

export const dynamic = "force-dynamic";

export async function GET() {
  const now = Date.now();
  const useCache = cache && now - cache.ts < CACHE_TTL_MS;

  try {
    if (!useCache) {
      cache = { data: await fetchGitHubContributions(), ts: now };
    }

    return NextResponse.json(cache!.data, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=180, stale-while-revalidate=60",
        "X-Contributions-Cache": useCache ? "hit" : "miss",
        "X-Contributions-Source": process.env.GITHUB_TOKEN ? "graphql" : "github-html+jogruber",
      },
    });
  } catch (err) {
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { "X-Contributions-Cache": "stale-error" },
      });
    }
    console.error("[github-contributions]", err);
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 502 });
  }
}
