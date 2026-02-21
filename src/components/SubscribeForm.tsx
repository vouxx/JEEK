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
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <h3 className="text-sm font-bold text-neutral-700">
        매일 아침 뉴스 받아보기
      </h3>
      <p className="mt-1 text-xs text-neutral-500">
        AI/Tech 뉴스 다이제스트를 이메일로 받아보세요.
      </p>

      {status === "success" ? (
        <p className="mt-3 text-sm text-green-600">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "..." : "구독하기"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{message}</p>
      )}
    </div>
  );
}
