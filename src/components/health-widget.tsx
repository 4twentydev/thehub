import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { projects } from "@/lib/sample-data";

export function HealthWidget() {
  const attention = projects.filter((project) => project.needsAttention?.length);
  const active = projects.filter((project) => project.status === "active");

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base">Health Snapshot</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Active projects</span>
          <span className="font-semibold text-foreground">{active.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Needs attention</span>
          <span className="font-semibold text-rose-400">{attention.length}</span>
        </div>
        <div className="space-y-2">
          {attention.slice(0, 3).map((project) => (
            <div key={project.id} className="flex items-start gap-3 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-rose-400" />
              <div>
                <p className="font-medium text-foreground">{project.name}</p>
                <p className="text-xs text-muted-foreground">{project.needsAttention?.[0]}</p>
              </div>
            </div>
          ))}
          {attention.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> All systems healthy
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
