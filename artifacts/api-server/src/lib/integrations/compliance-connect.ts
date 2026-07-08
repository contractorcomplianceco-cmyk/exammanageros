import { integrationEnabled } from "./index";

export async function publishClientUpdate(update: Record<string, unknown>): Promise<string | null> {
  if (!integrationEnabled("COMPLIANCE_CONNECT_ENABLED")) return null;
  const baseUrl = process.env.COMPLIANCE_CONNECT_API_URL ?? "http://127.0.0.1:3001";
  const token = process.env.COMPLIANCE_CONNECT_SERVICE_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(`${baseUrl}/api/internal/status-updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        examId: update.examId,
        clientId: update.clientId,
        status: update.proposedClientStatus,
        message: update.draftMessage,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? `cc-${Date.now()}`;
  } catch {
    return null;
  }
}
