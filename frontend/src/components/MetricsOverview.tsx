import { RecoveryEvent } from "@/lib/api";
import { IndianRupee, ShieldCheck, AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  events: RecoveryEvent[];
}

export default function MetricsOverview({ events }: Props) {
  const totalAtRisk = events.reduce((acc, curr) => acc + curr.amount, 0);
  const recoveredEvents = events.filter((e) => e.status === "OUTREACH_DISPATCHED" || e.status === "RECOVERED");
  const totalRecovered = recoveredEvents.reduce((acc, curr) => {
    const discountedAmount = curr.amount * (1 - curr.applied_discount_pct / 100);
    return acc + discountedAmount;
  }, 0);

  const recoveryRate = events.length > 0 ? ((recoveredEvents.length / events.length) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-sm font-medium">Total At-Risk Revenue</span>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-white">₹{totalAtRisk.toLocaleString("en-IN")}</div>
        <p className="text-xs text-slate-500 mt-1">{events.length} failed payment events</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-sm font-medium">Recovered Revenue</span>
          <IndianRupee className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold text-emerald-400">₹{totalRecovered.toLocaleString("en-IN")}</div>
        <p className="text-xs text-slate-500 mt-1">{recoveredEvents.length} transactions engaged</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-sm font-medium">Recovery Success Rate</span>
          <ShieldCheck className="w-5 h-5 text-blue-500" />
        </div>
        <div className="text-2xl font-bold text-white">{recoveryRate}%</div>
        <p className="text-xs text-slate-500 mt-1">Autonomous agent conversion</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-sm font-medium">Active Guardrails</span>
          <RefreshCw className="w-5 h-5 text-indigo-500" />
        </div>
        <div className="text-2xl font-bold text-indigo-400">Max 10% Off</div>
        <p className="text-xs text-slate-500 mt-1">Max 2 contacts per customer</p>
      </div>
    </div>
  );
}