import { requireOwner } from "@/lib/require-owner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toolsCatalog } from "@/lib/sample-data";

export default async function AdminToolsPage() {
  await requireOwner();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tools & Services</h1>
          <p className="text-sm text-muted-foreground">Track platform dependencies and credentials.</p>
        </div>
        <Button>Add tool</Button>
      </div>

      <div className="grid gap-4">
        {toolsCatalog.map((tool) => (
          <Card key={tool.name} className="border-border/60 bg-card/80">
            <CardHeader>
              <CardTitle className="text-base">{tool.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{tool.notes}</p>
              <p className="text-xs uppercase tracking-wide">{tool.category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
