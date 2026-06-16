<div align="center">
  <img src="https://raw.githubusercontent.com/Aryaman-niboriya/Portfolio/main/public/favicon.svg" alt="AryamanOS Logo" width="80" height="80">
  <h1 align="center">🌌 AryamanOS - 3D Cyberpunk Portfolio</h1>

  <p align="center">
    A highly interactive, WebGL-accelerated, sci-fi themed developer portfolio engineered for the Next.js App Router edge.
    <br />
    <a href="https://aryaman-niboriya-portfolio.vercel.app/"><strong>Explore the Live Matrix »</strong></a>
    <br />
    <br />
  </p>
</div>

<div align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15+-black?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://docs.pmnd.rs/react-three-fiber"><img src="https://img.shields.io/badge/R3F-Ecosystem-black?logo=react&logoColor=61DAFB" alt="React Three Fiber" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API"><img src="https://img.shields.io/badge/Web_Audio_API-Oscillators-FF7139?logo=webaudio&logoColor=white" alt="Web Audio API" /></a>
</div>

---

## 🚀 Overview

Welcome to **AryamanOS**, a deeply immersive, terminal-inspired 3D web experience. Built from the ground up to push the boundaries of creative web development, this portfolio completely escapes the traditional "flat web" constraints by heavily integrating **WebGL**, **Three.js**, and an algorithmic **Audio Engine** directly into the **Next.js** edge architecture.

This isn't just a portfolio; it's a simulated operating system featuring Matrix-style binary rain, real-time GitHub data pipelines, a custom CMS, and hidden playable easter eggs.

## ✨ Deep Technical Architecture

> [!TIP]
> This codebase demonstrates complex state management, 3D mathematical rendering, algorithmic audio generation, and hybrid data fetching techniques.

### 🌌 High-Performance 3D Graphics Engine
Powered by `@react-three/fiber` and `@react-three/drei`, pushing 60FPS scenes directly to the DOM:
*   **Black Hole Event Horizon:** Simulated light-bending with custom shaders.
*   **Galaxy Sector 7G:** Performant 5000+ node particle system mapped on mathematical spiral distribution vectors.
*   **Cyber Planet & White Hole Streams:** Rendered utilizing hardware-accelerated instances.

### 🎼 Algorithmic Web Audio API
The sound system (`src/lib/AudioEngine.ts`) completely bypasses heavy `.mp3`/`.wav` files by generating retro synth sounds algorithmically on the browser thread:
*   Generates precise frequencies (lasers, explosions, glitches, telemetry) using pure Sine, Sawtooth, Triangle, and Square wave **Oscillators**.
*   Built-in exponential gain ramps and real-time buffer management for zero-latency UI audio feedback.

### 🕹️ Playable Arcade Easter Egg
Features an entirely custom, state-driven 2D retro arcade shooter mini-game (`ArcadeOverload.tsx`):
*   Custom 2D canvas drawing algorithms (`requestAnimationFrame` loops).
*   Collision detection math, hitboxes, and particle explosion emitters.
*   CRT scanline overlays and dynamic glitch triggers linked to the `AudioEngine`.

### 🗄️ Built-in Content Management System (CMS)
Features a fully functional, authenticated Admin Panel (`src/app/admin/page.tsx`):
*   End-to-end `GET`/`PUT` content mutation pipelines (`src/app/api/content/route.ts`).
*   Edits to the portfolio payload propagate globally without triggering massive rebuilds.

### 🐙 Dynamic GitHub Contributions Scraper
A resilient, hybrid API pipeline (`src/app/api/github-contributions/route.ts`):
*   Attempts GraphQL extraction for optimal rate limits.
*   Automatically falls back to an algorithmic HTML parser if token constraints are hit.
*   Includes strict `s-maxage` Edge Caching to prevent Vercel Serverless Function exhaustion.

---

## 🛠️ Complete Tech Stack

| Domain | Core Technology |
| :--- | :--- |
| **Framework & Engine** | Next.js 15, React 19, TypeScript |
| **3D Rendering** | Three.js, React Three Fiber, Drei |
| **Audio Processing** | Native DOM Web Audio API |
| **Styling & Physics** | Tailwind CSS v4, Framer Motion, GSAP |
| **Data Pipelines** | Vercel Blob (`@vercel/blob`), Web3Forms API |

---

## 📂 Internal Routing & Directory Map

```directory
Portfolio/
├── src/
│   ├── app/                    
│   │   ├── admin/page.tsx      # Secure custom CMS
│   │   ├── api/                # Hybrid Edge/Serverless Route Handlers
│   │   └── page.tsx            # Main OS Boot Sequence
│   ├── components/             
│   │   ├── 3D/                 # Complex mathematical WebGL structures
│   │   ├── UI/                 # Terminal UI, GithubGrid, Navbar
│   │   └── ArcadeOverload.tsx  # Canvas-based 2D Shooter Engine
│   ├── data/                   # JSON schemas mapping the OS Registry
│   └── lib/                    
│       ├── AudioEngine.ts      # Pure Oscillator Synth Engine
│       └── githubContributions.ts
└── next.config.ts              
```

---

## ⚙️ Local Development & Deployment

To clone the AryamanOS mainframe locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryaman-niboriya/Portfolio.git
   cd Portfolio
   ```

2. **Initialize Environment Variables:**
   Create a `.env.local` file.
   ```env
   # Required for Contact Form Relay
   NEXT_PUBLIC_WEB3FORMS_KEY=your_key_here
   
   # Required for optimal GitHub Graph scraping (Optional: has HTML fallback)
   GITHUB_TOKEN=your_pat_token_here
   ```

3. **Install Dependencies & Boot:**
   *(Ensure Node.js 18+ is installed)*
   ```bash
   npm install
   npm run dev
   ```
   *The system uplink will be established at `http://localhost:3000`.*

---

## 🧑‍💻 Architect

**Aryaman Niboriya**  
*Senior Full Stack Developer & Creative Technologist*

*   **GitHub:** [@Aryaman-niboriya](https://github.com/Aryaman-niboriya)
*   **LinkedIn:** [aryamanniboriya](https://linkedin.com/in/aryamanniboriya)

> [!NOTE]
> System Integrity: 100%. Glitch anomalies contained. Available for high-level technical contracts and freelance engineering.

<div align="center">
  <br/>
  <p><i>"I don't even see the code anymore. All I see is blonde, brunette, redhead..."</i></p>
  <p><b>[ END OF TRANSMISSION ]</b></p>
</div>
