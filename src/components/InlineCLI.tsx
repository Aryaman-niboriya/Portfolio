"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send } from "lucide-react";
import { motion } from "framer-motion";
import { sfx } from "@/lib/AudioEngine";

interface LogLine {
  text: string;
  type: "input" | "system" | "error" | "success" | "ai";
}

interface InlineCLIProps {
  onTriggerOverload: () => void;
}

const RESPONSES: Record<string, string> = {
  about: `SYSTEM DECRYPT: ENTITY ARYAMAN NIBORIYA
----------------------------------------
- ROLE: Full Stack Developer / AI Builder
- LOCATION: Gwalior, India (IST UTC+5:30)
- STATUS: Building in public daily (Day 200+)
- BIO: Turning machine learning algorithms and full-stack modules into production-grade solutions. React/Next.js for interfaces, Python/Flask for intelligence backends.`,

  skills: `DECRYPTING SKILL MATRIX...
----------------------------------------
- FRONTEND: React, Next.js, HTML5, CSS3, JavaScript, TailwindCSS
- BACKEND : Python, Flask, Node.js
- DATABASE: MongoDB
- UTILITIES: Git, LangChain, n8n, MediaPipe, OpenCV`,

  projects: `DECRYPTING MODULE REGISTRY...
----------------------------------------
- MODULE 01: PPTCon (AI Presentation Builder) - React, Flask, Gemini, MongoDB
- MODULE 02: ResumeAI (ATS Tracker & SaaS) - React, Flask, Gemini, n8n
- MODULE 03: SignLang (Real-time Translator) - MediaPipe, OpenCV, Flask, React
- Type: "info [num]" (e.g. "info 02") for specific details.`,

  contact: `COMMUNICATION PORTS SECURED...
----------------------------------------
- EMAIL    : aryamaniboriya94@gmail.com
- GITHUB   : github.com/Aryaman-niboriya
- LINKEDIN : linkedin.com/in/aryaman-niboriya-474191360/
- TWITTER  : @aryaman_dev
- Status   : Listening for incoming signals. Uplink active.`,
};

export function InlineCLI({ onTriggerOverload }: InlineCLIProps) {
  const [cliInput, setCliInput] = useState("");
  const [cliHistory, setCliHistory] = useState<LogLine[]>([
    { text: "SYSTEM MAIN LINK: CONNECTED", type: "system" },
    { text: "Type 'help' to fetch active commands directory.", type: "success" },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cliHistory]);

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    sfx.playClick();
    const cmd = cliInput.trim().toLowerCase();
    const newHistory: LogLine[] = [
      ...cliHistory,
      { text: `guest@aryaman:~$ ${cliInput}`, type: "input" },
    ];

    if (cmd === "help") {
      newHistory.push({
        text: `AVAILABLE COMMANDS:
- about    : Read professional summary
- skills   : Read skill competencies
- projects : Fetch repositories summary
- contact  : View verified link portals
- clear    : Clear terminal buffer
- hack     : Run system integrity check
- overload : Trigger core temperature warning`,
        type: "system",
      });
    } else if (cmd === "clear") {
      setCliHistory([]);
      setCliInput("");
      return;
    } else if (
      cmd === "about" ||
      cmd === "skills" ||
      cmd === "projects" ||
      cmd === "contact"
    ) {
      newHistory.push({ text: RESPONSES[cmd], type: "success" });
    } else if (cmd.startsWith("info ")) {
      const idx = cmd.replace("info ", "").trim();
      if (idx === "01") {
        newHistory.push({
          text: "PPTCon: Generates full ppt decks from Gemini API under 20s. Features templating, converters, and an analytics board.",
          type: "success",
        });
      } else if (idx === "02") {
        newHistory.push({
          text: "ResumeAI: Dual ATS scorer + Batch resume parser. Powered by Gemini Flash + n8n automation triggers.",
          type: "success",
        });
      } else if (idx === "03" || idx === "04") {
        newHistory.push({
          text: "SignLang: Uses MediaPipe + Random Forest classifier to parse gestures to text streams in real-time.",
          type: "success",
        });
      } else {
        newHistory.push({
          text: "Module ID not found. Use 'projects' to fetch valid modules.",
          type: "error",
        });
      }
    } else if (cmd === "hack") {
      newHistory.push({
        text: "WARNING: ROOT ENCRYPTION ACTIVE. ATTEMPTING BRUTEFORCE...",
        type: "error",
      });
      setCliHistory(newHistory);
      setCliInput("");
      setTimeout(() => {
        setCliHistory((prev) => [
          ...prev,
          {
            text: "FIREWALL DETECTED. ACCESS REFUSED. CORE THREAT LEVEL: STABLE.",
            type: "error",
          },
        ]);
        sfx.playGlitch();
      }, 1000);
      return;
    } else if (cmd === "overload") {
      newHistory.push({
        text: "CRITICAL OVERLOAD TRIGGERED. INITIATING CORE VENTING PROCESS...",
        type: "error",
      });
      sfx.playGlitch();
      setCliHistory(newHistory);
      setCliInput("");
      setTimeout(() => {
        onTriggerOverload();
      }, 1500);
      return;
    } else {
      newHistory.push({
        text: `Shell command not recognized: "${cliInput}". Type "help" for instructions.`,
        type: "error",
      });
    }

    setCliHistory(newHistory);
    setCliInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Section label */}
      <p className="font-mono text-[11px] text-matrix-green/25 mb-6 uppercase tracking-widest text-center">
        ── SECTION 03 ──
      </p>
      <div className="flex justify-center mb-8">
        <span className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">
          [03] CORE SHELL
        </span>
      </div>

      {/* Terminal box */}
      <div className="w-full max-w-4xl mx-auto border border-matrix-green/20 bg-void-black/95 font-mono backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-matrix-green/20 px-4 py-3 bg-matrix-green/5 text-matrix-green text-xs">
          <div className="flex items-center gap-2 select-none">
            <Terminal size={14} className="animate-pulse" />
            <span>CORE_SHELL_v1.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/30 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/15 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/05 inline-block" />
          </div>
        </div>

        {/* Log area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 h-[380px]">
          {cliHistory.map((line, idx) => (
            <div
              key={idx}
              className={`text-xs whitespace-pre-wrap leading-relaxed ${
                line.type === "input"
                  ? "text-matrix-green"
                  : line.type === "system"
                  ? "text-matrix-green/50"
                  : line.type === "success"
                  ? "text-matrix-green/80"
                  : "text-red-500"
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-matrix-green/20 bg-void-black">
          <form onSubmit={handleCliSubmit} className="flex items-center gap-2">
            <span className="text-xs text-matrix-green/60 select-none">
              guest@aryaman:~$
            </span>
            <input
              type="text"
              value={cliInput}
              onChange={(e) => setCliInput(e.target.value)}
              onFocus={() => sfx.playPing()}
              placeholder="Type help..."
              className="flex-1 bg-transparent text-xs text-matrix-green outline-none placeholder-matrix-green/25 font-mono"
            />
            <button
              type="submit"
              className="text-matrix-green/40 hover:text-matrix-green transition-colors cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
