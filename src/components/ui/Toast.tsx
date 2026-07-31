"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

type ToastVariant = "success" | "error" | "info";
interface ToastItem { id: string; message: string; variant: ToastVariant }
interface ToastCtx { toast: (message: string, variant?: ToastVariant) => void }

const Ctx = createContext<ToastCtx | null>(null);

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be inside Toaster");
  return ctx;
}

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map((t) => <ToastPill key={t.id} item={t} />)}
      </div>
    </Ctx.Provider>
  );
}

function ToastPill({ item }: { item: ToastItem }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(r); }, []);

  const icon = {
    success: <path d="M20 6L9 17l-5-5" />,
    error:   <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
    info:    <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  }[item.variant];

  const dot = { success: "bg-emerald-500", error: "bg-red-500", info: "bg-indigo-500" }[item.variant];

  return (
    <div className={`pointer-events-auto flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl shadow-black/20 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${dot}`}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
      </span>
      {item.message}
    </div>
  );
}
