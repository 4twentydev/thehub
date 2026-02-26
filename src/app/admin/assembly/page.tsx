import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  Clock,
  Hammer,
  MonitorPlay,
  TrendingUp,
  Users
} from "lucide-react";

import { requireOwner } from "@/lib/require-owner";
import {
  getAssemblyMetrics,
  getMemberLeaderboard,
  getDailyOutput,
  getJobProgress,
  getRecentLogs,
  getAssemblyMembers
} from "@/lib/assembly-actions";
import { today, startOfWeek, startOfMonth, daysAgo, formatDate } from "@/lib/assembly-dates";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AssemblyLogForm } from "./log-form";
import { ManagePanel } from "./manage-panel";

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <Card className="border-border/60 bg-card/80">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent ?? "bg-accent/20 text-accent"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold tabular-nums">{value}</p>
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          {sub && <p className="truncate text-xs text-muted-foreground/70">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="tabular-nums">{value}/{max} ({Math.round(pct)}%)</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted/40">
        <div
          className="h-2 rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function AssemblyDashboardPage() {
  await requireOwner();

  const todayStr = today();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();
  const last7Start = daysAgo(7);

  const [todayMetrics, weekMetrics, monthMetrics, leaderboard, dailyOutput, activeJobs, recentLogs, members] =
    await Promise.all([
      getAssemblyMetrics(todayStr, todayStr),
      getAssemblyMetrics(weekStart, todayStr),
      getAssemblyMetrics(monthStart, todayStr),
      getMemberLeaderboard(weekStart, todayStr),
      getDailyOutput(last7Start, todayStr),
      getJobProgress(),
      getRecentLogs(10),
      getAssemblyMembers()
    ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Assembly Metrics</h1>
          <p className="text-sm text-muted-foreground">Track output, quality, and team performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/assembly/tv">
              <MonitorPlay className="h-4 w-4" />
              TV Display
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Row - Today */}
      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">Today</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Box} label="Units Assembled" value={todayMetrics.totalUnits} />
          <KpiCard
            icon={TrendingUp}
            label="Units / Hour"
            value={todayMetrics.unitsPerHour.toFixed(1)}
            accent="bg-emerald-500/20 text-emerald-400"
          />
          <KpiCard
            icon={AlertTriangle}
            label="Defect Rate"
            value={`${(todayMetrics.defectRate * 100).toFixed(1)}%`}
            accent={todayMetrics.defectRate > 0.02 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}
          />
          <KpiCard
            icon={Clock}
            label="Hours Logged"
            value={todayMetrics.totalHours.toFixed(1)}
            accent="bg-sky-500/20 text-sky-400"
          />
        </div>
      </div>

      {/* KPI Row - This Week / Month */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This Week</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold tabular-nums">{weekMetrics.totalUnits}</p>
              <p className="text-xs text-muted-foreground">Units</p>
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">{weekMetrics.unitsPerHour.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Units/hr</p>
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">{(weekMetrics.defectRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Defect Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold tabular-nums">{monthMetrics.totalUnits}</p>
              <p className="text-xs text-muted-foreground">Units</p>
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">{monthMetrics.unitsPerHour.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Units/hr</p>
            </div>
            <div>
              <p className="text-xl font-bold tabular-nums">{(monthMetrics.defectRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Defect Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Output Chart (simple bar visualization) */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4" /> Last 7 Days Output
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyOutput.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No data yet. Log assembly work to see trends.</p>
          ) : (
            <div className="flex items-end gap-2" style={{ height: 160 }}>
              {dailyOutput.map((day) => {
                const maxUnits = Math.max(...dailyOutput.map((d) => Number(d.totalUnits)), 1);
                const height = (Number(day.totalUnits) / maxUnits) * 140;
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-xs font-medium tabular-nums">{Number(day.totalUnits)}</span>
                    <div
                      className="w-full rounded-t bg-accent/70 transition-all"
                      style={{ height: Math.max(height, 4) }}
                    />
                    <span className="text-[10px] text-muted-foreground">{formatDate(day.date)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Leaderboard */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" /> Team Leaderboard (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No logs this week yet.</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((row, i) => (
                  <div key={row.memberId} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/40 text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.memberName}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {Number(row.totalUnits)} units &middot; {Number(row.totalHours).toFixed(1)}h &middot;{" "}
                        {Number(row.totalDefects)} defects
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-accent">
                      {Number(row.totalHours) > 0
                        ? (Number(row.totalUnits) / Number(row.totalHours)).toFixed(1)
                        : "0"}{" "}
                      <span className="text-xs font-normal text-muted-foreground">u/hr</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Jobs */}
        <Card className="border-border/60 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Hammer className="h-4 w-4" /> Active Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeJobs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No active jobs. Create one below.</p>
            ) : (
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div key={job.id} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{job.name}</span>
                      <Badge
                        variant={job.status === "in-progress" ? "accent" : "default"}
                        className="text-[10px]"
                      >
                        {job.status}
                      </Badge>
                      {job.dueDate && (
                        <span className="ml-auto text-xs text-muted-foreground">Due {formatDate(job.dueDate)}</span>
                      )}
                    </div>
                    <ProgressBar
                      value={job.completedQuantity}
                      max={job.targetQuantity}
                      label={`${job.completedQuantity} / ${job.targetQuantity} ${job.unit}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Log Entry Form */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Log Assembly Work</CardTitle>
        </CardHeader>
        <CardContent>
          <AssemblyLogForm members={members} jobs={activeJobs} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No logs recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-4 rounded-lg bg-muted/20 px-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">{log.memberName}</span>
                    <span className="text-muted-foreground"> logged </span>
                    <span className="font-medium tabular-nums">{log.quantity} {log.jobUnit}</span>
                    <span className="text-muted-foreground"> on </span>
                    <span className="font-medium">{log.jobName}</span>
                    {Number(log.defects) > 0 && (
                      <span className="text-rose-400"> ({log.defects} defects)</span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDate(log.shiftDate)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manage Members & Jobs */}
      <ManagePanel members={members} />
    </div>
  );
}
