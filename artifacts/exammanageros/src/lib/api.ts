export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }) as Promise<{ token: string; user: UserProfile }>,
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  me: () => apiFetch("/auth/me") as Promise<UserProfile>,
  getDomain: () => apiFetch("/domain"),
  mutate: (mutation: Record<string, unknown>) =>
    apiFetch("/domain/mutations", { method: "POST", body: JSON.stringify(mutation) }),
  integrationStatus: () => apiFetch("/integrations/status"),
};
