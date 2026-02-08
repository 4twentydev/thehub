import Link from "next/link";
import { ClipboardList, Hammer, Settings, Wrench } from "lucide-react";

import { requireOwner } from "@/lib/require-owner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/sample-data";

export default async function AdminPage() {
  await requireOwner();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Owner Dashboard</h1>
        <p className="text-sm text-muted-foreground">Quick controls for projects, tools, and dependencies.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hammer className="h-4 w-4" /> Assembly
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Track team output and quality.</p>
            <Link href="/admin/assembly" className="text-accent">
              Assembly dashboard
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4" /> Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{projects.length} total projects</p>
            <Link href="/admin/projects" className="text-accent">
              Manage projects
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wrench className="h-4 w-4" /> Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Track services and credentials.</p>
            <Link href="/admin/tools" className="text-accent">
              Manage tools
            </Link>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" /> Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Review package health and notes.</p>
            <Link href="/admin/dependencies" className="text-accent">
              Manage dependencies
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
