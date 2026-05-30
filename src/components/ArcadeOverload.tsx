"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShieldAlert, RefreshCw, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sfx } from "@/lib/AudioEngine";

interface ArcadeOverloadProps {
  onClose: () => void;
}

export function ArcadeOverload({ onClose }: ArcadeOverloadProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "gameover" | "victory">("intro");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const scoreRef = useRef(0);
  const healthRef = useRef(3);
  const stateRef = useRef(gameState);
  
  useEffect(() => {
    scoreRef.current = score;
    healthRef.current = health;
    stateRef.current = gameState;
  }, [score, health, gameState]);

  // Audio trigger on overload launch
  useEffect(() => {
    sfx.playGlitch();
    const interval = setInterval(() => {
      if (stateRef.current === "intro") {
        sfx.playGlitch();
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const startGame = () => {
    setScore(0);
    setHealth(3);
    scoreRef.current = 0;
    healthRef.current = 3;
    setGameState("playing");
    sfx.playBeep();
  };

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 500;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Game variables
    let playerX = canvas.width / 2;
    const playerWidth = 60;
    const playerHeight = 20;
    const laserSpeed = 8;
    const bugSpeed = 2.5;
    const spawnRate = 45; // lower is faster
    
    let lasers: { x: number; y: number }[] = [];
    let bugs: { x: number; y: number; val: string; speed: number }[] = [];
    let particles: { x: number; y: number; vx: number; vy: number; color: string; life: number }[] = [];
    let frame = 0;
    let keys: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key] = true;
      if (e.key === " " || e.key === "ArrowUp") {
        lasers.push({ x: playerX, y: canvas.height - playerHeight - 10 });
        sfx.playLaser();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key] = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      playerX = e.clientX - rect.left;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        playerX = e.touches[0].clientX - rect.left;
      }
    };
    const handleCanvasClick = () => {
      lasers.push({ x: playerX, y: canvas.height - playerHeight - 10 });
      sfx.playLaser();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("click", handleCanvasClick);

    let animationId: number;

    const updateGame = () => {
      frame++;
      
      // Clear canvas
      ctx.fillStyle = "rgba(10, 0, 0, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Retro CRT Grid Lines
      ctx.strokeStyle = "rgba(0, 255, 65, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Input handling
      if (keys["ArrowLeft"] || keys["a"]) playerX = Math.max(playerWidth / 2, playerX - 7);
      if (keys["ArrowRight"] || keys["d"]) playerX = Math.min(canvas.width - playerWidth / 2, playerX + 7);

      // Draw player turret
      ctx.fillStyle = "#00ff41";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00ff41";
      ctx.fillRect(playerX - playerWidth / 2, canvas.height - playerHeight - 5, playerWidth, playerHeight);
      ctx.fillRect(playerX - 6, canvas.height - playerHeight - 12, 12, 8); // barrel
      ctx.shadowBlur = 0;

      // Spawn bugs
      if (frame % spawnRate === 0) {
        bugs.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: -20,
          val: Math.random() > 0.5 ? "0" : "1",
          speed: bugSpeed + Math.random() * 1.5,
        });
      }

      // Update & Draw lasers
      ctx.fillStyle = "#39ff14";
      lasers.forEach((l, idx) => {
        l.y -= laserSpeed;
        ctx.fillRect(l.x - 2, l.y, 4, 15);
        if (l.y < 0) lasers.splice(idx, 1);
      });

      // Update & Draw bugs
      bugs.forEach((b, bIdx) => {
        b.y += b.speed;
        
        // Draw bug
        ctx.fillStyle = "#ff2a2a";
        ctx.font = "bold 20px monospace";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff2a2a";
        ctx.fillText(b.val, b.x - 5, b.y);
        ctx.shadowBlur = 0;

        // Collision check with player lasers
        lasers.forEach((l, lIdx) => {
          const dist = Math.hypot(l.x - b.x, l.y - b.y);
          if (dist < 22) {
            // Spawn explosion particles
            for (let i = 0; i < 8; i++) {
              particles.push({
                x: b.x,
                y: b.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: "#ff2a2a",
                life: 30,
              });
            }
            sfx.playExplosion();
            bugs.splice(bIdx, 1);
            lasers.splice(lIdx, 1);
            
            const newScore = scoreRef.current + 10;
            scoreRef.current = newScore;
            setScore(newScore);

            if (newScore >= 100) {
              setGameState("victory");
              sfx.playBeep();
            }
          }
        });

        // Bug reaches bottom
        if (b.y > canvas.height) {
          bugs.splice(bIdx, 1);
          const newHealth = healthRef.current - 1;
          healthRef.current = newHealth;
          setHealth(newHealth);
          sfx.playGlitch();
          
          if (newHealth <= 0) {
            setGameState("gameover");
          }
        }
      });

      // Draw & Update particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if (p.life <= 0) particles.splice(idx, 1);
      });

      if (stateRef.current === "playing") {
        animationId = requestAnimationFrame(updateGame);
      }
    };

    updateGame();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [gameState]);

  return (
    <div className="fixed inset-0 bg-void-darker/95 z-[999] flex flex-col justify-center items-center font-mono p-6 backdrop-blur-md overflow-hidden">
      {/* CRT Scanline scan effects */}
      <div className="absolute inset-0 pointer-events-none bg-crt-glow/5 mix-blend-color-dodge select-none z-[1000] scanline opacity-80" />
      
      <div className="max-w-3xl w-full border border-red-500/35 bg-void-black/90 p-8 shadow-[0_0_50px_rgba(255,42,42,0.2)] relative rounded flex flex-col items-center">
        {/* Top Glitch Header */}
        <div className="flex items-center justify-between w-full border-b border-red-500/20 pb-4 mb-6">
          <div className="flex items-center gap-3 text-red-500 animate-pulse text-xs md:text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span className="tracking-[0.2em] font-bold">SYSTEM OVERLOAD: DIAGNOSTIC PROTOCOL</span>
          </div>
          <button 
            onClick={() => { onClose(); sfx.playPing(); }}
            className="text-red-500/50 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Screens */}
        <AnimatePresence mode="wait">
          {gameState === "intro" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 flex flex-col items-center py-8"
            >
              <h2 className="text-red-500 text-lg md:text-xl font-bold tracking-widest animate-bounce">
                !!! EMERGENCY FIREWALL INTRUSION !!!
              </h2>
              <p className="text-matrix-green/60 text-xs md:text-sm max-w-lg leading-relaxed">
                Binary glitches have entered the core processor registry. Mainframe stability is currently at <span className="text-red-500 animate-pulse font-bold">34%</span>. Play the core compiler diagnostic defense to restore system stability.
              </p>
              
              <div className="border border-matrix-green/20 p-4 bg-void-black/50 text-[10px] text-matrix-green/40 max-w-sm rounded">
                <span className="text-matrix-green font-bold">// HOW TO PLAY</span>
                <p className="mt-1">Move cursor to steer turret. Click or press SPACE to shoot down falling red bugs before they breach core memory at the bottom.</p>
              </div>

              <button
                onClick={startGame}
                className="flex items-center gap-3 px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold text-xs tracking-[0.3em] uppercase transition-all shadow-[0_0_20px_rgba(255,42,42,0.4)] cursor-pointer"
              >
                <Play className="w-4 h-4" /> START DIAGNOSTIC
              </button>
            </motion.div>
          )}

          {gameState === "playing" && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center gap-4"
            >
              {/* Telemetry info */}
              <div className="flex justify-between w-full text-xs text-matrix-green/70 border border-matrix-green/10 bg-void-black/40 px-4 py-2.5">
                <div>SYSTEM STABILITY: <span className="text-red-500 font-bold">CRITICAL</span></div>
                <div>SCORE: <span className="text-matrix-green font-bold">{score}/100</span></div>
                <div>CORE INTEGRITY: <span className="text-red-500 font-bold">{"■ ".repeat(health)}</span></div>
              </div>

              <div className="w-full h-[400px] border border-matrix-green/20 bg-void-black relative">
                <canvas ref={canvasRef} className="w-full h-full cursor-none block" />
              </div>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 flex flex-col items-center py-8"
            >
              <h2 className="text-red-500 text-2xl font-bold tracking-widest animate-pulse">
                UPLINK FAILURE // CORE MELTDOWN
              </h2>
              <p className="text-matrix-green/60 text-xs md:text-sm">
                The bugs successfully breached the processor register. Core diagnostics aborted. Score achieved: <span className="text-red-500 font-bold">{score}</span>
              </p>

              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" /> RETRY PROCESS
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 border border-red-500/35 hover:bg-red-500/10 text-red-500 font-bold text-xs tracking-[0.2em] uppercase transition-all cursor-pointer"
                >
                  ABORT REBOOT
                </button>
              </div>
            </motion.div>
          )}

          {gameState === "victory" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6 flex flex-col items-center py-8"
            >
              <h2 className="text-matrix-green text-2xl font-bold tracking-[0.25em] animate-bounce">
                SYSTEM RESTORED // ACCESS GRANTED
              </h2>
              <div className="border border-matrix-green text-matrix-green px-5 py-2 font-bold text-xs tracking-widest animate-pulse rounded bg-matrix-green/10">
                ★ DECRYPTED SENIOR DEVELOPER NODE ★
              </div>
              <p className="text-matrix-green/60 text-xs md:text-sm max-w-md leading-relaxed">
                Core compiled successfully. Core stability returned to 100%. Glitch anomalies completely purged from memory register.
              </p>

              <button
                onClick={() => { onClose(); sfx.playBeep(); }}
                className="px-8 py-4 bg-matrix-green text-void-darker font-bold text-xs tracking-[0.3em] uppercase hover:bg-matrix-green/80 transition-colors cursor-pointer"
              >
                RETURN TO MAIN SYSTEM →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
