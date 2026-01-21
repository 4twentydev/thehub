import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/sample-data";

export function TodayStrip() {
  const recent = [...projects].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 3);

  return (
    <section className="glass flex flex-col gap-4 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Today</h2>
        <Badge variant="outline">Last edited</Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {recent.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/40 p-4 transition hover:border-accent/50"
          >
            <p className="text-sm font-medium text-foreground">{project.name}</p>
            <p className="text-xs text-muted-foreground">Updated {project.updatedAt}</p>
            <span className="inline-flex items-center gap-1 text-xs text-accent">
              Open runbook <ArrowUpRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
