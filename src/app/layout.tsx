import type { Metadata } from "next";
import { Instrument_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "CourseShare — Student Resource Hub",
  description:
    "Find and share course materials, past papers, and notes with students worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${dmMono.variable} h-full antialiased`}>
      <body className="flex h-full flex-col bg-[#fdfcff] text-zinc-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
