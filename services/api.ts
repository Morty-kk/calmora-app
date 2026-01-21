import { BACKEND_URL } from "../constants/backend";

const API_BASE_URL = BACKEND_URL;

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

/** ===================== AUTH ===================== **/

export function register(input: {
  email: string;
  password: string;
  role: "PATIENT" | "THERAPIST";
  name: string; // ✅ جديد
}) {
  return apiFetch<{ message: string; userId: number }>("/auth/register", {
    method: "POST",
    body: input,
  });
}

export function login(input: { email: string; password: string }) {
  return apiFetch<{
    token: string;
    user: { id: number; email: string; role: "PATIENT" | "THERAPIST"; name: string }; // ✅ name
  }>("/auth/login", {
    method: "POST",
    body: input,
  });
}

/** ===================== CHAT TYPES ===================== **/

export type ChatUser = {
  id: number;
  email: string;
  role: "PATIENT" | "THERAPIST";
  name?: string; // ✅ موجود بالـ DB الآن
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  createdAt: string;
  readAt: string | null;
  type?: string | null;
  metadata?: unknown;
};

export type Conversation = {
  id: number;
  patientId: number;
  therapistId: number;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  patient: ChatUser;
  therapist: ChatUser;
  lastMessage: ChatMessage | null;

  // ✅ جديد: عدد الرسائل غير المقروءة (بيجي من backend)
  unreadCount?: number;
};

/** ===================== CHAT API ===================== **/

export function getConversations(token: string) {
  return apiFetch<{ conversations: Conversation[] }>("/chat/conversations", {
    token,
  });
}

// ✅ جديد: إنشاء محادثة بين Patient و Therapist
export function createConversation(
  token: string,
  payload: { patientEmail: string; therapistEmail: string }
) {
  return apiFetch<{ conversation: Conversation }>("/chat/conversations", {
    method: "POST",
    token,
    body: payload,
  });
}

export function getConversationMessages(
  token: string,
  conversationId: number,
  params: { cursor?: number; limit?: number } = {}
) {
  const searchParams = new URLSearchParams();
  if (params.cursor) searchParams.set("cursor", String(params.cursor));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  return apiFetch<{ messages: ChatMessage[]; nextCursor: number | null }>(
    `/chat/conversations/${conversationId}/messages${query ? `?${query}` : ""}`,
    { token }
  );
}

export function sendMessage(
  token: string,
  conversationId: number,
  payload: { content: string }
) {
  return apiFetch<{ message: ChatMessage }>(
    `/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      token,
      body: payload,
    }
  );
}

export function markMessageRead(token: string, messageId: number) {
  return apiFetch<{ message: ChatMessage }>(`/chat/messages/${messageId}/read`, {
    method: "PATCH",
    token,
  });
}

// ✅ جديد: قراءة كل رسائل المحادثة دفعة وحدة (أفضل من markMessageRead لكل رسالة)
export function markConversationRead(token: string, conversationId: number) {
  return apiFetch<{ updated: number }>(`/chat/conversations/${conversationId}/read`, {
    method: "PATCH",
    token,
  });
}


