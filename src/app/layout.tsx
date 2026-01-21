import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteHeader } from "@/components/site-header";
import { CommandPalette } from "@/components/command-palette";

export const metadata: Metadata = {
  title: "Dashboard Hub | 4twenty.dev",
  description: "Mission control for projects, dependencies, and operations."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
            {children}
          </main>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
