"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BinaryTextProps {
  text: string;
  className?: string;
  binaryClassName?: string;
  revealSpeed?: number;
}

export const BinaryText: React.FC<BinaryTextProps> = ({
  text,
  className,
  binaryClassName,
  revealSpeed = 0.05,
}) => {
  const [displayText, setDisplayText] = useState("");
  const binaryChars = "01";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return binaryChars[Math.floor(Math.random() * 2)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className={cn("font-mono tracking-tighter", className)}>
      {displayText}
    </div>
  );
};

export const BinaryDotMatrix: React.FC<{ text: string, className?: string }> = ({ text, className }) => {
  // A more complex version that actually renders text using a grid of 0s and 1s
  // This is a placeholder for a more advanced canvas-based implementation if needed
  return (
    <div className={cn("inline-block", className)}>
       <BinaryText text={text} className="text-4xl md:text-7xl font-bold uppercase" />
    </div>
  );
};
