"use client";

import { useTransition, useRef } from "react";
import { toast } from "sonner";
import { Users, Hammer } from "lucide-react";

import { createAssemblyMember, toggleMemberActive, createAssemblyJob, updateJobStatus } from "@/lib/assembly-actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Member = { id: number; name: string; role: string; active: boolean };

export function ManagePanel({ members }: { members: Member[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AddMemberCard members={members} />
      <AddJobCard />
    </div>
  );
}

function AddMemberCard({ members }: { members: Member[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const role = (fd.get("role") as string) || undefined;

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    startTransition(async () => {
      try {
        await createAssemblyMember({ name: name.trim(), role });
        toast.success(`Added ${name.trim()}.`);
        formRef.current?.reset();
      } catch {
        toast.error("Failed to add member.");
      }
    });
  }

  function handleToggle(id: number, active: boolean) {
    startTransition(async () => {
      try {
        await toggleMemberActive(id, !active);
        toast.success(active ? "Member deactivated." : "Member activated.");
      } catch {
        toast.error("Failed to update member.");
      }
    });
  }

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" /> Team Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.length > 0 && (
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg bg-muted/20 px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{m.name}</span>
                  <Badge variant="default" className="text-[10px]">{m.role}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggle(m.id, m.active)}
                  disabled={isPending}
                  className="text-xs"
                >
                  {m.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            ))}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="flex gap-2">
          <Input name="name" placeholder="Name" className="flex-1" required />
          <Input name="role" placeholder="Role" className="w-28" defaultValue="assembler" />
          <Button type="submit" size="sm" disabled={isPending}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AddJobCard() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const description = (fd.get("description") as string) || undefined;
    const targetQuantity = Number(fd.get("targetQuantity"));
    const unit = (fd.get("unit") as string) || "units";
    const dueDate = (fd.get("dueDate") as string) || undefined;

    if (!name.trim() || !targetQuantity) {
      toast.error("Name and target quantity are required.");
      return;
    }

    startTransition(async () => {
      try {
        await createAssemblyJob({
          name: name.trim(),
          description,
          targetQuantity,
          unit,
          startDate: new Date().toISOString().slice(0, 10),
          dueDate
        });
        toast.success(`Job "${name.trim()}" created.`);
        formRef.current?.reset();
      } catch {
        toast.error("Failed to create job.");
      }
    });
  }

  return (
    <Card className="border-border/60 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Hammer className="h-4 w-4" /> Create Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="jobName">Job Name</Label>
            <Input name="name" id="jobName" placeholder="e.g. Sign assembly batch #42" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jobDesc">Description (optional)</Label>
            <Input name="description" id="jobDesc" placeholder="Details about this job..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="targetQty">Target Qty</Label>
              <Input type="number" name="targetQuantity" id="targetQty" min={1} placeholder="100" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jobUnit">Unit</Label>
              <Input name="unit" id="jobUnit" defaultValue="units" placeholder="units" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jobDue">Due Date</Label>
              <Input type="date" name="dueDate" id="jobDue" />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
