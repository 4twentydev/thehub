"use client";

import { useTransition, useRef } from "react";
import { toast } from "sonner";

import { createAssemblyLog } from "@/lib/assembly-actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type Member = { id: number; name: string };
type Job = { id: number; name: string; unit: string };

export function AssemblyLogForm({ members, jobs }: { members: Member[]; jobs: Job[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const memberId = Number(fd.get("memberId"));
    const jobId = Number(fd.get("jobId"));
    const quantity = Number(fd.get("quantity"));
    const defects = Number(fd.get("defects") || "0");
    const hoursWorked = fd.get("hoursWorked") as string;
    const shiftDate = fd.get("shiftDate") as string;
    const notes = (fd.get("notes") as string) || undefined;

    if (!memberId || !jobId || !quantity || !hoursWorked || !shiftDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await createAssemblyLog({ memberId, jobId, quantity, defects, hoursWorked, shiftDate, notes });
        toast.success("Assembly work logged.");
        formRef.current?.reset();
      } catch {
        toast.error("Failed to log work. Try again.");
      }
    });
  }

  if (members.length === 0 || jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {members.length === 0 ? "Add team members" : "Create jobs"} before logging work.
      </p>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="memberId">Team Member</Label>
        <Select name="memberId" id="memberId" required>
          <option value="">Select member...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="jobId">Job</Label>
        <Select name="jobId" id="jobId" required>
          <option value="">Select job...</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name} ({j.unit})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shiftDate">Shift Date</Label>
        <Input type="date" name="shiftDate" id="shiftDate" defaultValue={todayStr} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="quantity">Quantity</Label>
        <Input type="number" name="quantity" id="quantity" min={0} placeholder="0" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="hoursWorked">Hours Worked</Label>
        <Input type="number" name="hoursWorked" id="hoursWorked" min={0} step="0.25" placeholder="0" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="defects">Defects</Label>
        <Input type="number" name="defects" id="defects" min={0} defaultValue="0" />
      </div>

      <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input name="notes" id="notes" placeholder="Any issues, observations..." />
      </div>

      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Logging..." : "Log Work"}
        </Button>
      </div>
    </form>
  );
}
