import Link from "next/link";
import { Plus } from "lucide-react";

import { requireOwner } from "@/lib/require-owner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/sample-data";

export default async function AdminProjectsPage() {
  await requireOwner();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and connect projects.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">{project.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="space-y-1">
                <p>{project.description}</p>
                <p>Last updated {project.updatedAt}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/projects/${project.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
