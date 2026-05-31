"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Minimize2, Send, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/AudioEngine";

interface LogLine {
  text: string;
  type: "input" | "system" | "error" | "success" | "ai";
}

const AI_RESPONSES = [
  { keywords: ["hi", "hello", "hey", "sup"], response: "Connection established. I am Aryaman's digital construct. Ask me anything about his projects, skills, or timeline!" },
  { keywords: ["project", "build", "sash", "pptcon", "resume"], response: "Aryaman specializes in AI integration. He built PPTCon (creating PowerPoint decks in 20 seconds using Gemini API) and ResumeAI (SaaS parsing resumes using prompt batching to reduce costs by 90%). Which one would you like to know more about?" },
  { keywords: ["skill", "stack", "react", "python", "node", "mongo"], response: "His primary stack is React, Node/Next.js, Python Flask, and MongoDB. He is extremely active in AI tools like LangChain, n8n, and OpenCV." },
  { keywords: ["job", "hire", "freelance", "opportunity", "work"], response: "Aryaman is open to freelance and high-impact full-stack roles. You can contact him at aryamaniboriya94@gmail.com or send a signal through the contact terminal below." },
  { keywords: ["challenge", "public", "github", "commit"], response: "He is currently running a 200+ days build-in-public challenge: coding daily, pushing commits, and shipping weekly updates!" },
];

export function CyberConsole({ onTriggerOverload }: { onTriggerOverload: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<LogLine[]>([
    { text: "AI Construct active. Ask me about Aryaman's stack, projects, or work availability.", type: "ai" }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiChat, isAiTyping]);

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim() || isAiTyping) return;

    sfx.playClick();
    const userQuery = aiInput.trim();
    setAiChat(prev => [...prev, { text: userQuery, type: "input" }]);
    setAiInput("");
    setIsAiTyping(true);

    setTimeout(() => {
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

  // Suppress unused-variable warning — onTriggerOverload is kept for interface compatibility
  void onTriggerOverload;

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {!isOpen && (
            <span className="absolute -top-10 right-0 text-[9px] font-mono text-matrix-green/70 whitespace-nowrap bg-void-black border border-matrix-green/20 px-2 py-1 pointer-events-none">
              AI Assistant Online // Ask me anything
            </span>
          )}
          <motion.button
            onMouseEnter={() => sfx.playPing()}
            onClick={() => { setIsOpen(!isOpen); sfx.playClick(); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-void-black border border-matrix-green/30 text-matrix-green rounded-full shadow-[0_0_20px_rgba(0,255,65,0.25)] flex items-center justify-center hover:border-matrix-green hover:shadow-[0_0_25px_rgba(0,255,65,0.45)] transition-all cursor-pointer"
          >
            {isOpen ? <X size={20} /> : <Bot size={20} className="animate-pulse" />}
          </motion.button>
        </div>
      </div>

      {/* AI Chat Panel */}
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
                <Bot size={14} className="animate-pulse" />
                <span>AI_CONSTRUCT // Online</span>
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

            {/* AI Chat Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-matrix-green/20">
              {aiChat.map((line, idx) => (
                <div
                  key={idx}
                  className={`text-xs whitespace-pre-wrap leading-relaxed ${
                    line.type === "input"
                      ? "text-matrix-green border-l border-matrix-green/20 pl-2 text-right opacity-85"
                      : "text-matrix-green/90 bg-matrix-green/5 p-2 border border-matrix-green/10 rounded"
                  }`}
                >
                  {line.type !== "input" && "AI_CONSTRUCT: "}
                  {line.text}
                </div>
              ))}
              {isAiTyping && (
                <div className="text-xs text-matrix-green/40 animate-pulse flex items-center gap-2">
                  <Cpu size={12} className="animate-spin" />
                  <span>Decrypting query telemetry...</span>
                </div>
              )}
              <div ref={consoleEndRef} />
            </div>

            {/* AI Input Form */}
            <div className="p-3 border-t border-matrix-green/20 bg-void-black">
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
                <button
                  type="submit"
                  disabled={isAiTyping}
                  className="text-matrix-green/40 hover:text-matrix-green transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
