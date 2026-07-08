import { integrationEnabled } from "./index";

export async function fetchDocCollectDocuments(relatedId: string): Promise<Record<string, unknown>[]> {
  if (!integrationEnabled("DOC_COLLECT_ENABLED")) return [];
  const baseUrl = process.env.DOCS_COLLECT_API_URL;
  const token = process.env.DOCS_COLLECT_SERVICE_TOKEN;
  if (!baseUrl || !token) return [];
  try {
    const res = await fetch(`${baseUrl}/api/requests?relatedId=${encodeURIComponent(relatedId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return (await res.json()) as Record<string, unknown>[];
  } catch {
    return [];
  }
}
