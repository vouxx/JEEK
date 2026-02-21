"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      {status === "loading" && (
        <p className="text-neutral-500">Processing...</p>
      )}
      {status === "success" && (
        <>
          <h1 className="text-xl font-bold text-neutral-900">
            구독이 해지되었습니다
          </h1>
          <p className="mt-2 text-neutral-500">
            더 이상 이메일을 받지 않습니다.
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-xl font-bold text-neutral-900">
            오류가 발생했습니다
          </h1>
          <p className="mt-2 text-neutral-500">
            유효하지 않은 링크입니다.
          </p>
        </>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-neutral-500">Loading...</div>}>
      <UnsubscribeContent />
    </Suspense>
  );
}
