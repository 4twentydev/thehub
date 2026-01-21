"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectSummary } from "@/lib/sample-data";

export function ProjectDetail({ project }: { project: ProjectSummary }) {
  return (
    <div className="space-y-8">
      <motion.div layoutId={`project-card-${project.slug}`} className="rounded-2xl border border-border/60 bg-card/80">
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="uppercase">
              {project.status}
            </Badge>
            <Badge variant="accent" className="uppercase">
              Priority {project.priority}
            </Badge>
          </div>
          <motion.h1 layoutId={`project-title-${project.slug}`} className="text-3xl font-semibold">
            {project.name}
          </motion.h1>
          <p className="text-base text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((stack) => (
              <Badge key={stack}>{stack}</Badge>
            ))}
          </div>
        </div>
      </motion.div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Build notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p className="text-base text-foreground">{project.purpose}</p>
            <ul className="space-y-2">
              {project.buildNotes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <Link href={project.repoUrl} className="text-accent" target="_blank">
              Repository <ArrowUpRight className="inline h-3 w-3" />
            </Link>
            <Link href={project.deployUrl} className="text-accent" target="_blank">
              Vercel deployment <ArrowUpRight className="inline h-3 w-3" />
            </Link>
            <Link href={project.domainUrl} className="text-accent" target="_blank">
              {project.domainUrl} <ArrowUpRight className="inline h-3 w-3" />
            </Link>
            {project.docsUrl && (
              <Link href={project.docsUrl} className="text-accent" target="_blank">
                Docs <ArrowUpRight className="inline h-3 w-3" />
              </Link>
            )}
            {project.figmaUrl && (
              <Link href={project.figmaUrl} className="text-accent" target="_blank">
                Figma <ArrowUpRight className="inline h-3 w-3" />
              </Link>
            )}
            {project.notionUrl && (
              <Link href={project.notionUrl} className="text-accent" target="_blank">
                Notion <ArrowUpRight className="inline h-3 w-3" />
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Environment variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {(project.needsAttention ?? ["No missing env vars"]).map((env) => (
              <div key={env} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                <span>{env}</span>
                <Badge variant={env.includes("Env var") ? "accent" : "outline"}>
                  {env.includes("Env var") ? "missing" : "set"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle>Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {["bun install", "bun dev", "bun db:push", "bun db:migrate", "bun lint"].map((command) => (
              <div key={command} className="rounded-lg border border-border/60 px-3 py-2 font-mono">
                {command}
              </div>
            ))}
            <Button variant="outline" className="mt-4 w-full">
              Open runbook
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
