"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { BinaryImage } from "@/components/BinaryImage";
import { SpaceBackground } from "@/components/SpaceBackground";
import { BlackHole } from "@/components/BlackHole";
import { BinaryTextCanvas } from "@/components/BinaryTextCanvas";
import { CyberPlanet } from "@/components/CyberPlanet";
import { Github, Linkedin, Mail, Twitter, ChevronDown, ExternalLink } from "lucide-react";
import defaultContent from "@/data/content.json";

/* ══════════════════════════════════════
   DESIGN TOKENS
   ══════════════════════════════════════ */
const G = "#00ff41";
const DIM = "rgba(0,255,65,0.04)";

/* ══════════════════════════════════════
   SIZE SCALE — clear hierarchy
   SECTION_TITLE  : pixelSize 10  ← biggest, only used for WHO AM I / SKILLS / PROJECTS / CONTACT
   SUB_HEADING    : pixelSize 6   ← card names, PAST/PRESENT, FRONTEND/BACKEND, SEND SIGNAL
   LABEL          : pixelSize 4   ← form labels, skill names, small tags
   body text      : font-mono text-sm (readable, plain)
   ══════════════════════════════════════ */

/* ══════════════════════════════════════
   BINARY TILE — deterministic bg noise
   ══════════════════════════════════════ */
const TILE = [
  "1 0 1 1 0 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 0 1 0 1 1 0",
  "0 1 0 0 1 1 0 1 0 0 1 0 1 1 0 0 1 0 1 0 0 1 1 0 1 0 0 1",
  "1 1 0 1 0 1 0 0 1 1 0 0 1 0 1 0 1 1 0 0 1 0 1 0 1 1 0 1",
  "0 0 1 0 1 0 1 1 0 0 1 1 0 1 0 1 0 0 1 1 0 1 0 1 0 0 1 0",
  "1 0 0 1 1 0 0 1 1 0 1 0 0 1 1 0 0 1 1 0 1 0 1 0 0 1 1 0",
];
function BinaryTile() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-[8px] leading-[14px] p-2 text-matrix-green/[0.05] whitespace-nowrap">
      {TILE.map((r, i) => <div key={i}>{r}</div>)}
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION HEADING
   ONLY main section titles use this —
   pixelSize=10 so they tower above everything
   ══════════════════════════════════════ */
