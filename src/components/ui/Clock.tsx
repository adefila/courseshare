"use client";

import { useState, useEffect } from "react";

export function Clock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <div className="shrink-0 text-right">
      <p className="whitespace-nowrap font-mono text-base font-semibold tabular-nums text-zinc-900 sm:text-2xl">{time}</p>
      <p className="mt-0.5 text-[10px] text-zinc-400 sm:text-xs">{date}</p>
    </div>
  );
}
