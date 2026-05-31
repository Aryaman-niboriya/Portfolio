export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface Contribution {
  date: string;
  count: number;
  level: ContributionLevel;
}

export interface ContributionsApiData {
  total: Record<string, number>;
  contributions: Contribution[];
}

const GITHUB_USER = "Aryaman-niboriya";

const LEVEL_MAP: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function clampLevel(n: number): ContributionLevel {
  return Math.min(4, Math.max(0, n)) as ContributionLevel;
}

function computeTotals(contributions: Contribution[]): Record<string, number> {
  const total: Record<string, number> = {};
  for (const { date, count } of contributions) {
    const year = date.slice(0, 4);
    total[year] = (total[year] ?? 0) + count;
  }
  return total;
}

/** Parse github.com/users/{user}/contributions HTML (same source as profile graph). */
export async function fetchLiveDaysFromGitHubHtml(
  username: string = GITHUB_USER
): Promise<Map<string, { level: ContributionLevel; count: number }>> {
  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "User-Agent": "Aryaman-Portfolio/1.0 (contributions display)",
      Accept: "text/html",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub HTML ${res.status}`);
  }

  const html = await res.text();
  const days = new Map<string, { level: ContributionLevel; count: number }>();
  const cellRe = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d)"/g;

  for (const match of html.matchAll(cellRe)) {
    const level = clampLevel(parseInt(match[2], 10));
    days.set(match[1], {
      level,
      count: level > 0 ? 1 : 0,
    });
  }

  return days;
}

async function fetchFromJogruber(username: string): Promise<ContributionsApiData> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Jogruber API ${res.status}`);
  return res.json() as Promise<ContributionsApiData>;
}

async function fetchFromGitHubGraphQL(
  username: string,
  token: string
): Promise<ContributionsApiData | null> {
  const years = [2024, 2025, 2026];
  const contributions: Contribution[] = [];

  for (const year of years) {
    const from = `${year}-01-01T00:00:00Z`;
    const to =
      year === new Date().getFullYear()
        ? new Date().toISOString()
        : `${year}-12-31T23:59:59Z`;

    const query = `
      query($login: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $login) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { login: username, from, to },
      }),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (json.errors?.length) return null;

    const weeks =
      json.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    for (const week of weeks) {
      for (const day of week.contributionDays ?? []) {
        const date = String(day.date).slice(0, 10);
        contributions.push({
          date,
          count: day.contributionCount ?? 0,
          level: LEVEL_MAP[day.contributionLevel] ?? 0,
        });
      }
    }
  }

  if (contributions.length === 0) return null;

  const byDate = new Map<string, Contribution>();
  for (const c of contributions) byDate.set(c.date, c);

  const merged = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
  return { contributions: merged, total: computeTotals(merged) };
}

/** Merge proxy counts with live GitHub HTML levels (today's commits show immediately). */
function mergeWithLiveHtml(
  base: ContributionsApiData,
  liveDays: Map<string, { level: ContributionLevel; count: number }>
): ContributionsApiData {
  const contributions = base.contributions.map((c) => {
    const live = liveDays.get(c.date);
    if (!live) return c;

    const level = live.level >= c.level ? live.level : c.level;
    let count = c.count;
    if (live.level > 0 && count === 0) {
      count = live.count || 1;
    }
    if (live.level > c.level && count < live.count) {
      count = live.count;
    }

    return { date: c.date, count, level };
  });

  for (const [date, live] of liveDays) {
    if (!contributions.some((c) => c.date === date)) {
      contributions.push({
        date,
        count: live.count,
        level: live.level,
      });
    }
  }

  contributions.sort((a, b) => a.date.localeCompare(b.date));
  return { contributions, total: computeTotals(contributions) };
}

export async function fetchGitHubContributions(
  username: string = GITHUB_USER
): Promise<ContributionsApiData> {
  const token = process.env.GITHUB_TOKEN?.trim();

  if (token) {
    const graphql = await fetchFromGitHubGraphQL(username, token);
    if (graphql) return graphql;
  }

  const [jogruber, liveDays] = await Promise.all([
    fetchFromJogruber(username),
    fetchLiveDaysFromGitHubHtml(username).catch(() => new Map()),
  ]);

  if (liveDays.size === 0) return jogruber;

  return mergeWithLiveHtml(jogruber, liveDays);
}
