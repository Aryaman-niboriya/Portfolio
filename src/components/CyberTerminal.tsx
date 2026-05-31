"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, Play } from "lucide-react";
import { sfx } from "@/lib/AudioEngine";

interface LogLine {
  text: string;
  type: "input" | "system" | "error" | "success";
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

export function CyberTerminal({ onTriggerOverload }: { onTriggerOverload: () => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<LogLine[]>([
    { text: "SYSTEM ACTIVE: CORE TERMINAL SHELL CONNECTED", type: "system" },
    { text: "Type 'help' to print list of active shell commands.", type: "success" },
  ]);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sfx.playClick();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { text: `guest@aryaman:~$ ${input}`, type: "input" as const }];

    if (cmd === "help") {
      newHistory.push({
        text: `AVAILABLE COMMANDS:
- about    : Read professional bio and summary
- skills   : Print technical skill competencies
- projects : Fetch modular production projects
- contact  : View verified communication port anchors
- clear    : Purge current screen terminal buffer
- hack     : Execute deep core integrity analysis
- overload : Trigger critical temperature threshold`,
        type: "system",
      });
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (cmd === "about" || cmd === "skills" || cmd === "projects" || cmd === "contact") {
      newHistory.push({ text: RESPONSES[cmd], type: "success" });
    } else if (cmd.startsWith("info ")) {
      const idx = cmd.replace("info ", "").trim();
      if (idx === "01") {
        newHistory.push({ text: "PPTCon: AI presentation maker compiling full decks in under 20s using Gemini and template engines.", type: "success" });
      } else if (idx === "02") {
        newHistory.push({ text: "ResumeAI: Automated candidate scanning and semantic ATS scoring dashboard integrated with n8n triggers.", type: "success" });
      } else if (idx === "03" || idx === "04") {
        newHistory.push({ text: "SignLang: Translates real-time webcam gestures to digital text strings via MediaPipe landmarks.", type: "success" });
      } else {
        newHistory.push({ text: "Target module ID not found. Use 'projects' to fetch valid IDs.", type: "error" });
      }
    } else if (cmd === "hack") {
      newHistory.push({ text: "WARNING: ATTEMPTING FIRMWARE BYPASS... ROOT EXPLOIT INITIALIZED.", type: "error" });
      sfx.playGlitch();
      setTimeout(() => {
        setHistory(prev => [...prev, { text: "FIREWALL DETECTED: ACCESS TERMINATED. ENCRYPTION KEYS ROTATED.", type: "error" }]);
        sfx.playGlitch();
      }, 1200);
    } else if (cmd === "overload") {
      newHistory.push({ text: "WARNING: CORE THERMAL THRESHOLD VENTING BLOCKED. CORE MELTDOWN IMMINENT.", type: "error" });
      sfx.playGlitch();
      setTimeout(() => {
        onTriggerOverload();
      }, 1200);
    } else {
      newHistory.push({ text: `Unknown command directive: "${input}". Type "help" for syntax directories.`, type: "error" });
    }

    setHistory(newHistory);
    setInput("");
  };

  return (
    <div 
      className="w-full max-w-4xl border border-matrix-green/15 bg-void-black/80 rounded shadow-[0_0_40px_rgba(0,255,65,0.06)] font-mono flex flex-col h-[400px] overflow-hidden"
      onMouseEnter={() => sfx.playPing()}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-matrix-green/15 bg-matrix-green/5 text-matrix-green text-xs select-none">
        <div className="flex items-center gap-2 font-bold tracking-widest">
          <Terminal size={14} className="animate-pulse" />
          <span>guest@aryaman_os: ~</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-55">
          <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/30" />
          <span className="w-2.5 h-2.5 rounded-full bg-matrix-green/30" />
        </div>
      </div>

      {/* Terminal logs buffer */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`text-xs md:text-sm whitespace-pre-wrap leading-relaxed ${
              line.type === "input" ? "text-matrix-green font-semibold" :
              line.type === "system" ? "text-matrix-green/45" :
              line.type === "success" ? "text-matrix-green/80" :
              "text-red-500 animate-pulse"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Inputs bar */}
      <form onSubmit={handleSubmit} className="border-t border-matrix-green/15 p-3.5 bg-void-black/95 flex items-center gap-2">
        <span className="text-xs md:text-sm text-matrix-green/55 select-none">guest@aryaman:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.length % 2 === 0) sfx.playClick();
          }}
          placeholder="Type help and press enter..."
          className="flex-1 bg-transparent text-xs md:text-sm text-matrix-green outline-none placeholder-matrix-green/20 font-mono"
          autoFocus
        />
        <button type="submit" className="text-matrix-green/40 hover:text-matrix-green transition-colors cursor-pointer p-1">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
