const API_BASE_URL = "http://192.168.178.107:4000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type ApiFetchOptions = {
  method?: HttpMethod;
  token?: string;
  body?: unknown;
};

type ApiErrorShape = { error?: string; message?: string };

export async function apiFetch<T = any>(
  path: string,
  { method = "GET", token, body }: ApiFetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data: any = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg =
      (data as ApiErrorShape)?.error ||
      (data as ApiErrorShape)?.message ||
      `Request failed (${res.status})`;
    throw new Error(errMsg);
  }

  return data as T;
}

export function register(input: { email: string; password: string; role: "PATIENT" | "THERAPIST" }) {
  return apiFetch<{ message: string; userId: string }>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function login(input: { email: string; password: string }) {
  return apiFetch<{ token: string; user: { id: string; email: string; roles?: string[] } }>("/auth/login", {
    method: "POST",
    body: input,
  });
}
