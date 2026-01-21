import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/lib/sample-data";

interface ProjectPageProps {
  params: { slug: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
