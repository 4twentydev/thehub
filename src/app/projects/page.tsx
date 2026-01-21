import { Filter, LayoutGrid, List } from "lucide-react";

import { ProjectGrid } from "@/components/project-grid";
import { ProjectTable } from "@/components/project-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { projects } from "@/lib/sample-data";

const filters = ["active", "paused", "needs-attention", "has issues", "missing env", "priority high"];

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Project Directory</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and sort every mission in the hub. Public view stays clean; owner mode reveals full ops.
          </p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardContent className="flex flex-wrap gap-2 p-4">
          {filters.map((filter) => (
            <Badge key={filter} variant="outline">
              {filter}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList>
          <TabsTrigger value="grid">
            <LayoutGrid className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="table">
            <List className="h-4 w-4" />
            Table
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <ProjectGrid projects={projects} />
        </TabsContent>
        <TabsContent value="table">
          <ProjectTable projects={projects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
