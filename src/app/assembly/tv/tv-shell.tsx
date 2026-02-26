"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, Box, Clock, Hammer, TrendingUp, Trophy, Users } from "lucide-react";

type Metrics = {
  totalUnits: number;
  totalDefects: number;
  totalHours: number;
  logCount: number;
  defectRate: number;
  unitsPerHour: number;
};

type Props = {
  todayMetrics: Metrics;
  weekMetrics: Metrics;
  leaderboard: { memberName: string; totalUnits: number; totalHours: number }[];
  activeJobs: { name: string; completedQuantity: number; targetQuantity: number; unit: string; status: string }[];
  recentLogs: { memberName: string; quantity: number; jobName: string; jobUnit: string; shiftDate: string }[];
};

function TvKpi({
  label,
  value,
  icon: Icon,
  color
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card/60 p-6">
      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-7 w-7" />
      </div>
      <p className="text-5xl font-black tabular-nums leading-none tracking-tight">{value}</p>
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function TvProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{label}</span>
        <span className="text-lg font-bold tabular-nums text-accent">
          {value}/{max} <span className="text-sm text-muted-foreground">({Math.round(pct)}%)</span>
        </span>
      </div>
      <div className="h-4 w-full rounded-full bg-muted/40">
        <div
          className="h-4 rounded-full bg-accent transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function TvShell({ todayMetrics, weekMetrics, leaderboard, activeJobs, recentLogs }: Props) {
  const router = useRouter();
  const [clock, setClock] = useState("");

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 30_000);
    return () => clearInterval(interval);
  }, [router]);

  // Live clock
  useEffect(() => {
    function tick() {
      setClock(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        })
      );
    }
    tick();
    const interval = setInterval(tick, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-6 p-8">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
            <Activity className="h-5 w-5 text-accent" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Assembly Floor</h1>
          <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            LIVE
          </span>
        </div>
        <div className="text-3xl font-bold tabular-nums text-muted-foreground">{clock}</div>
      </div>

      {/* Today's KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <TvKpi
          icon={Box}
          label="Units Today"
          value={todayMetrics.totalUnits}
          color="bg-accent/20 text-accent"
        />
        <TvKpi
          icon={TrendingUp}
          label="Units / Hour"
          value={todayMetrics.unitsPerHour.toFixed(1)}
          color="bg-emerald-500/20 text-emerald-400"
        />
        <TvKpi
          icon={AlertTriangle}
          label="Defect Rate"
          value={`${(todayMetrics.defectRate * 100).toFixed(1)}%`}
          color={todayMetrics.defectRate > 0.02 ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}
        />
        <TvKpi
          icon={Clock}
          label="Hours Logged"
          value={todayMetrics.totalHours.toFixed(1)}
          color="bg-sky-500/20 text-sky-400"
        />
      </div>

      {/* Main content: 3-column layout */}
      <div className="grid flex-1 grid-cols-3 gap-6">
        {/* Column 1: Leaderboard */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Trophy className="h-5 w-5 text-amber-400" />
            Team Leaderboard
            <span className="ml-auto text-xs font-normal text-muted-foreground">This Week</span>
          </h2>
          {leaderboard.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No data this week</p>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 8).map((row, i) => (
                <div key={row.memberName} className="flex items-center gap-3 rounded-xl bg-muted/20 px-4 py-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      i === 0
                        ? "bg-amber-500/30 text-amber-300"
                        : i === 1
                        ? "bg-zinc-400/30 text-zinc-300"
                        : i === 2
                        ? "bg-orange-500/30 text-orange-300"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-semibold">{row.memberName}</p>
                    <p className="text-sm text-muted-foreground tabular-nums">
                      {row.totalHours.toFixed(1)} hrs
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tabular-nums text-accent">{row.totalUnits}</p>
                    <p className="text-xs text-muted-foreground">units</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Active Jobs */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Hammer className="h-5 w-5 text-accent" />
            Active Jobs
          </h2>
          {activeJobs.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No active jobs</p>
          ) : (
            <div className="space-y-5">
              {activeJobs.slice(0, 6).map((job) => (
                <TvProgressBar
                  key={job.name}
                  value={job.completedQuantity}
                  max={job.targetQuantity}
                  label={job.name}
                />
              ))}
            </div>
          )}

          {/* Weekly summary at bottom */}
          <div className="mt-auto pt-6">
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Weekly Totals
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-bold tabular-nums">{weekMetrics.totalUnits}</p>
                  <p className="text-xs text-muted-foreground">Units</p>
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{weekMetrics.unitsPerHour.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Units/hr</p>
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{(weekMetrics.defectRate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Defect Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Live Feed */}
        <div className="rounded-2xl border border-border/40 bg-card/60 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Users className="h-5 w-5 text-sky-400" />
            Live Feed
          </h2>
          {recentLogs.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-muted/20 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">{log.memberName}</span>
                    <span className="text-2xl font-black tabular-nums text-accent">{log.quantity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.jobName} &middot; {log.jobUnit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
