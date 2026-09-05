"use client";

import { useEffect, useState } from "react";
import { fetchAuditLogs, AuditLog } from "@/lib/api";
import { X, CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

interface Props {
  eventId: string | null;
  onClose: () => void;
}

export default function AuditModal({ eventId, onClose }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      setLoading(true);
      fetchAuditLogs(eventId)
        .then(setLogs)
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  if (!eventId) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          Agent Audit Trail ({eventId})
        </h3>
        <p className="text-sm text-slate-400 mb-6">Verifiable step-by-step decision sequence</p>

        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading audit execution trace...</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {logs.map((log) => (
              <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {log.step}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <pre className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded border border-slate-800/50 overflow-x-auto">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}