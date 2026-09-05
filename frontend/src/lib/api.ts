const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export interface RecoveryEvent {
  id: string;
  customer_name: string;
  amount: number;
  failure_code: string;
  status: string;
  attempts_made: number;
  applied_discount_pct: number;
  created_at: string;
}

export interface AuditLog {
  id: number;
  event_id: string;
  step: string;
  details: Record<string, any>;
  timestamp: string;
}

export async function fetchEvents(): Promise<RecoveryEvent[]> {
  const res = await fetch(`${BASE_URL}/events`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchAuditLogs(eventId: string): Promise<AuditLog[]> {
  const res = await fetch(`${BASE_URL}/audit-logs/${eventId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function triggerBatchSimulation(count: number = 20) {
  const res = await fetch(`${BASE_URL}/batch/simulate?count=${count}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger simulation");
  return res.json();
}

export async function triggerRecovery(eventId: string) {
  const res = await fetch(`${BASE_URL}/events/${eventId}/recover`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger recovery");
  return res.json();
}