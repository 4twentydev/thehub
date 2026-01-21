import { notFound } from "next/navigation";

import { requireOwner } from "@/lib/require-owner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects } from "@/lib/sample-data";

interface AdminProjectPageProps {
  params: { id: string };
}

export default async function AdminProjectPage({ params }: AdminProjectPageProps) {
  await requireOwner();
  const project = projects.find((item) => item.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <p className="text-sm text-muted-foreground">Manage dependencies, tools, env vars, and changelog.</p>
        </div>
        <Button>Save updates</Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="env">Env vars</TabsTrigger>
          <TabsTrigger value="ops">Ops</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Project metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{project.purpose}</p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((stack) => (
                  <Badge key={stack}>{stack}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="env">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Environment variables</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {(project.needsAttention ?? ["All env vars set"]).map((item) => (
                <div key={item} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
                  <span>{item}</span>
                  <Badge variant={item.includes("Env var") ? "accent" : "outline"}>
                    {item.includes("Env var") ? "missing" : "set"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ops">
          <Card className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle>Operational checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {project.buildNotes.map((note) => (
                <div key={note} className="rounded-lg border border-border/60 px-3 py-2">
                  {note}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
