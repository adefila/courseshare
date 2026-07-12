import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/ui/AppShell";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "CourseShare — Student Resource Hub",
  description:
    "Find and share course materials, past papers, and notes with students worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex h-full flex-col bg-zinc-50 text-zinc-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
