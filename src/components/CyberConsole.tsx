"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal, X, Minimize2, Send, Cpu, Terminal as TermIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/AudioEngine";

interface LogLine {
  text: string;
  type: "input" | "system" | "error" | "success" | "ai";
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

const AI_RESPONSES = [
  { keywords: ["hi", "hello", "hey", "sup"], response: "Connection established. I am Aryaman's digital construct. Ask me anything about his projects, skills, or timeline!" },
  { keywords: ["project", "build", "sash", "pptcon", "resume"], response: "Aryaman specializes in AI integration. He built PPTCon (creating PowerPoint decks in 20 seconds using Gemini API) and ResumeAI (SaaS parsing resumes using prompt batching to reduce costs by 90%). Which one would you like to know more about?" },
  { keywords: ["skill", "stack", "react", "python", "node", "mongo"], response: "His primary stack is React, Node/Next.js, Python Flask, and MongoDB. He is extremely active in AI tools like LangChain, n8n, and OpenCV." },
  { keywords: ["job", "hire", "freelance", "opportunity", "work"], response: "Aryaman is open to freelance and high-impact full-stack roles. You can contact him at aryamaniboriya94@gmail.com or send a signal through the contact terminal below." },
  { keywords: ["challenge", "public", "github", "commit"], response: "He is currently running a 200+ days build-in-public challenge: coding daily, pushing commits, and shipping weekly updates!" },
];

export function CyberConsole({ onTriggerOverload }: { onTriggerOverload: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cli" | "ai">("cli");
  const [cliInput, setCliInput] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [cliHistory, setCliHistory] = useState<LogLine[]>([
    { text: "SYSTEM MAIN LINK: CONNECTED", type: "system" },
    { text: "Type 'help' to fetch active commands directory.", type: "success" },
  ]);
  const [aiChat, setAiChat] = useState<LogLine[]>([
    { text: "AI Construct active. Ask me about Aryaman's stack, projects, or work availability.", type: "ai" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cliHistory, aiChat, isAiTyping]);

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    sfx.playClick();
    const cmd = cliInput.trim().toLowerCase();
    const newHistory = [...cliHistory, { text: `guest@aryaman:~$ ${cliInput}`, type: "input" as const }];

    if (cmd === "help") {
      newHistory.push({
        text: `AVAILABLE COMMANDS:
- about    : Read professional summary
- skills   : Read skill competencies
- projects : Fetch repositories summary
- contact  : View verified link portals
- clear    : Clear terminal buffer
- hack     : Run system integrity check
- overload : Trigger core temperature warning
- ai       : Switch to AI Assistant module`,
        type: "system",
      });
    } else if (cmd === "clear") {
      setCliHistory([]);
      setCliInput("");
      return;
    } else if (cmd === "about" || cmd === "skills" || cmd === "projects" || cmd === "contact") {
      newHistory.push({ text: RESPONSES[cmd], type: "success" });
    } else if (cmd.startsWith("info ")) {
      const idx = cmd.replace("info ", "").trim();
      if (idx === "01") {
        newHistory.push({ text: "PPTCon: Generates full ppt decks from Gemini API under 20s. Features templating, converters, and an analytics board.", type: "success" });
      } else if (idx === "02") {
        newHistory.push({ text: "ResumeAI: Dual ATS scorer + Batch resume parser. Powered by Gemini Flash + n8n automation triggers.", type: "success" });
      } else if (idx === "03" || idx === "04") {
        newHistory.push({ text: "SignLang: Uses MediaPipe + Random Forest classifier to parse gestures to text streams in real-time.", type: "success" });
      } else {
        newHistory.push({ text: "Module ID not found. Use 'projects' to fetch valid modules.", type: "error" });
      }
    } else if (cmd === "ai") {
      setActiveTab("ai");
      newHistory.push({ text: "Switching focus to AI agent construct...", type: "system" });
    } else if (cmd === "hack") {
      newHistory.push({ text: "WARNING: ROOT ENCRYPTION ACTIVE. ATTEMPTING BRUTEFORCE...", type: "error" });
      setTimeout(() => {
        setCliHistory(prev => [...prev, { text: "FIREWALL DETECTED. ACCESS REFUSED. CORE THREAT LEVEL: STABLE.", type: "error" }]);
        sfx.playGlitch();
      }, 1000);
    } else if (cmd === "overload") {
      newHistory.push({ text: "CRITICAL OVERLOAD TRIGGERED. INITIATING CORE VENTING PROCESS...", type: "error" });
      sfx.playGlitch();
      setTimeout(() => {
        onTriggerOverload();
        setIsOpen(false);
      }, 1500);
    } else {
      newHistory.push({ text: `Shell command not recognized: "${cliInput}". Type "help" for instructions.`, type: "error" });
    }

    setCliHistory(newHistory);
    setCliInput("");
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiTyping) return;

    sfx.playClick();
    const userQuery = aiInput.trim();
    setAiChat(prev => [...prev, { text: userQuery, type: "input" }]);
    setAiInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      // Find matching response
      const matched = AI_RESPONSES.find(item => 
        item.keywords.some(word => userQuery.toLowerCase().includes(word))
      );
      
      const reply = matched 
        ? matched.response 
        : "Signal received, but AI database is restricted. Try asking about 'skills', 'projects', 'build-in-public', or 'hiring'.";

      setAiChat(prev => [...prev, { text: reply, type: "ai" }]);
      setIsAiTyping(false);
      sfx.playPing();
    }, 1200);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => {
            setIsOpen(!isOpen);
            sfx.playPing();
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-void-black border border-matrix-green/30 text-matrix-green rounded-full shadow-[0_0_20px_rgba(0,255,65,0.25)] flex items-center justify-center hover:border-matrix-green hover:shadow-[0_0_25px_rgba(0,255,65,0.45)] transition-all cursor-pointer"
        >
          {isOpen ? <X size={20} /> : <TermIcon size={20} className="animate-pulse" />}
        </motion.button>
      </div>

      {/* Console Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[450px] h-[500px] bg-void-black/95 border border-matrix-green/20 shadow-[0_0_35px_rgba(0,255,65,0.15)] z-50 font-mono flex flex-col backdrop-blur-md rounded"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-matrix-green/20 px-4 py-3 bg-matrix-green/5 text-matrix-green">
              <div className="flex items-center gap-2 text-xs select-none">
                <Terminal size={14} className="animate-pulse" />
                <span>CYBER_DECK_v5.0.0</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setIsOpen(false); sfx.playPing(); }}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  <Minimize2 size={13} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-matrix-green/10 text-xs">
              <button
                onClick={() => { setActiveTab("cli"); sfx.playPing(); }}
                className={`flex-1 py-2.5 text-center border-r border-matrix-green/10 transition-colors cursor-pointer ${
                  activeTab === "cli" ? "bg-matrix-green/10 text-matrix-green" : "text-matrix-green/45 hover:text-matrix-green/75"
                }`}
              >
                [01] CLI MODULE
              </button>
              <button
                onClick={() => { setActiveTab("ai"); sfx.playPing(); }}
                className={`flex-1 py-2.5 text-center transition-colors cursor-pointer ${
                  activeTab === "ai" ? "bg-matrix-green/10 text-matrix-green" : "text-matrix-green/45 hover:text-matrix-green/75"
                }`}
              >
                [02] AI CONSTRUCT
              </button>
            </div>

            {/* Console Log Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-matrix-green/20">
              {activeTab === "cli" ? (
                <>
                  {cliHistory.map((line, idx) => (
                    <div
                      key={idx}
                      className={`text-xs whitespace-pre-wrap leading-relaxed ${
                        line.type === "input" ? "text-matrix-green" :
                        line.type === "system" ? "text-matrix-green/50" :
                        line.type === "success" ? "text-matrix-green/80" :
                        "text-red-500"
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {aiChat.map((line, idx) => (
                    <div
                      key={idx}
                      className={`text-xs whitespace-pre-wrap leading-relaxed ${
                        line.type === "input" ? "text-matrix-green border-l border-matrix-green/20 pl-2 text-right opacity-85" : "text-matrix-green/90 bg-matrix-green/5 p-2 border border-matrix-green/10 rounded"
                      }`}
                    >
                      {line.type === "input" ? "" : "AI_CONSTRUCT: "}
                      {line.text}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="text-xs text-matrix-green/40 animate-pulse flex items-center gap-2">
                      <Cpu size={12} className="animate-spin" />
                      <span>Decrypting query telemetry...</span>
                    </div>
                  )}
                </>
              )}
              <div ref={consoleEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-matrix-green/20 bg-void-black">
              {activeTab === "cli" ? (
                <form onSubmit={handleCliSubmit} className="flex items-center gap-2">
                  <span className="text-xs text-matrix-green/60 select-none">guest@aryaman:~$</span>
                  <input
                    type="text"
                    value={cliInput}
                    onChange={(e) => {
                      setCliInput(e.target.value);
                      if (e.target.value.length % 2 === 0) sfx.playClick();
                    }}
                    placeholder="Type help..."
                    className="flex-1 bg-transparent text-xs text-matrix-green outline-none placeholder-matrix-green/25 font-mono"
                    autoFocus
                  />
                  <button type="submit" className="text-matrix-green/40 hover:text-matrix-green transition-colors cursor-pointer">
                    <Send size={14} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAiSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => {
                      setAiInput(e.target.value);
                      if (e.target.value.length % 2 === 0) sfx.playClick();
                    }}
                    disabled={isAiTyping}
                    placeholder="Ask Aryaman's AI construct..."
                    className="flex-1 bg-transparent text-xs text-matrix-green outline-none placeholder-matrix-green/25 font-mono disabled:opacity-50"
                  />
                  <button type="submit" disabled={isAiTyping} className="text-matrix-green/40 hover:text-matrix-green transition-colors disabled:opacity-30 cursor-pointer">
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
