import { ProjectCard } from "@/components/project-card";
import type { ProjectSummary } from "@/lib/sample-data";

export function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
