export const STORAGE_KEYS = {
  groups: "todolist.groups.v1",
  tasks: "todolist.tasks.v1",
  theme: "todolist.theme.v1",
} as const;

// Lectura/escritura tolerante: ante dato corrupto o cuota llena, usa el fallback sin romper la app
export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sin espacio o sin acceso: se ignora para no interrumpir
  }
}
