import Link from "next/link";
import { Rocket, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent">
            <Rocket className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Dashboard Hub
            </span>
            <span className="text-lg font-semibold">4twenty.dev</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
          <Link href="/projects" className="transition hover:text-foreground">
            Projects
          </Link>
          <Link href="/admin/assembly" className="transition hover:text-foreground">
            Assembly
          </Link>
          <Link href="/admin" className="transition hover:text-foreground">
            Owner Mode
          </Link>
          <Badge variant="accent" className="uppercase tracking-wide">
            Live ops
          </Badge>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">
              <ShieldCheck className="h-4 w-4" />
              Owner Login
            </Link>
          </Button>
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/projects">Open Hub</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
