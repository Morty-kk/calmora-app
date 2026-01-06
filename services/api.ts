const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: Record<string, any>;
  token?: string | null;
};

export type UserPayload = {
  id: string;
  email: string;
  phoneNumber: string | null;
  role: 'PATIENT' | 'THERAPIST' | 'ADMIN';
};

export type AuthResponse = {
  user: UserPayload;
  token: string;
};

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || 'Unbekannter Fehler';
    const error = new Error(message) as Error & { status?: number; details?: unknown };
    error.status = response.status;
    error.details = data?.errors;
    throw error;
  }

  return data as T;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  phoneNumber?: string;
  role?: UserPayload['role'];
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: payload });
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: payload });
}

export async function fetchCurrentUser(token: string | null): Promise<{ user: UserPayload }> {
  if (!token) {
    throw new Error('Kein Token vorhanden');
  }
  return apiFetch<{ user: UserPayload }>('/me', { token });
}

export function getApiBaseUrl() {
  return API_URL;
}
