import {
  getAssemblyMetrics,
  getMemberLeaderboard,
  getJobProgress,
  getRecentLogs
} from "@/lib/assembly-actions";
import { today, startOfWeek } from "@/lib/assembly-dates";

import { TvShell } from "./tv-shell";

export const revalidate = 30;

export default async function TvDisplayPage() {
  const todayStr = today();
  const weekStart = startOfWeek();

  const [todayMetrics, weekMetrics, leaderboard, activeJobs, recentLogs] = await Promise.all([
    getAssemblyMetrics(todayStr, todayStr),
    getAssemblyMetrics(weekStart, todayStr),
    getMemberLeaderboard(weekStart, todayStr),
    getJobProgress(),
    getRecentLogs(5)
  ]);

  return (
    <TvShell
      todayMetrics={todayMetrics}
      weekMetrics={weekMetrics}
      leaderboard={leaderboard.map((r) => ({
        memberName: String(r.memberName),
        totalUnits: Number(r.totalUnits),
        totalHours: Number(r.totalHours)
      }))}
      activeJobs={activeJobs.map((j) => ({
        name: j.name,
        completedQuantity: j.completedQuantity,
        targetQuantity: j.targetQuantity,
        unit: j.unit,
        status: j.status
      }))}
      recentLogs={recentLogs.map((l) => ({
        memberName: String(l.memberName),
        quantity: l.quantity,
        jobName: String(l.jobName),
        jobUnit: String(l.jobUnit),
        shiftDate: l.shiftDate
      }))}
    />
  );
}
