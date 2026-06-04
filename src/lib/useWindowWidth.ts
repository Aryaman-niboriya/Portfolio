"use client";

import { useState, useEffect } from "react";

/** Returns current window.innerWidth, updated on resize. SSR-safe (returns 1024 before hydration). */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(1024);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

/**
 * Scale a pixel-art text pixelSize down proportionally to available width.
 * @param desiredPixelSize  – the ideal size at desktop
 * @param textLength        – number of characters in the text
 * @param availableWidth    – window.innerWidth (from useWindowWidth)
 * @param minSize           – floor (default 3)
 */
export function responsivePixelSize(
  desiredPixelSize: number,
  textLength: number,
  availableWidth: number,
  minSize = 3
): number {
  if (!textLength) return desiredPixelSize;

  // Each character is ~(5 cols * (pixelSize+gap)) + letterSpacing * (pixelSize+gap)
  // gap=1, letterSpacing=2 → charWidth = (5+2)*(ps+1) = 7*(ps+1)
  // totalWidth ≈ textLength * 7 * (ps+1) - 2*(ps+1)
  // Rough: totalWidth ≈ (textLength * 7 - 2) * (ps+1)
  const effectiveChars = textLength * 7 - 2;
  const padding = availableWidth < 640 ? 48 : availableWidth < 1024 ? 80 : 160;
  const maxWidth = availableWidth - padding;

  // Solve: effectiveChars * (ps+1) <= maxWidth
  const maxPs = Math.floor(maxWidth / effectiveChars) - 1;
  return Math.max(minSize, Math.min(desiredPixelSize, maxPs));
}
