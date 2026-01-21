import { requireOwner } from "@/lib/require-owner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dependenciesCatalog } from "@/lib/sample-data";

export default async function AdminDependenciesPage() {
  await requireOwner();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dependencies</h1>
          <p className="text-sm text-muted-foreground">Monitor packages and why they matter.</p>
        </div>
        <Button>Add dependency</Button>
      </div>

      <div className="grid gap-4">
        {dependenciesCatalog.map((dependency) => (
          <Card key={dependency.packageName} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">{dependency.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{dependency.notes}</p>
              <p className="font-mono text-xs">{dependency.packageName}@{dependency.version}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
