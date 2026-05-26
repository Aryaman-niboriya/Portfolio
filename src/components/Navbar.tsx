"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BinaryTextCanvas } from "./BinaryTextCanvas";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "ABOUT", href: "#about" },
    { name: "SKILLS", href: "#skills" },
    { name: "PROJECTS", href: "#projects" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] px-8 py-4 transition-all duration-500",
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-matrix-green/20 py-2 shadow-[0_0_20px_rgba(0,255,65,0.1)]" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">
        {/* Left Side: System Status / Brand */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
        >
          <div className="flex flex-col gap-1 border-l-2 border-matrix-green/40 pl-3">
             <span className="font-mono text-[10px] text-matrix-green font-bold tracking-[0.2em]">ARYAMAN_OS</span>
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-matrix-green animate-pulse" />
                <span className="font-mono text-[8px] text-matrix-green/50 uppercase">Session: Active</span>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Links */}
        <div className="flex items-center gap-12">
            <ul className="hidden md:flex gap-10">
            {navLinks.map((link, i) => (
                <motion.li
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
                >
                <a
                    href={link.href}
                    className="flex flex-col items-end transition-all duration-300"
                >
                    <span className="font-mono text-[8px] text-matrix-green/20 group-hover:text-matrix-green/60 transition-colors uppercase tracking-widest">0{i+1}_NODE</span>
                    <span className="font-mono text-[12px] text-matrix-green/60 group-hover:text-matrix-green group-hover:drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-all uppercase tracking-widest font-bold">
                        {link.name}
                    </span>
                    <motion.div 
                        className="h-px bg-matrix-green w-0 group-hover:w-full transition-all duration-300"
                        layoutId="nav-underline"
                    />
                </a>
                </motion.li>
            ))}
            </ul>

            {/* Terminal Status Icon */}
            <div className="hidden lg:flex flex-col items-end border-r-2 border-matrix-green/40 pr-4">
                <span className="font-mono text-[8px] text-matrix-green/40">LATENCY: 12ms</span>
                <span className="font-mono text-[8px] text-matrix-green/40">PORT: 3000</span>
            </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
            <motion.div 
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 border border-matrix-green/30 flex items-center justify-center rounded-sm bg-matrix-green/5"
            >
                <div className="w-5 h-[1px] bg-matrix-green relative before:absolute before:content-[''] before:w-full before:h-full before:bg-matrix-green before:-top-1.5 after:absolute after:content-[''] after:w-full after:h-full after:bg-matrix-green after:top-1.5" />
            </motion.div>
        </div>
      </div>
    </nav>
  );
};
