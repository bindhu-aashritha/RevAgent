"use client";

import { useEffect, useState } from "react";
import { fetchEvents, triggerRecovery, RecoveryEvent } from "@/lib/api";
import MetricsOverview from "@/components/MetricsOverview";
import AuditModal from "@/components/AuditModal";
import BatchSimulator from "@/components/BatchSimulator";
import { RefreshCw, Eye, Zap } from "lucide-react";

export default function Dashboard() {
  const [events, setEvents] = useState<RecoveryEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      console.error("Failed loading events", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecover = async (eventId: string) => {
    await triggerRecovery(eventId);
    setTimeout(loadData, 1000); // Re-fetch updated event status
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">RevAgent</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Razorpay Engine Active
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Autonomous Multi-Channel AI Revenue Recovery Platform
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Simulator Control Box */}
      <BatchSimulator onSimulationComplete={loadData} />

      {/* Metrics Overview Cards */}
      <MetricsOverview events={events} />

      {/* Real-time Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-white text-sm">Failed Checkout Stream</h2>
          </div>
          <span className="text-xs text-slate-500">{events.length} events logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Failure Code</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    No active events found. Click <strong>"Dispatch Batch"</strong> above to inject test data.
                  </td>
                </tr>
              ) : (
                events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{evt.customer_name}</div>
                      <div className="text-xs text-slate-500">{evt.id}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      ₹{evt.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded border border-slate-700 font-mono">
                        {evt.failure_code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {evt.status === "PENDING" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pending
                        </span>
                      )}
                      {evt.status === "OUTREACH_DISPATCHED" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Outreach Active ({evt.applied_discount_pct}% Off)
                        </span>
                      )}
                      {evt.status === "ESCALATED" && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                          Escalated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {evt.status === "PENDING" && (
                        <button
                          onClick={() => handleRecover(evt.id)}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors shadow-sm"
                        >
                          Run Agent
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedEventId(evt.id)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-3 py-1.5 rounded transition-colors inline-flex items-center gap-1 border border-slate-700/50"
                      >
                        <Eye className="w-3.5 h-3.5" /> Audit Trace
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal View */}
      <AuditModal eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />
    </main>
  );
}