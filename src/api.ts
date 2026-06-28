import { useQuery, useMutation } from "@tanstack/react-query";

const getToken = () => localStorage.getItem("nexaro_token");

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error((data as { error?: string }).error || `HTTP ${res.status}`) as Error & {
      response: { status: number; data: unknown };
    };
    err.response = { status: res.status, data };
    throw err;
  }
  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  discordId: string | null;
  createdAt: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  ram: string;
  cpu: string;
  storage: string;
  bandwidth: string;
  features: string[];
  highlighted: boolean;
  tier: string;
}

export interface Ticket {
  id: number;
  userId: number;
  subject: string;
  message: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  activeUsers: number;
  plansSold: number;
  uptimePercent: number;
  ticketsResolved: number;
}

export const getGetMeQueryKey = () => ["getMe"] as const;
export const useGetMe = (opts?: { query?: { retry?: boolean } }) =>
  useQuery<User>({
    queryKey: getGetMeQueryKey(),
    queryFn: () => apiFetch("/auth/me"),
    retry: opts?.query?.retry ?? false,
  });

export const useLogin = () =>
  useMutation<{ user: User; token: string }, Error, { data: { email: string; password: string } }>({
    mutationFn: ({ data }) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  });

export const useRegister = () =>
  useMutation<{ user: User; token: string }, Error, { data: { firstName: string; lastName: string; email: string; password: string; agreedToTerms: boolean } }>({
    mutationFn: ({ data }) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  });

export const useLogout = () =>
  useMutation<void, Error, undefined>({
    mutationFn: () => apiFetch("/auth/logout", { method: "POST" }),
    onSuccess: () => localStorage.removeItem("nexaro_token"),
  });

export const getListPlansQueryKey = () => ["listPlans"] as const;
export const useListPlans = (_opts?: unknown) =>
  useQuery<Plan[]>({
    queryKey: getListPlansQueryKey(),
    queryFn: () => apiFetch("/plans"),
  });

export const getListTicketsQueryKey = () => ["listTickets"] as const;
export const useListTickets = (_opts?: unknown) =>
  useQuery<Ticket[]>({
    queryKey: getListTicketsQueryKey(),
    queryFn: () => apiFetch("/tickets"),
    retry: false,
  });

export const useCreateTicket = () =>
  useMutation<Ticket, Error, { data: { subject: string; message: string; priority: string } }>({
    mutationFn: ({ data }) => apiFetch("/tickets", { method: "POST", body: JSON.stringify(data) }),
  });

export const getGetOverviewQueryKey = () => ["getOverview"] as const;
export const useGetOverview = (_opts?: unknown) =>
  useQuery<Stats>({
    queryKey: getGetOverviewQueryKey(),
    queryFn: () => apiFetch("/stats/overview"),
  });
