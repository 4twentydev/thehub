"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Dot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ProjectSummary } from "@/lib/sample-data";

const statusStyles: Record<string, string> = {
  active: "text-emerald-400",
  paused: "text-amber-400",
  archived: "text-slate-400",
  idea: "text-sky-400",
  "needs-attention": "text-rose-400",
  "in-review": "text-indigo-400"
};

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <motion.div layoutId={`project-card-${project.slug}`} whileHover={{ y: -6 }}>
      <Card className="group flex h-full flex-col justify-between border-border/60 bg-card/80 p-6 transition-shadow hover:shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Dot className={`h-4 w-4 ${statusStyles[project.status]}`} />
            {project.status}
          </div>
          <Badge variant="outline">{project.priority}</Badge>
        </div>
        <div className="mt-4 space-y-2">
          <motion.h3 layoutId={`project-title-${project.slug}`} className="text-lg font-semibold">
            {project.name}
          </motion.h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((stack) => (
            <Badge key={stack}>{stack}</Badge>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-accent transition group-hover:translate-x-1"
        >
          View mission control <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Card>
    </motion.div>
  );
}
