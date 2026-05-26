"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Section = ({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <section
      id={id}
      className={cn(
        "min-h-screen relative flex items-center justify-center py-20 px-6 md:px-20 overflow-hidden",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-7xl z-10"
      >
        {children}
      </motion.div>
    </section>
  );
};
