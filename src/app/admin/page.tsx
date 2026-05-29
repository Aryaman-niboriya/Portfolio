"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface HeroData {
  firstName: string;
  lastName: string;
  role: string;
  tagline: string;
  stats: { value: string; label: string }[];
}
interface TimelineItem { era: string; tag: string; desc: string; }
interface StatItem { label: string; val: string; bin: string; }
interface AboutData {
  bio: string[];
  timeline: TimelineItem[];
  statsGrid: StatItem[];
}
interface SkillCard { name: string; level: number; }
interface SkillCategory { cat: string; items: string[]; }
interface SkillsData { cards: SkillCard[]; categories: SkillCategory[]; }
interface Project {
  id: string; tag: string; name: string; desc: string;
  techs: string[]; repoUrl: string; liveUrl: string;
}
interface ContactLink { type: string; txt: string; bin: string; }
interface ContactData {
  heading: string; description: string; links: ContactLink[];
  availability: { freelance: boolean; opportunities: boolean; responseTime: string; timezone: string; };
}
interface FooterData { description: string; copyright: string; }
interface ContentData {
  hero: HeroData; about: AboutData; skills: SkillsData;
  projects: Project[]; contact: ContactData; footer: FooterData;
}

/* ═══════════════════════════════════════════
   REUSABLE UI COMPONENTS
   ═══════════════════════════════════════════ */
const G = "#00ff41";

