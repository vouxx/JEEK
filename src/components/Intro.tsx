"use client";

import { useEffect, useState } from "react";

export function Intro({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [fading, setFading] = useState(false);
  const full = "JEEK";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(interval);
        setTimeout(() => setFading(true), 600);
        setTimeout(() => onDone(), 1200);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-neutral-950 transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <h1 className="font-mono text-4xl font-bold text-white tracking-tight">
        {text}
        <span className="animate-pulse">|</span>
      </h1>
    </div>
  );
}