function SectionHeading({ index, title, sub, className = "mb-40" }: { index: string; title: string; sub: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`text-center flex flex-col items-center ${className}`}
    >
      <motion.p
        initial={{ letterSpacing: "0.9em", opacity: 0 }}
        whileInView={{ letterSpacing: "0.4em", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-mono text-[11px] text-matrix-green/25 mb-6 uppercase tracking-widest"
      >
        ── {index} ──
      </motion.p>
      {/* BIG title — pixelSize 10 */}
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
      >
        <BinaryTextCanvas text={title} pixelSize={10} letterSpacing={2} color={G} dimColor={DIM} showZeros />
      </motion.div>
      {/* glowing underline */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "260px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="h-px mt-7"
        style={{ background: `linear-gradient(90deg, transparent, ${G}99, transparent)` }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="mt-5 font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase"
      >
        {sub}
      </motion.p>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   COSMIC DIVIDERS
   ══════════════════════════════════════ */
function DividerBlackHole({ label }: { label: string }) {
  return (
    <div className="h-[420px] w-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <BlackHole />
        </Canvas>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none flex-col gap-4">
        <BinaryTextCanvas text={label} pixelSize={4} letterSpacing={1} color="rgba(0,255,65,0.4)" dimColor="rgba(0,255,65,0.05)" showZeros />
        <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">// event horizon</p>
      </div>
    </div>
  );
}

function StarParticles() {
  const positions = React.useMemo(() => {
    const arr = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => { if (ref.current) { ref.current.rotation.x += dt * 0.04; ref.current.rotation.z += dt * 0.02; } });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={G} size={0.04} sizeAttenuation depthWrite={false} opacity={0.55} />
    </Points>
  );
}
function DividerStarCluster({ label }: { label: string }) {
  return (
    <div className="h-[360px] w-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void-darker to-transparent z-10 pointer-events-none" />
      <Canvas camera={{ position: [0, 0, 10] }} className="w-full h-full">
        <StarParticles />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none flex-col gap-4">
        <BinaryTextCanvas text={label} pixelSize={4} letterSpacing={1} color="rgba(0,255,65,0.4)" dimColor="rgba(0,255,65,0.05)" showZeros />
        <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">// navigation successful</p>
      </div>
    </div>
  );
}

function WhiteHoleParticles() {
  const positions = React.useMemo(() => {
    const arr = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = Math.random() * 4 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.3;
      arr[i * 3] = r * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi);
      arr[i * 3 + 2] = r * Math.sin(theta);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.18;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
    }
  });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={G} size={0.06} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}
function DividerWhiteHole({ label }: { label: string }) {
  return (
    <div className="h-[380px] w-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void-darker to-transparent z-10 pointer-events-none" />
      <Canvas camera={{ position: [0, 2, 8] }} className="w-full h-full">
        <WhiteHoleParticles />
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color={G} transparent opacity={0.9} />
        </mesh>
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none flex-col gap-4">
        <BinaryTextCanvas text={label} pixelSize={4} letterSpacing={1} color="rgba(0,255,65,0.4)" dimColor="rgba(0,255,65,0.05)" showZeros />
        <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">// white hole · data emission</p>
      </div>
    </div>
  );
}

function GalaxyParticles() {
  const positions = React.useMemo(() => {
    const arr = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      const arm = Math.floor(Math.random() * 2);
      const t = Math.random();
      const angle = t * Math.PI * 4 + arm * Math.PI;
      const radius = t * 5 + 0.2;
      const spread = (1 - t) * 0.6;
      arr[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      arr[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * 0.08; });
  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={G} size={0.035} sizeAttenuation depthWrite={false} opacity={0.6} />
    </Points>
  );
}
function DividerGalaxy({ label }: { label: string }) {
  return (
    <div className="h-[380px] w-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void-darker to-transparent z-10 pointer-events-none" />
      <Canvas camera={{ position: [0, 6, 0], fov: 60 }} className="w-full h-full">
        <GalaxyParticles />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none flex-col gap-4">
        <BinaryTextCanvas text={label} pixelSize={4} letterSpacing={1} color="rgba(0,255,65,0.4)" dimColor="rgba(0,255,65,0.05)" showZeros />
        <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">// milky way · sector 7G</p>
      </div>
    </div>
  );
}

function DividerCyberPlanet({ label }: { label: string }) {
  return (
    <div className="h-[400px] w-full relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-void-darker to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-void-darker to-transparent z-10 pointer-events-none" />
      <Canvas camera={{ position: [0, 1.5, 6] }} className="w-full h-full">
        <CyberPlanet />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none flex-col gap-4">
        <BinaryTextCanvas text={label} pixelSize={4} letterSpacing={1} color="rgba(0,255,65,0.4)" dimColor="rgba(0,255,65,0.05)" showZeros />
        <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.4em] uppercase">// orbital mainframe</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SKILL CARD
   Sub-heading (skill name): pixelSize 4
   ══════════════════════════════════════ */
function SkillCard({ name, level }: { name: string; level: number }) {
  const blocks = Array.from({ length: 14 }, (_, i) => i < Math.round((level / 100) * 14) ? "1" : "0").join(" ");
  return (
    <motion.div
      whileHover={{ y: -5, borderColor: G + "55" }}
      className="border border-matrix-green/10 bg-void-black/20 p-6 relative overflow-hidden text-center"
    >
      <BinaryTile />
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* skill name: pixelSize 4 (label size) */}
        <BinaryTextCanvas text={name} pixelSize={4} letterSpacing={1} color={G} dimColor={DIM} showZeros />
        <div className="font-mono text-[9px] text-matrix-green/20 leading-5 tracking-widest">{blocks}</div>
        <div className="w-full h-[3px] bg-matrix-green/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="h-full rounded-full bg-matrix-green"
          />
        </div>
        <span className="font-mono text-[10px] text-matrix-green/40">{level}%</span>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   PROJECT DATA TYPE
   ══════════════════════════════════════ */
type ProjectType = {
  id: string; tag: string; name: string; desc: string;
  techs: string[]; repoUrl?: string; liveUrl?: string;
};

/* Project card — project name: pixelSize 5 (sub-heading) */
function ProjectCard({ p }: { p: ProjectType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }} whileHover={{ y: -6 }}
      className="border border-matrix-green/10 p-10 relative overflow-hidden group bg-void-black/15"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top left, ${G}08 0%, transparent 70%)` }} />
      <BinaryTile />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* tag + id */}
        <div className="flex items-center justify-between w-full">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-matrix-green/35">{p.tag}</span>
          <span className="font-mono text-[9px] text-matrix-green/15 tracking-widest">MODULE {p.id}</span>
        </div>
        {/* project name: Multi-word wrap support */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 px-2">
          {p.name.split(" ").map((word, idx) => (
            <BinaryTextCanvas 
              key={idx} 
              text={word} 
              pixelSize={p.name.length > 20 ? 4 : 5} 
              letterSpacing={1} 
              color={G} 
              dimColor={DIM} 
              showZeros 
            />
          ))}
        </div>
        {/* separator */}
        <div className="w-24 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G}40, transparent)` }} />
        {/* description */}
        <p className="font-mono text-sm text-matrix-green/55 leading-loose max-w-sm">{p.desc}</p>
        {/* techs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {p.techs.map((t) => (
            <span key={t} className="font-mono text-[9px] px-3 py-1.5 border border-matrix-green/15 text-matrix-green/45 tracking-widest">{t}</span>
          ))}
        </div>
        {/* links */}
        <div className="flex gap-6 items-center pt-2">
          <a href={p.repoUrl || "#"} className="flex items-center gap-2 font-mono text-[10px] text-matrix-green/40 hover:text-matrix-green transition-colors tracking-widest">
            <Github size={13} /> REPO
          </a>
          <a href={p.liveUrl || "#"} className="flex items-center gap-2 font-mono text-[10px] text-matrix-green/55 hover:text-matrix-green transition-colors tracking-widest">
            <ExternalLink size={13} /> LIVE
          </a>
        </div>
      </div>
      <div className="absolute bottom-4 right-5 font-orbitron text-[5rem] font-black text-matrix-green/[0.04] select-none leading-none pointer-events-none">
        {p.id}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   FOOTER COLUMN
   ══════════════════════════════════════ */
function FooterColumn({
  title,
  align = "start",
  children,
}: {
  title: string;
  align?: "start" | "center" | "end";
  children: React.ReactNode;
}) {
  const alignCls =
    align === "end"
      ? "items-center md:items-end text-center md:text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-center md:items-start text-center md:text-left";

  const lineCls =
    align === "end"
      ? "mx-auto md:ml-auto md:mr-0"
      : align === "center"
        ? "mx-auto"
        : "mx-auto md:mx-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-10 ${alignCls}`}
    >
      <motion.div className={`flex flex-col gap-5 w-full ${alignCls}`}>
        <BinaryTextCanvas text={title} pixelSize={5} letterSpacing={1} color={G} dimColor={DIM} showZeros />
        <div
          className={`h-px w-full max-w-[140px] ${lineCls}`}
          style={{ background: `linear-gradient(90deg, transparent, ${G}55, transparent)` }}
        />
      </motion.div>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════
   CONTACT FIELD
   label: pixelSize 3
   ══════════════════════════════════════ */
function Field({ label, type = "text", ph, rows, value, onChange, name, required = true }: { 
  label: string; 
  type?: string; 
  ph: string; 
  rows?: number;
  value: string;
  onChange: (v: string) => void;
  name: string;
  required?: boolean;
}) {
  const cls = "w-full bg-void-black/40 border border-matrix-green/15 text-matrix-green font-mono text-sm px-4 py-3.5 outline-none focus:border-matrix-green/50 transition-colors placeholder-matrix-green/20 resize-none mt-3";
  return (
    <div className="flex flex-col items-center w-full group">
      <div className="mb-2 opacity-60 group-focus-within:opacity-100 transition-opacity">
        <BinaryTextCanvas text={label} pixelSize={2} letterSpacing={1} color={G} dimColor={DIM} showZeros />
      </div>
      {rows ? (
        <textarea name={name} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cls} placeholder={ph} rows={rows} />
      ) : (
        <input name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={cls} placeholder={ph} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   PAGE
   ══════════════════════════════════════ */
export default function Home() {
  const [content, setContent] = useState(defaultContent);
  const [formStatus, setFormStatus] = useState<"IDLE" | "SENDING" | "SUCCESS" | "ERROR">("IDLE");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  
  const handleFormChange = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("SENDING");

    try {
      // Using Web3Forms - Free and Zero-Config for portfolios
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "3b5d4d05-e4cc-47b0-9593-d567b4871b11", // Replace with your Web3Forms Access Key
          from_name: formData.name,
          email: formData.email,
          subject: `PORTFOLIO: ${formData.subject}`,
          message: formData.message,
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus("SUCCESS");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setFormStatus("IDLE"), 4000);
      } else {
        setFormStatus("ERROR");
        setTimeout(() => setFormStatus("IDLE"), 3000);
      }
    } catch (err) {
      setFormStatus("ERROR");
      setTimeout(() => setFormStatus("IDLE"), 3000);
    }
  };

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setContent(d); })
      .catch(() => { /* use default */ });
  }, []);

  const ICON_MAP: Record<string, React.ReactNode> = {
    email: <Mail size={14} />,
    github: <Github size={14} />,
    linkedin: <Linkedin size={14} />,
    twitter: <Twitter size={14} />,
  };

  return (
    <main className="relative min-h-screen bg-void-darker overflow-x-hidden">
      <SpaceBackground />
      <Navbar />

      {/* ═════════════════════════════
          HERO
          ═════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-[30rem] pb-28 px-6 text-center">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="flex justify-center drop-shadow-[0_0_15px_rgba(0,255,65,0.3)] mt-16">
          <BinaryTextCanvas text={content.hero.firstName} pixelSize={16} letterSpacing={3} color={G} dimColor={DIM} showZeros />
        </motion.div>

        {/* spacer between ARYAMAN and NIBORIYA */}
        <div style={{ height: "60px" }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex justify-center drop-shadow-[0_0_10px_rgba(0,255,65,0.2)]">
          <BinaryTextCanvas text={content.hero.lastName} pixelSize={9} letterSpacing={2} color={G} dimColor={DIM} showZeros />
        </motion.div>

        {/* thin green line separator between name and role */}
        <motion.div initial={{ width: 0 }} animate={{ width: "240px" }} transition={{ delay: 0.5, duration: 0.6 }}
          className="h-px mx-auto"
          style={{ background: `linear-gradient(90deg, transparent, ${G}55, transparent)` }}
        />

        <div style={{ height: "120px" }} />

        {/* ROLE */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="flex justify-center mb-16">
          <BinaryTextCanvas text={content.hero.role} pixelSize={6} letterSpacing={1} color={G} dimColor={DIM} showZeros />
        </motion.div>

        {/* TAGLINE */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="font-mono text-sm text-matrix-green/50 max-w-lg leading-loose mt-12 mb-0"
        >
          {content.hero.tagline}
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
          className="flex flex-wrap justify-center gap-5 mt-10 mb-16"
        >
          <a href="#projects" className="px-10 py-4 bg-matrix-green text-void-darker font-mono text-xs font-bold tracking-[0.25em] uppercase hover:bg-matrix-green/80 transition-colors">
            VIEW WORK
          </a>
          <a href="#contact" className="px-10 py-4 border border-matrix-green/35 text-matrix-green font-mono text-xs tracking-[0.25em] uppercase hover:bg-matrix-green/8 transition-colors">
            CONTACT
          </a>
        </motion.div>

        {/* PORTRAIT + STATS */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-24 w-full max-w-5xl items-center mt-20"
        >
          <div className="flex justify-center">
            <div className="relative">
              <img src="/portrait.jpg" alt="Portrait" className="w-full max-w-[240px] rounded-lg shadow-[0_0_60px_rgba(0,255,65,0.15)] object-cover brightness-90 contrast-150 hue-rotate-[5deg] [clip-path:inset(5%_0_0_0)] -mt-2 mix-blend-lighten" />
              <div className="absolute -top-3 -right-3 font-mono text-[9px] text-matrix-green/20 text-right leading-6 animate-pulse">
                CORE_TEMP: 36.6°<br />SIGNAL: LOCKED<br />ENCRYPTION: ON
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="grid grid-cols-3 gap-3 w-full">
              {content.hero.stats.map((s) => (
                <div key={s.label} className="border border-matrix-green/10 p-5 text-center relative overflow-hidden group">
                  <BinaryTile />
                  <div className="font-orbitron text-2xl font-black text-matrix-green relative z-10 group-hover:text-matrix-green/70 transition-colors">{s.value}</div>
                  <div className="font-mono text-[9px] text-matrix-green/35 tracking-widest relative z-10 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="border border-matrix-green/10 p-5 relative overflow-hidden w-full">
              <BinaryTile />
              <div className="relative z-10 font-mono text-[10px] text-matrix-green/40 leading-8 text-center">
                <div className="text-matrix-green/20 mb-1">// CORE STATUS</div>
                <div>■ AVAILABLE FOR FREELANCE &nbsp;<span className="text-matrix-green">YES</span></div>
                <div>■ OPEN TO OPPORTUNITIES &nbsp;&nbsp;<span className="text-matrix-green">YES</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-matrix-green/25"
        >
          <ChevronDown size={26} />
        </motion.div>
      </section>

      {/* DIVIDER 1 */}
      <DividerBlackHole label="APPROACHING SINGULARITY" />

      {/* ═════════════════════════════
          ABOUT
          ═════════════════════════════ */}
      <section id="about" className="relative py-36 px-6 md:px-20 flex flex-col items-center">
        <SectionHeading index="SECTION 01" title="WHO AM I" sub="// initializing entity data..." />

        <div className="max-w-4xl w-full mx-auto flex flex-col items-center gap-40">

          {/* BIO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            {content.about.bio.map((p, i) => (
              <p key={i} className="font-mono text-sm text-matrix-green/60 leading-[2.2]" dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </motion.div>

          {/* TIMELINE — PAST / PRESENT / FUTURE */}
          {/* Sub-heading: pixelSize 6 */}
          <div className="flex flex-col items-center gap-6 w-full">
            {content.about.timeline.map(({ era, tag, desc }, i) => (
              <motion.div
                key={era}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center flex flex-col items-center gap-4 border border-matrix-green/10 px-10 py-8 w-full relative overflow-hidden"
              >
                <BinaryTile />
                <span className="font-mono text-[9px] text-matrix-green/20 z-10 tracking-widest">{tag}</span>
                <div className="z-10">
                  <BinaryTextCanvas text={era} pixelSize={6} letterSpacing={1} color={G} dimColor={DIM} showZeros />
                </div>
                <div className="w-16 h-px z-10" style={{ background: `linear-gradient(90deg, transparent, ${G}40, transparent)` }} />
                <p className="font-mono text-sm text-matrix-green/50 leading-loose max-w-sm z-10">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full">
            {content.about.statsGrid.map(({ label, val, bin }) => (
              <motion.div key={label} whileHover={{ scale: 1.05 }}
                className="border border-matrix-green/10 p-5 text-center relative overflow-hidden"
              >
                <BinaryTile />
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="font-mono text-[8px] text-matrix-green/15">{bin}</div>
                  <div className="font-orbitron font-black text-xl text-matrix-green">{val}</div>
                  <div className="font-mono text-[9px] text-matrix-green/35 tracking-widest">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER 2 */}
      <DividerStarCluster label="NAVIGATING STAR CLUSTER" />

      {/* ═════════════════════════════
          SKILLS
          ═════════════════════════════ */}
      <section id="skills" className="relative py-36 px-6 md:px-20 flex flex-col items-center gap-24">
        <SectionHeading index="SECTION 02" title="SKILLS" sub="// scanning capability matrix..." className="mb-0" />

        <div className="max-w-6xl w-full mx-auto flex flex-col items-center gap-40 w-full">

          {/* SKILL CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {content.skills.cards.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              >
                <SkillCard {...s} />
              </motion.div>
            ))}
          </div>

          {/* STACK CATEGORIES */}
          {/* Category titles: pixelSize 6 = sub-heading */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {content.skills.categories.map(({ cat, items }) => (
              <div key={cat} className="border border-matrix-green/10 px-8 py-10 relative overflow-hidden flex flex-col items-center gap-6">
                <BinaryTile />
                {/* sub-heading: pixelSize 6 */}
                <div className="z-10">
                  <BinaryTextCanvas text={cat} pixelSize={6} letterSpacing={1} color={G} dimColor={DIM} showZeros />
                </div>
                <div className="w-12 h-px z-10" style={{ background: `linear-gradient(90deg, transparent, ${G}40, transparent)` }} />
                <div className="flex flex-wrap gap-2 justify-center z-10">
                  {items.map((item) => (
                    <span key={item} className="font-mono text-[9px] border border-matrix-green/15 px-2.5 py-1.5 text-matrix-green/45 hover:text-matrix-green hover:border-matrix-green/35 transition-colors tracking-widest">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIVIDER 3 */}
      <DividerGalaxy label="GALAXY SECTOR 7G" />

      {/* ═════════════════════════════
          PROJECTS
          ═════════════════════════════ */}
      <section id="projects" className="relative py-36 px-6 md:px-20 flex flex-col items-center gap-24">
        <SectionHeading index="SECTION 03" title="PROJECTS" sub="// loading repository data..." className="mb-0" />
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 w-full">
          {content.projects.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* DIVIDER 4 */}
      <DividerWhiteHole label="WHITE HOLE DATA STREAM" />

      {/* ═════════════════════════════
          CONTACT
          ═════════════════════════════ */}
      <section id="contact" className="relative pt-36 pb-8 px-6 md:px-20 flex flex-col items-center gap-24">
        <SectionHeading index="SECTION 04" title="CONTACT" sub="// establishing uplink..." className="mb-0" />

        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 w-full items-start">

          {/* LEFT — info */}
          <div className="flex flex-col items-center md:items-start gap-10 w-full">
            {/* sub-heading: pixelSize 6 */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-6 w-full">
              <BinaryTextCanvas text={content.contact.heading} pixelSize={6} letterSpacing={1} color={G} dimColor={DIM} showZeros />
              <div className="w-16 h-px" style={{ background: `linear-gradient(90deg, transparent, ${G}40, transparent)` }} />
              <p className="font-mono text-sm text-matrix-green/50 leading-loose max-w-sm text-center md:text-left">
                {content.contact.description}
              </p>
            </div>

            <div className="w-full space-y-1">
              {content.contact.links.map(({ type, txt, bin }) => {
                const getLink = (t: string, x: string) => {
                  const target = (t.includes("@") || t.includes(".com") || t.includes(".in")) ? t : x;
                  if (target.includes("@") && !target.startsWith("http")) return `mailto:${target}`;
                  if (target.startsWith("http")) return target;
                  if (target.includes(".com") || target.includes(".in")) return `https://${target}`;
                  return "#";
                };

                const getIcon = (t: string, x: string) => {
                  const combined = (t + x).toLowerCase();
                  if (combined.includes("github")) return "github";
                  if (combined.includes("linkedin")) return "linkedin";
                  if (combined.includes("twitter") || combined.includes("x.com")) return "twitter";
                  if (combined.includes("@") || combined.includes("email") || combined.includes("mail")) return "email";
                  return t.toLowerCase();
                };

                const href = getLink(type, txt);
                const iconKey = getIcon(type, txt);

                return (
                  <motion.a 
                    key={txt} 
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-4 py-4 border-b border-matrix-green/8 group"
                  >
                    <span className="text-matrix-green/30 group-hover:text-matrix-green transition-colors flex-shrink-0">
                      {ICON_MAP[iconKey] || <Mail size={14} />}
                    </span>
                    <span className="font-mono text-xs text-matrix-green/45 group-hover:text-matrix-green/75 transition-colors flex-1 truncate">{txt}</span>
                    <span className="font-mono text-[8px] text-matrix-green/15 flex-shrink-0">{bin}</span>
                  </motion.a>
                );
              })}
            </div>

            {/* STATUS */}
            <div className="border border-matrix-green/10 p-6 font-mono text-[10px] leading-8 text-matrix-green/30 relative overflow-hidden w-full text-center">
              <BinaryTile />
              <div className="relative z-10 flex flex-col gap-1">
                <div>■ AVAILABLE FOR FREELANCE &nbsp;<span className="text-matrix-green">{content.contact.availability.freelance ? "YES" : "NO"}</span></div>
                <div>■ OPEN TO OPPORTUNITIES &nbsp;&nbsp;<span className="text-matrix-green">{content.contact.availability.opportunities ? "YES" : "NO"}</span></div>
                <div>■ RESPONSE TIME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-matrix-green">{content.contact.availability.responseTime}</span></div>
                <div>■ TIMEZONE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-matrix-green">{content.contact.availability.timezone}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8 w-full md:pt-2">
            <Field 
              name="name" label="NAME" ph="01000001..." 
              value={formData.name} onChange={(v) => handleFormChange("name", v)} 
            />
            <Field 
              name="email" label="EMAIL" type="email" ph="signal@source.binary" 
              value={formData.email} onChange={(v) => handleFormChange("email", v)} 
            />
            <Field 
              name="subject" label="SUBJECT" ph="01010011..." 
              value={formData.subject} onChange={(v) => handleFormChange("subject", v)} 
            />
            <Field 
              name="message" label="MESSAGE" ph="Transmit your signal here..." rows={5} 
              value={formData.message} onChange={(v) => handleFormChange("message", v)} 
            />
            
            <div className="w-full relative">
              <motion.button
                type="submit"
                disabled={formStatus === "SENDING"}
                whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.97 }}
                className={`w-full font-mono font-bold text-xs tracking-[0.3em] py-5 uppercase transition-all duration-300 ${
                  formStatus === "SUCCESS" ? "bg-green-500 text-white" : 
                  formStatus === "ERROR" ? "bg-red-500 text-white" : 
                  "bg-matrix-green text-void-darker hover:bg-matrix-green/80"
                }`}
              >
                {formStatus === "IDLE" && "TRANSMIT SIGNAL →"}
                {formStatus === "SENDING" && "TRANSMITTING..."}
                {formStatus === "SUCCESS" && "SIGNAL RECEIVED"}
                {formStatus === "ERROR" && "UPLINK FAILED"}
              </motion.button>
              
              {formStatus === "SUCCESS" && (
                <p className="font-mono text-[10px] text-matrix-green/60 text-center mt-3 animate-pulse">
                  // message successfully encrypted and transmitted
                </p>
              )}
              {formStatus === "ERROR" && (
                <p className="font-mono text-[10px] text-red-500/60 text-center mt-3 animate-pulse">
                  // transmission error. check uplink or access key.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* DIVIDER 5 */}
      <DividerCyberPlanet label="UPLINK ESTABLISHED" />

      {/* ═════════════════════════════
          FOOTER
          ═════════════════════════════ */}
      <footer className="relative pt-28 pb-16 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-matrix-green/15">
        <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-25">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <BlackHole />
          </Canvas>
        </motion.div>

        <motion.div className="w-full relative z-10 flex flex-col">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-[10px] text-matrix-green/20 tracking-[0.55em] uppercase text-center mb-20 w-full"
          >
            ── FOOTER NODE // END TRANSMISSION ──
          </motion.p>

          <motion.div className="flex flex-col md:flex-row justify-between items-start gap-16 lg:gap-8 mb-20 w-full">
            {/* LEFT COLUMN */}
            <div className="flex-1 flex justify-start">
              <FooterColumn title="ARYAMAN" align="start">
                <p className="font-mono text-xs text-matrix-green/45 leading-[1.9] max-w-[280px]">
                  {content.footer.description}
                </p>
                <motion.div className="flex gap-3">
                  {[
                    { icon: <Twitter size={16} />, label: "Twitter", type: "twitter" },
                    { icon: <Linkedin size={16} />, label: "LinkedIn", type: "linkedin" },
                    { icon: <Github size={16} />, label: "GitHub", type: "github" },
                    { icon: <Mail size={16} />, label: "Email", type: "email" },
                  ].map(({ icon, label, type }) => {
                    const contactLink = content.contact.links.find(l => {
                      const combined = (l.type + l.txt).toLowerCase();
                      if (type === "twitter") return combined.includes("twitter") || combined.includes("x.com");
                      if (type === "email") return combined.includes("@") || combined.includes("mail");
                      return combined.includes(type);
                    });
                    
                    let href = "#";
                    if (contactLink) {
                      const val = (contactLink.type.includes("@") || contactLink.type.includes(".com") || contactLink.type.includes(".in")) ? contactLink.type : contactLink.txt;
                      href = (val.includes("@") && !val.startsWith("http")) ? `mailto:${val}` : (val.startsWith("http") ? val : `https://${val}`);
                    }
                    
                    return (
                      <motion.a
                        key={label}
                        href={href}
                        target={href.startsWith("mailto") ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={label}
                        whileHover={{ y: -3 }}
                        className="p-2.5 border border-matrix-green/15 text-matrix-green/35 hover:text-matrix-green hover:border-matrix-green/40 transition-colors"
                      >
                        {icon}
                      </motion.a>
                    );
                  })}
                </motion.div>
              </FooterColumn>
            </div>

            {/* CENTER COLUMN */}
            <div className="flex-1 flex justify-center">
              <FooterColumn title="NAVIGATION" align="center">
                <ul className="flex flex-col gap-5 font-mono text-xs text-matrix-green/40 tracking-[0.28em] items-center">
                  {["ABOUT", "SKILLS", "PROJECTS", "CONTACT"].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item === "ABOUT" ? "about" : item.toLowerCase()}`}
                        className="hover:text-matrix-green transition-colors inline-flex items-center gap-3 group"
                      >
                        <span className="text-matrix-green/20 group-hover:text-matrix-green/60 transition-colors">›</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 flex justify-end">
              <FooterColumn title="SYSTEMS" align="end">
                <motion.div className="border border-matrix-green/12 px-6 py-5 font-mono text-[11px] text-matrix-green/35 w-full max-w-[240px] relative overflow-hidden">
                  <BinaryTile />
                  <motion.div className="relative z-10 flex flex-col gap-3">
                    {[
                      ["VER", "5.0.0-STABLE"],
                      ["SIGNAL", "ENCRYPTED"],
                      ["CORE_TEMP", "OPTIMAL"],
                      ["LOC", "MILKY_WAY_7G"],
                    ].map(([k, v]) => (
                      <motion.div key={k} className="flex justify-between gap-6 text-left">
                        <span className="text-matrix-green/25">{k}</span>
                        <span className="text-matrix-green/70 text-right">{v}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </FooterColumn>
            </div>
          </motion.div>

          <motion.div className="pt-10 border-t border-matrix-green/8 flex flex-col md:flex-row items-center justify-between gap-8 w-full">
            <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.35em] order-2 md:order-1">
              {content.footer.copyright}
            </p>
            <motion.div className="h-px flex-1 mx-16 bg-gradient-to-r from-transparent via-matrix-green/40 to-transparent order-1 md:order-2 hidden md:block" />
            <p className="font-mono text-[10px] text-matrix-green/25 tracking-[0.35em] order-3">
              STAY_ENCODED
            </p>
          </motion.div>
        </motion.div>
      </footer>
    </main>
  );
}
