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
    <div className="text-right">
      <p className="font-mono text-2xl font-semibold tabular-nums text-zinc-900">{time}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{date}</p>
    </div>
  );
}