function Panel({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#00ff41]/20 bg-[#020a02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#00ff41]/5 transition-colors"
      >
        <span className="font-mono text-sm tracking-[0.3em] text-[#00ff41]/80 uppercase">{title}</span>
        <span className="font-mono text-[#00ff41]/40 text-lg">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t border-[#00ff41]/10 space-y-5">{children}</div>}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-mono text-[10px] text-[#00ff41]/40 tracking-[0.3em] uppercase mb-1.5">{children}</label>;
}

function Input({ value, onChange, placeholder = "" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-black/60 border border-[#00ff41]/15 text-[#00ff41] font-mono text-sm px-4 py-2.5 outline-none focus:border-[#00ff41]/50 transition-colors placeholder-[#00ff41]/15"
    />
  );
}

function TextArea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-black/60 border border-[#00ff41]/15 text-[#00ff41] font-mono text-sm px-4 py-2.5 outline-none focus:border-[#00ff41]/50 transition-colors resize-none placeholder-[#00ff41]/15"
    />
  );
}

function NumberInput({ value, onChange, min = 0, max = 100 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
      min={min}
      max={max}
      className="w-24 bg-black/60 border border-[#00ff41]/15 text-[#00ff41] font-mono text-sm px-3 py-2.5 outline-none focus:border-[#00ff41]/50 transition-colors"
    />
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-red-500/60 hover:text-red-400 font-mono text-xs tracking-wider transition-colors">
      ✕ REMOVE
    </button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full border border-dashed border-[#00ff41]/20 text-[#00ff41]/40 font-mono text-xs tracking-[0.2em] py-3 hover:border-[#00ff41]/40 hover:text-[#00ff41]/60 transition-colors"
    >
      + {label}
    </button>
  );
}

/* ═══════════════════════════════════════════
   ADMIN PAGE
   ═══════════════════════════════════════════ */
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [data, setData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load content
  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load content"); setLoading(false); });
  }, []);

  // Save content
  const save = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  }, [data]);

  // Helpers to update nested state
  const u = useCallback((fn: (d: ContentData) => void) => {
    setData((prev) => {
      if (!prev) return prev;
      const copy = JSON.parse(JSON.stringify(prev)) as ContentData;
      fn(copy);
      return copy;
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#010401] flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00ff41]/5 via-[#010401] to-[#010401]">
        <div className="max-w-md w-full border border-[#00ff41]/20 bg-[#020a02]/80 backdrop-blur p-10 shadow-[0_0_30px_rgba(0,255,65,0.1)]">
          <h2 className="font-mono text-[#00ff41] tracking-[0.4em] mb-8 text-center text-lg shadow-[#00ff41]">SYSTEM LOGIN</h2>
          <div className="flex flex-col gap-6">
            <input 
              type="text"
              name="mainframe_user_id"
              autoComplete="off"
              spellCheck={false}
              value={username}
              onChange={(e) => { setUsername(e.target.value); setAuthError(""); }}
              className="w-full bg-black/60 border border-[#00ff41]/30 text-[#00ff41] font-mono text-center text-xl px-6 py-4 outline-none focus:border-[#00ff41] transition-colors tracking-[0.3em] placeholder-[#00ff41]/20"
              placeholder="USERNAME"
              autoFocus
            />
            <input 
              type="password"
              name="mainframe_access_code"
              autoComplete="new-password"
              spellCheck={false}
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setAuthError(""); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (username.toLowerCase() === 'admin' && passcode === 'admin123') setIsAuthenticated(true);
                  else setAuthError('ERROR: INVALID CREDENTIALS');
                }
              }}
              className="w-full bg-black/60 border border-[#00ff41]/30 text-[#00ff41] font-mono text-center text-xl px-6 py-4 outline-none focus:border-[#00ff41] transition-colors tracking-[0.3em] placeholder-[#00ff41]/20"
              placeholder="PASSCODE"
            />
            {authError && <span className="font-mono text-red-500/90 text-sm tracking-widest text-center animate-pulse">{authError}</span>}
            <button 
              onClick={() => {
                if (username.toLowerCase() === 'admin' && passcode === 'admin123') setIsAuthenticated(true);
                else setAuthError('ERROR: INVALID CREDENTIALS');
              }}
              className="w-full py-4 bg-[#00ff41]/10 border border-[#00ff41]/40 text-[#00ff41] font-mono hover:bg-[#00ff41]/20 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] transition-all tracking-[0.3em] uppercase"
            >
              INITIALIZE CONNECTION
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#010401] flex items-center justify-center">
        <p className="font-mono text-[#00ff41]/40 tracking-[0.4em] animate-pulse">LOADING MAINFRAME...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#010401] flex items-center justify-center">
        <p className="font-mono text-red-500/60 tracking-[0.3em]">{error || "NO DATA"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010401] text-[#00ff41]">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-[#010401]/95 backdrop-blur border-b border-[#00ff41]/15 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="font-mono text-[10px] text-[#00ff41]/30 tracking-[0.3em] hover:text-[#00ff41]/60 transition-colors">
            ← PORTFOLIO
          </a>
          <div className="h-4 w-px bg-[#00ff41]/15" />
          <h1 className="font-mono text-sm tracking-[0.4em] text-[#00ff41]/70 uppercase">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-4">
          {error && <span className="font-mono text-[10px] text-red-500/70 tracking-wider">{error}</span>}
          {saved && <span className="font-mono text-[10px] text-[#00ff41] tracking-wider animate-pulse">✓ SAVED</span>}
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-[#00ff41] text-[#010401] font-mono text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#00ff41]/80 transition-colors disabled:opacity-40"
          >
            {saving ? "SAVING..." : "SAVE ALL"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-4">

        {/* ─── HERO SECTION ─── */}
        <Panel title="// HERO SECTION" defaultOpen>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={data.hero.firstName} onChange={(v) => u((d) => { d.hero.firstName = v; })} />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={data.hero.lastName} onChange={(v) => u((d) => { d.hero.lastName = v; })} />
            </div>
          </div>
          <div>
            <Label>Role / Title</Label>
            <Input value={data.hero.role} onChange={(v) => u((d) => { d.hero.role = v; })} />
          </div>
          <div>
            <Label>Tagline</Label>
            <TextArea value={data.hero.tagline} onChange={(v) => u((d) => { d.hero.tagline = v; })} rows={2} />
          </div>
          <Label>Quick Stats</Label>
          <div className="space-y-2">
            {data.hero.stats.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input value={s.value} onChange={(v) => u((d) => { d.hero.stats[i].value = v; })} placeholder="Value" />
                <Input value={s.label} onChange={(v) => u((d) => { d.hero.stats[i].label = v; })} placeholder="Label" />
                <RemoveBtn onClick={() => u((d) => { d.hero.stats.splice(i, 1); })} />
              </div>
            ))}
            <AddBtn onClick={() => u((d) => { d.hero.stats.push({ value: "", label: "" }); })} label="ADD STAT" />
          </div>
        </Panel>

        {/* ─── ABOUT SECTION ─── */}
        <Panel title="// ABOUT SECTION">
          <Label>Bio Paragraphs (HTML allowed)</Label>
          {data.about.bio.map((p, i) => (
            <TextArea key={i} value={p} onChange={(v) => u((d) => { d.about.bio[i] = v; })} rows={3} />
          ))}
          <AddBtn onClick={() => u((d) => { d.about.bio.push(""); })} label="ADD PARAGRAPH" />

          <Label>Timeline</Label>
          {data.about.timeline.map((t, i) => (
            <div key={i} className="border border-[#00ff41]/10 p-4 space-y-3">
              <div className="flex gap-3 items-center">
                <div className="flex-1">
                  <Label>Era</Label>
                  <Input value={t.era} onChange={(v) => u((d) => { d.about.timeline[i].era = v; })} />
                </div>
                <div className="w-20">
                  <Label>Tag</Label>
                  <Input value={t.tag} onChange={(v) => u((d) => { d.about.timeline[i].tag = v; })} />
                </div>
                <div className="pt-4"><RemoveBtn onClick={() => u((d) => { d.about.timeline.splice(i, 1); })} /></div>
              </div>
              <div>
                <Label>Description</Label>
                <TextArea value={t.desc} onChange={(v) => u((d) => { d.about.timeline[i].desc = v; })} rows={2} />
              </div>
            </div>
          ))}
          <AddBtn onClick={() => u((d) => { d.about.timeline.push({ era: "", tag: "", desc: "" }); })} label="ADD TIMELINE ITEM" />

          <Label>Stats Grid</Label>
          <div className="space-y-2">
            {data.about.statsGrid.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Input value={s.label} onChange={(v) => u((d) => { d.about.statsGrid[i].label = v; })} placeholder="Label" />
                <Input value={s.val} onChange={(v) => u((d) => { d.about.statsGrid[i].val = v; })} placeholder="Value" />
                <Input value={s.bin} onChange={(v) => u((d) => { d.about.statsGrid[i].bin = v; })} placeholder="Binary" />
                <RemoveBtn onClick={() => u((d) => { d.about.statsGrid.splice(i, 1); })} />
              </div>
            ))}
            <AddBtn onClick={() => u((d) => { d.about.statsGrid.push({ label: "", val: "", bin: "01010101" }); })} label="ADD STAT" />
          </div>
        </Panel>

        {/* ─── SKILLS SECTION ─── */}
        <Panel title="// SKILLS SECTION">
          <Label>Skill Cards (name + level %)</Label>
          <div className="space-y-2">
            {data.skills.cards.map((s, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="flex-1">
                  <Input value={s.name} onChange={(v) => u((d) => { d.skills.cards[i].name = v; })} placeholder="Skill name" />
                </div>
                <NumberInput value={s.level} onChange={(v) => u((d) => { d.skills.cards[i].level = v; })} />
                <div className="w-24 h-1.5 bg-[#00ff41]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00ff41]/60 rounded-full" style={{ width: `${s.level}%` }} />
                </div>
                <RemoveBtn onClick={() => u((d) => { d.skills.cards.splice(i, 1); })} />
              </div>
            ))}
            <AddBtn onClick={() => u((d) => { d.skills.cards.push({ name: "", level: 50 }); })} label="ADD SKILL" />
          </div>

          <Label>Stack Categories</Label>
          {data.skills.categories.map((c, ci) => (
            <div key={ci} className="border border-[#00ff41]/10 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Label>Category Name</Label>
                  <Input value={c.cat} onChange={(v) => u((d) => { d.skills.categories[ci].cat = v; })} />
                </div>
                <div className="pt-4"><RemoveBtn onClick={() => u((d) => { d.skills.categories.splice(ci, 1); })} /></div>
              </div>
              <Label>Items (comma separated)</Label>
              <Input
                value={c.items.join(", ")}
                onChange={(v) => u((d) => { d.skills.categories[ci].items = v.split(",").map((s) => s.trim()).filter(Boolean); })}
                placeholder="REACT, NEXT JS, ..."
              />
            </div>
          ))}
          <AddBtn onClick={() => u((d) => { d.skills.categories.push({ cat: "", items: [] }); })} label="ADD CATEGORY" />
        </Panel>

        {/* ─── PROJECTS SECTION ─── */}
        <Panel title="// PROJECTS SECTION">
          {data.projects.map((p, i) => (
            <div key={i} className="border border-[#00ff41]/10 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#00ff41]/25 tracking-wider">MODULE {p.id}</span>
                <RemoveBtn onClick={() => u((d) => { d.projects.splice(i, 1); })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>ID</Label>
                  <Input value={p.id} onChange={(v) => u((d) => { d.projects[i].id = v; })} />
                </div>
                <div>
                  <Label>Tag</Label>
                  <Input value={p.tag} onChange={(v) => u((d) => { d.projects[i].tag = v; })} />
                </div>
                <div>
                  <Label>Name</Label>
                  <Input value={p.name} onChange={(v) => u((d) => { d.projects[i].name = v; })} />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <TextArea value={p.desc} onChange={(v) => u((d) => { d.projects[i].desc = v; })} rows={3} />
              </div>
              <div>
                <Label>Technologies (comma separated)</Label>
                <Input
                  value={p.techs.join(", ")}
                  onChange={(v) => u((d) => { d.projects[i].techs = v.split(",").map((s) => s.trim()).filter(Boolean); })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Repo URL</Label>
                  <Input value={p.repoUrl} onChange={(v) => u((d) => { d.projects[i].repoUrl = v; })} />
                </div>
                <div>
                  <Label>Live URL</Label>
                  <Input value={p.liveUrl} onChange={(v) => u((d) => { d.projects[i].liveUrl = v; })} />
                </div>
              </div>
            </div>
          ))}
          <AddBtn
            onClick={() => u((d) => {
              const nextId = String(d.projects.length + 1).padStart(2, "0");
              d.projects.push({ id: nextId, tag: "", name: "", desc: "", techs: [], repoUrl: "#", liveUrl: "#" });
            })}
            label="ADD PROJECT"
          />
        </Panel>

        {/* ─── CONTACT SECTION ─── */}
        <Panel title="// CONTACT SECTION">
          <div>
            <Label>Heading</Label>
            <Input value={data.contact.heading} onChange={(v) => u((d) => { d.contact.heading = v; })} />
          </div>
          <div>
            <Label>Description</Label>
            <TextArea value={data.contact.description} onChange={(v) => u((d) => { d.contact.description = v; })} rows={3} />
          </div>
          <Label>Contact Links</Label>
          {data.contact.links.map((l, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-40">
                <Input value={l.type} onChange={(v) => u((d) => { d.contact.links[i].type = v; })} placeholder="github/email/etc" />
              </div>
              <div className="flex-1">
                <Input value={l.txt} onChange={(v) => u((d) => { d.contact.links[i].txt = v; })} placeholder="LINK URL / EMAIL" />
              </div>
              <RemoveBtn onClick={() => u((d) => { d.contact.links.splice(i, 1); })} />
            </div>
          ))}
          <AddBtn onClick={() => u((d) => { d.contact.links.push({ type: "", txt: "", bin: "01010101" }); })} label="ADD LINK" />

          <Label>Availability</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.contact.availability.freelance}
                onChange={(e) => u((d) => { d.contact.availability.freelance = e.target.checked; })}
                className="accent-[#00ff41]"
              />
              <span className="font-mono text-xs text-[#00ff41]/50">Freelance</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.contact.availability.opportunities}
                onChange={(e) => u((d) => { d.contact.availability.opportunities = e.target.checked; })}
                className="accent-[#00ff41]"
              />
              <span className="font-mono text-xs text-[#00ff41]/50">Opportunities</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Response Time</Label>
              <Input value={data.contact.availability.responseTime} onChange={(v) => u((d) => { d.contact.availability.responseTime = v; })} />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input value={data.contact.availability.timezone} onChange={(v) => u((d) => { d.contact.availability.timezone = v; })} />
            </div>
          </div>
        </Panel>

        {/* ─── FOOTER SECTION ─── */}
        <Panel title="// FOOTER">
          <div>
            <Label>Description</Label>
            <TextArea value={data.footer.description} onChange={(v) => u((d) => { d.footer.description = v; })} rows={2} />
          </div>
          <div>
            <Label>Copyright</Label>
            <Input value={data.footer.copyright} onChange={(v) => u((d) => { d.footer.copyright = v; })} />
          </div>
        </Panel>

        {/* BOTTOM SAVE */}
        <div className="pt-6 pb-20 flex justify-center">
          <button
            onClick={save}
            disabled={saving}
            className="px-12 py-4 bg-[#00ff41] text-[#010401] font-mono text-sm font-bold tracking-[0.3em] uppercase hover:bg-[#00ff41]/80 transition-colors disabled:opacity-40"
          >
            {saving ? "TRANSMITTING..." : "SAVE ALL CHANGES →"}
          </button>
        </div>
      </div>
    </div>
  );
}
