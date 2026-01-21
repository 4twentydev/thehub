import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { HealthWidget } from "@/components/health-widget";
import { ProjectGrid } from "@/components/project-grid";
import { TodayStrip } from "@/components/today-strip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/lib/sample-data";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <Badge variant="accent" className="w-fit uppercase tracking-[0.3em]">
            Mission control
          </Badge>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Dashboard Hub for shipping, tracking, and product ops.
          </h1>
          <p className="text-base text-muted-foreground">
            A curated hub that tracks every project, dependency, environment variable, and runbook. Public view stays
            polished while owner mode keeps the checklist moving.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/projects">Explore projects</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">
                Owner mode <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {projects.slice(0, 4).map((project) => (
              <span key={project.id} className="rounded-full border border-border/60 px-3 py-1">
                {project.name}
              </span>
            ))}
          </div>
        </div>
        <HealthWidget />
      </section>

      <TodayStrip />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured workflows</h2>
          <Button variant="ghost" asChild>
            <Link href="/projects">View directory</Link>
          </Button>
        </div>
        <ProjectGrid projects={projects.slice(0, 4)} />
      </section>
    </div>
  );
}
