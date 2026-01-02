export type Msg = {
  id: string;
  from: "patient" | "therapist";
  text: string;
  time: string;
};

type Store = Record<string, Msg[]>;

const STORAGE_KEY = "calmora_chat_store_v1";

const DEFAULT_SEED: Store = {
  p1: [
    { id: "1", from: "patient", text: "Hallo Herr Bellamy, ich fühle mich in letzter Zeit sehr gestresst und weiß nicht genau warum.", time: "10:13" },
    { id: "2", from: "therapist", text: "Danke, dass du das sagst. Kannst du mir ein bisschen genauer beschreiben, was dich im Moment am meisten belastet?", time: "10:14" },
    { id: "3", from: "patient", text: "alles zu viel wird, Arbeit, Familie, alles zusammen Ich kann mich kaum entspannen", time: "10:14" },
    { id: "4", from: "therapist", text: "wirklich schwer. Wir können gemeinsam schauen, was dir helfen könnte, etwas Ruhe und Kontrolle zurückzubekommen", time: "10:15" },
    { id: "5", from: "patient", text: "Das wäre gut. Ich möchte wirklich lernen, besser damit umzugehen.", time: "10:16" },
  ],
  p2: [
    { id: "a1", from: "patient", text: "Ich hatte heute wieder Angstgefühle, vor allem am Abend.", time: "09:35" },
    { id: "a2", from: "therapist", text: "Okay. Lass uns schauen, welche Situationen das auslösen. Was war kurz davor?", time: "09:36" },
  ],
};

// ====== store in memory ======
let store: Store = {};

// ====== helpers (web localStorage) ======
function isWeb() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function loadFromStorage(): Store | null {
  if (!isWeb()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Store;
  } catch {
    return null;
  }
}

function saveToStorage(next: Store) {
  if (!isWeb()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

// ====== init once ======
(function init() {
  const loaded = loadFromStorage();
  if (loaded) {
    store = loaded;
    return;
  }
  
  
  store = { ...DEFAULT_SEED };
  saveToStorage(store);
})();

// ====== API ======
export function getChat(patientId: string): Msg[] {
  return store[patientId] ?? [];
}

export function setChat(patientId: string, msgs: Msg[]) {
  store = { ...store, [patientId]: msgs };
  saveToStorage(store);
}

export function getActiveChatPatientIds(): string[] {
  return Object.keys(store).filter((pid) => (store[pid]?.length ?? 0) > 0);
}


export function clearAllChats() {
  store = {};
  saveToStorage(store);
}
