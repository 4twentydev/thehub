import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { ProjectSummary } from "@/lib/sample-data";

export function ProjectTable({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left">Project</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-border/60">
              <td className="px-4 py-3">
                <Link href={`/projects/${project.slug}`} className="font-medium text-foreground">
                  {project.name}
                </Link>
                <p className="text-xs text-muted-foreground">{project.description}</p>
              </td>
              <td className="px-4 py-3 capitalize text-muted-foreground">{project.status}</td>
              <td className="px-4 py-3">
                <Badge variant="outline">{project.priority}</Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{project.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
