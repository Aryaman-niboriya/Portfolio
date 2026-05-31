"use client";

import React, { useState, useEffect, useCallback } from "react";
import { sfx } from "@/lib/AudioEngine";

interface Contribution {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ApiData {
  total: Record<string, number>;
  contributions: Contribution[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/** Local calendar date as YYYY-MM-DD (avoid toISOString UTC shift — breaks India etc.) */
function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Matrix green themed level colors
const LEVEL_COLORS: Record<number, string> = {
  0: "#0b120c", // empty cell
  1: "#0e3a1f",
  2: "#006d32",
  3: "#00cc3f",
  4: "#00ff41", // neon green
};

const LEVEL_COLORS_GLOW: Record<number, string> = {
  0: "none",
  1: "none",
  2: "0 0 2px rgba(0, 255, 65, 0.2)",
  3: "0 0 4px rgba(0, 255, 65, 0.4)",
  4: "0 0 8px rgba(0, 255, 65, 0.8)",
};

function buildYearGrid(year: number, contributions: Contribution[]) {
  const contributionMap = new Map<string, Contribution>();
  for (const c of contributions) {
    contributionMap.set(c.date, c);
  }

  const startDate = new Date(year, 0, 1);
  const startDayOfWeek = startDate.getDay(); // 0 = Sunday
  const firstGridDate = new Date(startDate);
  firstGridDate.setDate(startDate.getDate() - startDayOfWeek);

  const today = new Date();
  const isCurrentYear = year === today.getFullYear();
  const endDate = isCurrentYear
    ? new Date(today.getFullYear(), today.getMonth(), today.getDate())
    : new Date(year, 11, 31);
  const endDayOfWeek = endDate.getDay();
  const lastGridDate = new Date(endDate);
  lastGridDate.setDate(endDate.getDate() + (6 - endDayOfWeek));

  const weeks: Contribution[][] = [];
  let currentWeek: Contribution[] = [];
  const currentDate = new Date(firstGridDate);

  while (currentDate <= lastGridDate) {
    const dateStr = formatDateKey(currentDate);
    const existing = contributionMap.get(dateStr);

    currentWeek.push({
      date: dateStr,
      count: existing ? existing.count : 0,
      level: existing ? existing.level : 0,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function getMonthPositions(weeks: Contribution[][]) {
  const positions: { label: string; col: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, colIdx) => {
    const firstDay = week[0];
    if (!firstDay) return;
    const date = new Date(firstDay.date + "T00:00:00");
    const month = date.getMonth();

    if (month !== lastMonth) {
      const tooClose = positions.length > 0 && (colIdx - positions[positions.length - 1].col) < 4;
      if (!tooClose) {
        positions.push({ label: MONTH_LABELS[month], col: colIdx });
        lastMonth = month;
      }
    }
  });

  return positions;
}

type GithubGridSize = "sm" | "md" | "lg";

interface GithubGridProps {
  /** @deprecated use `size` instead */
  compact?: boolean;
  size?: GithubGridSize;
}

const GRID_SIZE: Record<
  GithubGridSize,
  {
    cell: string;
    gap: string;
    colWidth: number;
    maxWidth: string;
    yearColWidth: number;
    outerGap: string;
    borderRadius: string;
    padding: string;
    headerMb: string;
    titleFont: string;
    viewFont: string;
    showView: boolean;
    monthMarginLeft: string;
    monthMb: string;
    monthHeight: string;
    monthFont: string;
    dayFont: string;
    dayLabelWidth: string;
    legendMt: string;
    legendPt: string;
    showLegend: boolean;
    yearFont: string;
    loadingH: string;
    loadingFont: string;
  }
> = {
  sm: {
    cell: "5px",
    gap: "1px",
    colWidth: 6,
    maxWidth: "220px",
    yearColWidth: 36,
    outerGap: "6px",
    borderRadius: "4px",
    padding: "6px 8px",
    headerMb: "4px",
    titleFont: "8px",
    viewFont: "7px",
    showView: false,
    monthMarginLeft: "12px",
    monthMb: "2px",
    monthHeight: "8px",
    monthFont: "6px",
    dayFont: "5px",
    dayLabelWidth: "10px",
    legendMt: "4px",
    legendPt: "2px",
    showLegend: false,
    yearFont: "7px",
    loadingH: "h-[100px]",
    loadingFont: "text-[8px]",
  },
  md: {
    cell: "6px",
    gap: "2px",
    colWidth: 8,
    maxWidth: "100%",
    yearColWidth: 42,
    outerGap: "8px",
    borderRadius: "5px",
    padding: "8px 10px",
    headerMb: "6px",
    titleFont: "10px",
    viewFont: "8px",
    showView: true,
    monthMarginLeft: "14px",
    monthMb: "3px",
    monthHeight: "9px",
    monthFont: "7px",
    dayFont: "6px",
    dayLabelWidth: "12px",
    legendMt: "5px",
    legendPt: "3px",
    showLegend: true,
    yearFont: "8px",
    loadingH: "h-[120px]",
    loadingFont: "text-[9px]",
  },
  lg: {
    cell: "7px",
    gap: "2px",
    colWidth: 9,
    maxWidth: "100%",
    yearColWidth: 48,
    outerGap: "12px",
    borderRadius: "6px",
    padding: "10px 12px",
    headerMb: "8px",
    titleFont: "11px",
    viewFont: "9px",
    showView: true,
    monthMarginLeft: "18px",
    monthMb: "4px",
    monthHeight: "10px",
    monthFont: "8px",
    dayFont: "7px",
    dayLabelWidth: "14px",
    legendMt: "6px",
    legendPt: "4px",
    showLegend: true,
    yearFont: "9px",
    loadingH: "h-[130px]",
    loadingFont: "text-[10px]",
  },
};

export function GithubGrid({ compact, size }: GithubGridProps) {
  const resolvedSize: GithubGridSize = size ?? (compact ? "sm" : "lg");
  const s = GRID_SIZE[resolvedSize];
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<{ count: number; date: string } | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/github-contributions", { cache: "no-store" });
      if (!res.ok) throw new Error("bad response");
      const json: ApiData = await res.json();
      setData(json);
      
      if (json.total) {
        const availableYears = Object.keys(json.total)
          .map(Number)
          .filter((n) => !isNaN(n))
          .sort((a, b) => b - a);
        if (availableYears.length > 0) {
          setSelectedYear(availableYears[0]);
        }
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div
        className={`w-full border border-matrix-green/10 bg-[#010602] rounded flex items-center justify-center font-mono animate-pulse text-[#8b949e] p-3 ${s.loadingH} ${s.loadingFont}`}
        style={{ maxWidth: s.maxWidth }}
      >
        Initializing telemetry...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={`w-full border border-matrix-green/10 bg-[#010602] rounded flex items-center justify-center font-mono text-red-500 p-3 ${s.loadingH} ${s.loadingFont}`}
        style={{ maxWidth: s.maxWidth }}
      >
        GitHub link failed.
      </div>
    );
  }

  const years = Object.keys(data.total)
    .map(Number)
    .filter((n) => !isNaN(n))
    .sort((a, b) => b - a);

  const totalContributionsForSelectedYear = data.total[selectedYear.toString()] ?? 0;
  const weeks = buildYearGrid(selectedYear, data.contributions);
  const monthPositions = getMonthPositions(weeks);

  const CELL_SIZE = s.cell;
  const GAP = s.gap;
  const COL_WIDTH = s.colWidth;
  const yearColWidth = s.yearColWidth;

  return (
    <div
      style={{
        display: "flex",
        gap: s.outerGap,
        flexDirection: "row",
        alignItems: "stretch",
        width: resolvedSize === "sm" ? "auto" : "100%",
        maxWidth: s.maxWidth,
        fontFamily: "var(--font-mono), monospace",
      }}
    >
      {/* Left Area: Sleek and Compact Graph */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: "#010602",
          border: "1px solid rgba(0, 255, 65, 0.15)",
          borderRadius: s.borderRadius,
          padding: s.padding,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: s.headerMb,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#00ff41", fontSize: s.titleFont, fontWeight: 600 }}>
              {totalContributionsForSelectedYear} in {selectedYear}
            </span>
          </div>
          <a
            href="https://github.com/Aryaman-niboriya"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sfx.playClick()}
            onMouseEnter={() => sfx.playPing()}
            style={{
              color: "#00ff41",
              fontSize: s.viewFont,
              display: s.showView ? "inline" : "none",
              textDecoration: "none",
              border: "1px solid rgba(0, 255, 65, 0.2)",
              borderRadius: "3px",
              padding: "2px 8px",
              whiteSpace: "nowrap",
              backgroundColor: "rgba(0, 255, 65, 0.03)",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 255, 65, 0.1)";
              e.currentTarget.style.borderColor = "#00ff41";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0, 255, 65, 0.03)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 65, 0.2)";
            }}
          >
            GITHUB VIEW
          </a>
        </div>

        {/* Graph Scrollable Viewport */}
        <div style={{ overflowX: "auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", minWidth: "max-content" }}>
            {/* Month labels */}
            <div
              style={{
                position: "relative",
                display: "flex",
                marginLeft: s.monthMarginLeft,
                marginBottom: s.monthMb,
                height: s.monthHeight,
              }}
            >
              {monthPositions.map(({ label, col }) => (
                <div
                  key={`${label}-${col}`}
                  style={{
                    position: "absolute",
                    left: `${col * COL_WIDTH}px`,
                    color: "rgba(0, 255, 65, 0.4)",
                    fontSize: s.monthFont,
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Day labels + Grid */}
            <div style={{ display: "flex", gap: "2px" }}>
              {/* Day Labels */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: GAP,
                  marginRight: "4px",
                  paddingTop: "1px",
                }}
              >
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    style={{
                      height: CELL_SIZE,
                      color: "rgba(0, 255, 65, 0.4)",
                      fontSize: s.dayFont,
                      lineHeight: CELL_SIZE,
                      textAlign: "right",
                      width: s.dayLabelWidth,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {/* Grid Column Nodes */}
              <div style={{ display: "flex", gap: GAP }}>
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                    {week.map((day) => {
                      const color = LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0];
                      const glow = LEVEL_COLORS_GLOW[day.level] ?? "none";
                      const formattedDate = new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={day.date}
                          title={`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${formattedDate}`}
                          onMouseEnter={() => {
                            sfx.playPing();
                            setTooltip({ count: day.count, date: formattedDate });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                          onClick={() => sfx.playClick()}
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: "1px",
                            backgroundColor: color,
                            boxShadow: glow,
                            cursor: "pointer",
                            transition: "all 0.1s ease-in-out",
                            outline: tooltip?.date === formattedDate ? "1px solid #00ff41" : "none",
                          }}
                          onMouseOver={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.3)";
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div
          style={{
            display: s.showLegend ? "flex" : "none",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: s.legendMt,
            borderTop: "1px solid rgba(0, 255, 65, 0.08)",
            paddingTop: s.legendPt,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "8px",
              color: "#00ff41",
              textShadow: "0 0 3px rgba(0, 255, 65, 0.3)",
              maxWidth: "200px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tooltip ? `${tooltip.count} commit${tooltip.count !== 1 ? "s" : ""} // ${tooltip.date}` : "hover node for telemetry"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "1px",
                  backgroundColor: LEVEL_COLORS[lvl],
                  boxShadow: LEVEL_COLORS_GLOW[lvl],
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Area: Minimal Year Selectors */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: `${yearColWidth}px`,
        }}
      >
        {years.map((y) => {
          const isActive = selectedYear === y;
          return (
            <button
              key={y}
              onClick={() => {
                sfx.playClick();
                setSelectedYear(y);
              }}
              onMouseEnter={() => {
                sfx.playPing();
                setHoveredYear(y);
              }}
              onMouseLeave={() => setHoveredYear(null)}
              style={{
                width: "100%",
                padding: "4px 2px",
                borderRadius: "4px",
                fontSize: s.yearFont,
                fontWeight: 600,
                fontFamily: "var(--font-mono), monospace",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                backgroundColor: isActive ? "#00ff41" : "transparent",
                color: isActive ? "#000" : (hoveredYear === y ? "#00ff41" : "rgba(0, 255, 65, 0.5)"),
                border: isActive
                  ? "1px solid #00ff41"
                  : `1px solid ${hoveredYear === y ? "#00ff41" : "rgba(0, 255, 65, 0.1)"}`,
                boxShadow: isActive ? "0 0 6px rgba(0, 255, 65, 0.3)" : "none",
              }}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}
