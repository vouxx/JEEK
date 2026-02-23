"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      setStatus("error");
      setMessage("오류가 발생했습니다");
    }
  }

  return (
    <div>
      <h3 className="text-xs font-medium tracking-wider text-neutral-400 dark:text-neutral-500 uppercase">
        뉴스레터 구독
      </h3>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        매일 아침 AI/Tech 뉴스를 이메일로 받아보세요. (Gmail만 가능)
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@gmail.com"
            required
            className="flex-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-600 transition-shadow"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-300 disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "..." : "구독"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
