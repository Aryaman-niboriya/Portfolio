"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BinaryImageProps {
  src: string;
  className?: string;
  resolution?: number; // Size of each binary block
}

export const BinaryImage: React.FC<BinaryImageProps> = ({
  src,
  className,
  resolution = 8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      const scale = container.clientWidth / img.width;
      const width = container.clientWidth;
      const height = img.height * scale;

      setDimensions({ width, height });

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height).data;

      ctx.fillStyle = "#010602"; // Match background
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${resolution}px monospace`;
      ctx.textBaseline = "top";

      for (let y = 0; y < height; y += resolution) {
        for (let x = 0; x < width; x += resolution) {
          const index = (Math.floor(y) * width + Math.floor(x)) * 4;
          const r = imageData[index];
          const g = imageData[index + 1];
          const b = imageData[index + 2];
          const brightness = (r + g + b) / 3;

          if (brightness > 15) {
              const opacity = Math.min(1, (brightness / 255) * 2.5 + 0.2);
              ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
              // Use different characters based on brightness
              const char = brightness > 120 ? "1" : "0";
              ctx.fillText(char, x, y);
              
              // Add a subtle glow for very bright spots
              if (brightness > 200) {
                  ctx.shadowBlur = 5;
                  ctx.shadowColor = "#00ff41";
                  ctx.fillText(char, x, y);
                  ctx.shadowBlur = 0;
              }
          }
        }
      }
    };
  }, [src, resolution]);

  return (
    <div className={cn("relative overflow-hidden border border-matrix-green/20", className)}>
      <canvas ref={canvasRef} className="block w-full h-auto" />
      <div className="absolute inset-0 bg-gradient-to-t from-void-darker via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
