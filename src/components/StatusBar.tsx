"use client";

import { useEffect, useState } from "react";

export function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false })
      );
    }
    update();
    // 다음 분 시작에 맞춰 동기화
    const msUntilNextMinute = (60 - new Date().getSeconds()) * 1000;
    const timeout = setTimeout(() => {
      update();
      const id = setInterval(update, 60000);
      return () => clearInterval(id);
    }, msUntilNextMinute);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-7 h-12 bg-white dark:bg-neutral-900">
      {/* 왼쪽: 시간 */}
      <span className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100">{time}</span>

      {/* 가운데: 다이나믹 아일랜드 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 h-7 w-28 rounded-full bg-neutral-950" />

      {/* 오른쪽: 셀룰러 + 와이파이 + 배터리 */}
      <div className="flex items-center gap-1.5">
        {/* 셀룰러 바 */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-neutral-900 dark:text-neutral-100">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill="currentColor" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="currentColor" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="currentColor" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="currentColor" opacity="0.3" />
        </svg>
        {/* 와이파이 */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none" className="text-neutral-900 dark:text-neutral-100">
          <path d="M7.5 10.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z" fill="currentColor" />
          <path d="M4.5 9a4.2 4.2 0 016 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M2 6.2a7.5 7.5 0 0111 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M-.2 3.5a10.8 10.8 0 0115.4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {/* 배터리 */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none" className="text-neutral-900 dark:text-neutral-100">
          <rect x="0.5" y="0.5" width="23" height="11" rx="2.5" stroke="currentColor" strokeWidth="1" opacity="0.35" />
          <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
          <path d="M25 4v4a2 2 0 000-4z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
