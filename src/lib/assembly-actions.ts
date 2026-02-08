"use server";

import { db } from "@/db";
import { assemblyMembers, assemblyJobs, assemblyLogs } from "@/db/schema";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ---- Members ----

export async function getAssemblyMembers(activeOnly = true) {
  if (activeOnly) {
    return db.select().from(assemblyMembers).where(eq(assemblyMembers.active, true)).orderBy(assemblyMembers.name);
  }
  return db.select().from(assemblyMembers).orderBy(assemblyMembers.name);
}

export async function createAssemblyMember(data: { name: string; role?: string }) {
  const [member] = await db
    .insert(assemblyMembers)
    .values({ name: data.name, role: data.role ?? "assembler" })
    .returning();
  revalidatePath("/admin/assembly");
  return member;
}

export async function toggleMemberActive(id: number, active: boolean) {
  await db.update(assemblyMembers).set({ active }).where(eq(assemblyMembers.id, id));
  revalidatePath("/admin/assembly");
}

// ---- Jobs ----

export async function getAssemblyJobs(statusFilter?: string) {
  if (statusFilter) {
    return db
      .select()
      .from(assemblyJobs)
      .where(eq(assemblyJobs.status, statusFilter))
      .orderBy(desc(assemblyJobs.updatedAt));
  }
  return db.select().from(assemblyJobs).orderBy(desc(assemblyJobs.updatedAt));
}

export async function createAssemblyJob(data: {
  name: string;
  description?: string;
  targetQuantity: number;
  unit?: string;
  startDate?: string;
  dueDate?: string;
}) {
  const [job] = await db
    .insert(assemblyJobs)
    .values({
      name: data.name,
      description: data.description ?? null,
      targetQuantity: data.targetQuantity,
      unit: data.unit ?? "units",
      startDate: data.startDate ?? null,
      dueDate: data.dueDate ?? null
    })
    .returning();
  revalidatePath("/admin/assembly");
  return job;
}

export async function updateJobStatus(id: number, status: string) {
  await db
    .update(assemblyJobs)
    .set({ status, updatedAt: new Date() })
    .where(eq(assemblyJobs.id, id));
  revalidatePath("/admin/assembly");
}

// ---- Logs ----

export async function createAssemblyLog(data: {
  memberId: number;
  jobId: number;
  quantity: number;
  defects?: number;
  hoursWorked: string;
  notes?: string;
  shiftDate: string;
}) {
  const [log] = await db
    .insert(assemblyLogs)
    .values({
      memberId: data.memberId,
      jobId: data.jobId,
      quantity: data.quantity,
      defects: data.defects ?? 0,
      hoursWorked: data.hoursWorked,
      notes: data.notes ?? null,
      shiftDate: data.shiftDate
    })
    .returning();

  // Update the job's completed quantity
  await db
    .update(assemblyJobs)
    .set({
      completedQuantity: sql`${assemblyJobs.completedQuantity} + ${data.quantity}`,
      updatedAt: new Date()
    })
    .where(eq(assemblyJobs.id, data.jobId));

  revalidatePath("/admin/assembly");
  revalidatePath("/assembly/tv");
  return log;
}

export async function getRecentLogs(limit = 20) {
  return db
    .select({
      id: assemblyLogs.id,
      quantity: assemblyLogs.quantity,
      defects: assemblyLogs.defects,
      hoursWorked: assemblyLogs.hoursWorked,
      notes: assemblyLogs.notes,
      shiftDate: assemblyLogs.shiftDate,
      createdAt: assemblyLogs.createdAt,
      memberName: assemblyMembers.name,
      jobName: assemblyJobs.name,
      jobUnit: assemblyJobs.unit
    })
    .from(assemblyLogs)
    .innerJoin(assemblyMembers, eq(assemblyLogs.memberId, assemblyMembers.id))
    .innerJoin(assemblyJobs, eq(assemblyLogs.jobId, assemblyJobs.id))
    .orderBy(desc(assemblyLogs.createdAt))
    .limit(limit);
}

// ---- Aggregated metrics ----

export async function getAssemblyMetrics(dateFrom: string, dateTo: string) {
  const rows = await db
    .select({
      totalUnits: sql<number>`coalesce(sum(${assemblyLogs.quantity}), 0)`,
      totalDefects: sql<number>`coalesce(sum(${assemblyLogs.defects}), 0)`,
      totalHours: sql<number>`coalesce(sum(${assemblyLogs.hoursWorked}::numeric), 0)`,
      logCount: sql<number>`count(*)`,
    })
    .from(assemblyLogs)
    .where(and(gte(assemblyLogs.shiftDate, dateFrom), lte(assemblyLogs.shiftDate, dateTo)));

  const totals = rows[0] ?? { totalUnits: 0, totalDefects: 0, totalHours: 0, logCount: 0 };

  return {
    totalUnits: Number(totals.totalUnits),
    totalDefects: Number(totals.totalDefects),
    totalHours: Number(totals.totalHours),
    logCount: Number(totals.logCount),
    defectRate: totals.totalUnits > 0 ? Number(totals.totalDefects) / Number(totals.totalUnits) : 0,
    unitsPerHour: totals.totalHours > 0 ? Number(totals.totalUnits) / Number(totals.totalHours) : 0
  };
}

export async function getMemberLeaderboard(dateFrom: string, dateTo: string) {
  return db
    .select({
      memberId: assemblyLogs.memberId,
      memberName: assemblyMembers.name,
      totalUnits: sql<number>`coalesce(sum(${assemblyLogs.quantity}), 0)`,
      totalDefects: sql<number>`coalesce(sum(${assemblyLogs.defects}), 0)`,
      totalHours: sql<number>`coalesce(sum(${assemblyLogs.hoursWorked}::numeric), 0)`,
    })
    .from(assemblyLogs)
    .innerJoin(assemblyMembers, eq(assemblyLogs.memberId, assemblyMembers.id))
    .where(and(gte(assemblyLogs.shiftDate, dateFrom), lte(assemblyLogs.shiftDate, dateTo)))
    .groupBy(assemblyLogs.memberId, assemblyMembers.name)
    .orderBy(sql`sum(${assemblyLogs.quantity}) desc`);
}

export async function getDailyOutput(dateFrom: string, dateTo: string) {
  return db
    .select({
      date: assemblyLogs.shiftDate,
      totalUnits: sql<number>`coalesce(sum(${assemblyLogs.quantity}), 0)`,
      totalDefects: sql<number>`coalesce(sum(${assemblyLogs.defects}), 0)`,
      totalHours: sql<number>`coalesce(sum(${assemblyLogs.hoursWorked}::numeric), 0)`,
    })
    .from(assemblyLogs)
    .where(and(gte(assemblyLogs.shiftDate, dateFrom), lte(assemblyLogs.shiftDate, dateTo)))
    .groupBy(assemblyLogs.shiftDate)
    .orderBy(assemblyLogs.shiftDate);
}

export async function getJobProgress() {
  return db
    .select()
    .from(assemblyJobs)
    .where(
      sql`${assemblyJobs.status} in ('pending', 'in-progress')`
    )
    .orderBy(assemblyJobs.dueDate);
}
