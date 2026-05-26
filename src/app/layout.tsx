import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARYAMAN | The Binary Singularity",
  description: "A next-level binary portfolio exploring the intersection of time, space, and code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} scroll-smooth`}
    >
      <body className="antialiased selection:bg-matrix-green selection:text-void-black">
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
