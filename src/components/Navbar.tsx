"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BinaryTextCanvas } from "./BinaryTextCanvas";
import { cn } from "@/lib/utils";
import { sfx } from "@/lib/AudioEngine";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setIsMuted(sfx.isMuted());
  }, []);

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
        "fixed top-0 left-0 right-0 z-[1000] w-full transition-all duration-500",
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-matrix-green/20 shadow-[0_0_20px_rgba(0,255,65,0.1)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] w-full mx-auto flex justify-between items-center px-4 sm:px-8 min-h-[var(--nav-height)] py-2 md:py-4 lg:py-5">
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
                    onMouseEnter={() => sfx.playPing()}
                    onClick={() => sfx.playClick()}
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

            {/* Sound FX Controller */}
            <div className="flex items-center gap-3">
              <button
                onMouseEnter={() => sfx.playPing()}
                onClick={() => {
                  const target = !isMuted;
                  setIsMuted(target);
                  sfx.setMuted(target);
                  sfx.playPing();
                }}
                className="flex items-center gap-2 px-3 py-1.5 border border-matrix-green/20 hover:border-matrix-green/50 bg-matrix-green/5 hover:bg-matrix-green/10 text-matrix-green transition-all rounded cursor-pointer group"
                title={isMuted ? "Unmute sound effects" : "Mute sound effects"}
              >
                <div className="flex items-center gap-0.5 h-3">
                  <span className={cn("w-[2px] bg-matrix-green rounded-full transition-all duration-200", isMuted ? "h-1" : "h-3 animate-pulse")} />
                  <span className={cn("w-[2px] bg-matrix-green rounded-full transition-all duration-200 delay-75", isMuted ? "h-1" : "h-2 animate-pulse")} style={{ animationDelay: "0.15s" }} />
                  <span className={cn("w-[2px] bg-matrix-green rounded-full transition-all duration-200 delay-150", isMuted ? "h-1" : "h-3 animate-pulse")} style={{ animationDelay: "0.3s" }} />
                </div>
                <span className="font-mono text-[9px] tracking-widest font-bold text-matrix-green/60 group-hover:text-matrix-green">
                  SFX: {isMuted ? "MUTED" : "ON"}
                </span>
              </button>
            </div>

            {/* Terminal Status Icon */}
            <div className="hidden lg:flex flex-col items-end border-r-2 border-matrix-green/40 pr-4">
                <span className="font-mono text-[8px] text-matrix-green/40">LATENCY: 12ms</span>
                <span className="font-mono text-[8px] text-matrix-green/40">PORT: 3000</span>
            </div>
        </div>

        <div className="md:hidden">
            <motion.div 
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => sfx.playPing()}
                onClick={() => { sfx.playClick(); setMobileOpen(o => !o); }}
                className="w-10 h-10 border border-matrix-green/30 flex items-center justify-center rounded-sm bg-matrix-green/5 cursor-pointer"
            >
                <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                  <span className={cn("w-5 h-[1.5px] bg-matrix-green transition-transform duration-300 origin-left", mobileOpen && "rotate-45 translate-x-[3px] -translate-y-[1px]")} />
                  <span className={cn("w-5 h-[1.5px] bg-matrix-green transition-opacity duration-300", mobileOpen && "opacity-0")} />
                  <span className={cn("w-5 h-[1.5px] bg-matrix-green transition-transform duration-300 origin-left", mobileOpen && "-rotate-45 translate-x-[3px] translate-y-[1px]")} />
                </div>
            </motion.div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-matrix-green/15 bg-black/80 backdrop-blur-xl"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <a
                    href={link.href}
                    onClick={() => { sfx.playClick(); setMobileOpen(false); }}
                    className="flex items-center justify-between py-3 border-b border-matrix-green/10 group"
                  >
                    <span className="font-mono text-[11px] text-matrix-green/60 group-hover:text-matrix-green transition-colors uppercase tracking-widest font-bold">
                      {link.name}
                    </span>
                    <span className="font-mono text-[8px] text-matrix-green/20 group-hover:text-matrix-green/60 transition-colors">0{i+1}_NODE ›</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
