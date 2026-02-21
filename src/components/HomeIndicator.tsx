"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function HomeIndicator() {
  const [dimmed, setDimmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const barRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);

  const resetTimer = useCallback(() => {
    setDimmed(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDimmed(true), 4000);
  }, []);

  useEffect(() => {
    resetTimer();

    const container = document.querySelector(".phone-scroll");
    if (container) {
      container.addEventListener("scroll", resetTimer, { passive: true });
    }
    window.addEventListener("pointerdown", resetTimer);

    return () => {
      clearTimeout(timerRef.current);
      container?.removeEventListener("scroll", resetTimer);
      window.removeEventListener("pointerdown", resetTimer);
    };
  }, [resetTimer]);

  // 위로 스와이프 → 맨 위로 스크롤
  function onTouchStart(e: React.TouchEvent) {
    startY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    const dy = startY.current - e.changedTouches[0].clientY;
    if (dy > 30) {
      const container = document.querySelector(".phone-scroll");
      container?.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div
      ref={barRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={(e) => { startY.current = e.clientY; }}
      onMouseUp={(e) => {
        const dy = startY.current - e.clientY;
        if (dy > 30) {
          document.querySelector(".phone-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 cursor-grab active:cursor-grabbing"
    >
      <div
        className={`h-[5px] w-32 rounded-full bg-neutral-900 dark:bg-neutral-100 transition-opacity duration-1500 ${
          dimmed ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
