"use client";

import { useState } from "react";
import { triggerBatchSimulation } from "@/lib/api";
import { Play, Sparkles, Loader2 } from "lucide-react";

interface Props {
  onSimulationComplete: () => void;
}

export default function BatchSimulator({ onSimulationComplete }: Props) {
  const [batchSize, setBatchSize] = useState<number>(15);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      await triggerBatchSimulation(batchSize);
      onSimulationComplete();
    } catch (error) {
      console.error("Batch simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Event Stream Simulator</h3>
          <p className="text-xs text-slate-400">
            Inject mock payment failure webhooks into the AI recovery pipeline.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5">
          <label htmlFor="batchSize" className="text-xs text-slate-400 font-medium">
            Events:
          </label>
          <select
            id="batchSize"
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
            disabled={loading}
          >
            <option value={5} className="bg-slate-900 text-white">5</option>
            <option value={15} className="bg-slate-900 text-white">15</option>
            <option value={30} className="bg-slate-900 text-white">30</option>
            <option value={50} className="bg-slate-900 text-white">50</option>
          </select>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Simulating...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Dispatch Batch</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}