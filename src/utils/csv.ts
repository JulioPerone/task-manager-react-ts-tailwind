import type { Group, Task } from "../types/contracts";

export const CSV_HEADERS = [
  "grupo_id",
  "grupo_nombre",
  "tarea_id",
  "tarea_titulo",
  "completada",
  "prioridad",
] as const;

export type ParsedBoard = {
  groups: Group[];
  tasks: Record<string, Task[]>;
  stats: { groups: number; tasks: number; skipped: number };
};

const DELIMITER = ";";

// Escapa un campo para CSV (cita si contiene delimitador, comillas o salto de línea)
function escapeField(value: string): string {
  if (value.includes('"')) value = value.replace(/"/g, '""');
  if (
    value.includes(DELIMITER) ||
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value}"`;
  }
  return value;
}

/** Genera el contenido CSV. Si no hay datos, incluye filas de ejemplo editables. */
export function buildCsvContent(
  groups: Group[],
  tasks: Record<string, Task[]>,
): string {
  const lines: string[] = [CSV_HEADERS.join(DELIMITER)];

  const hasData =
    groups.length > 0 && Object.values(tasks).some((t) => t.length > 0);

  if (!hasData && groups.length === 0) {
    // Plantilla con ejemplos: el usuario la edita en Excel/Calc y la reimporta.
    // Los IDs se dejan vacíos para que la app los genere al importar.
    lines.push(
      ["", "Ejemplo Compras", "", "Comprar leche", "FALSE", "medium"]
        .map(escapeField)
        .join(DELIMITER),
      ["", "Ejemplo Compras", "", "Comprar pan", "TRUE", "low"]
        .map(escapeField)
        .join(DELIMITER),
      ["", "Ejemplo Trabajo", "", "Revisar correos", "FALSE", "high"]
        .map(escapeField)
        .join(DELIMITER),
      ["", "Ideas (grupo sin tareas aún)", "", "", "", ""]
        .map(escapeField)
        .join(DELIMITER),
    );
    return "\uFEFF" + lines.join("\r\n");
  }

  for (const group of groups) {
    const groupTasks = tasks[group.id] ?? [];
    if (groupTasks.length === 0) {
      // Fila para grupos sin tareas: así sobreviven al export/import
      lines.push(
        [group.id, group.name, "", "", "", ""].map(escapeField).join(DELIMITER),
      );
    } else {
      for (const task of groupTasks) {
        lines.push(
          [
            group.id,
            group.name,
            task.id,
            task.title,
            task.completed ? "TRUE" : "FALSE",
            task.priority ?? "",
          ]
            .map(escapeField)
            .join(DELIMITER),
        );
      }
    }
  }

  // BOM para que Excel abra bien los acentos (UTF-8)
  return "\uFEFF" + lines.join("\r\n");
}

// ---------- Parsing ----------

function detectDelimiter(headerLine: string): string {
  const candidates = [";", ",", "\t"];
  let best = ";";
  let bestCount = -1;
  for (const d of candidates) {
    const count = headerLine.split(d).length;
    if (count > bestCount) {
      bestCount = count;
      best = d;
    }
  }
  return best;
}

/** Divide una línea CSV respetando comillas dobles. */
function splitCsvLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s-]+/g, "_");
}

const HEADER_ALIASES: Record<string, string[]> = {
  grupo_id: ["grupo_id", "grupo-id", "group_id", "groupid", "id_grupo", "id"],
  grupo_nombre: [
    "grupo_nombre",
    "grupo",
    "group_name",
    "group",
    "nombre_grupo",
    "nombre",
  ],
  tarea_id: ["tarea_id", "tarea-id", "task_id", "taskid", "id_tarea"],
  tarea_titulo: [
    "tarea_titulo",
    "tarea",
    "titulo",
    "title",
    "task_title",
    "task",
    "nombre_tarea",
  ],
  completada: [
    "completada",
    "completado",
    "completed",
    "done",
    "hecho",
    "estado",
    "check",
  ],
  prioridad: ["prioridad", "priority", "prio"],
};

function mapHeaderIndex(headers: string[]): Record<string, number> {
  const norm = headers.map(normalizeHeader);
  const map: Record<string, number> = {};
  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    const idx = norm.findIndex((h) => aliases.includes(h));
    if (idx !== -1) map[canonical] = idx;
  }
  return map;
}

function parseCompleted(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return [
    "true",
    "1",
    "si",
    "sí",
    "yes",
    "y",
    "s",
    "x",
    "✓",
    "✔",
    "completada",
    "completado",
    "hecho",
    "hecha",
    "done",
  ].includes(v);
}

function parsePriority(raw: string): Task["priority"] | undefined {
  const v = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (!v) return undefined;
  if (["low", "baja", "bajo", "verde"].includes(v)) return "low";
  if (["medium", "media", "medio", "amarillo", "amarilla"].includes(v))
    return "medium";
  if (["high", "alta", "alto", "rojo", "roja"].includes(v)) return "high";
  if (
    [
      "very important",
      "very_important",
      "muy importante",
      "muy_importante",
      "urgente",
      "critica",
      "crítica",
      "critico",
      "rosa",
    ].includes(v)
  )
    return "very important";
  return undefined;
}

/**
 * Convierte el texto de la planilla (CSV) en grupos + tareas.
 * - Acepta delimitadores ; , o tab y alias de cabeceras en ES/EN.
 * - IDs vacíos => se generan nuevos UUIDs.
 * - Filas con igual grupo_nombre (sin id) se agrupan juntas.
 */
export function parseCsvContent(text: string): ParsedBoard {
  const clean = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const rawLines = clean.split("\n").filter((l) => l.trim() !== "");
  if (rawLines.length === 0) {
    throw new Error("El archivo está vacío.");
  }

  const delimiter = detectDelimiter(rawLines[0]);
  const headers = splitCsvLine(rawLines[0], delimiter);
  const idx = mapHeaderIndex(headers);

  if (idx["grupo_nombre"] === undefined) {
    throw new Error(
      "No se encontró la columna de grupo (grupo_nombre). Usa la plantilla exportada.",
    );
  }

  const groups: Group[] = [];
  const tasks: Record<string, Task[]> = {};
  const byId = new Map<string, Group>();
  const byName = new Map<string, Group>();
  const usedTaskIds = new Set<string>();
  let skipped = 0;

  const getGroup = (rawId: string, rawName: string): Group | null => {
    const name = rawName.trim();
    if (!name) return null;
    const id = rawId.trim();

    if (id && byId.has(id)) return byId.get(id)!;

    const nameKey = name.toLowerCase();
    if (!id && byName.has(nameKey)) return byName.get(nameKey)!;

    // Si el id viene de la planilla pero el nombre ya existe con otro id,
    // reutilizamos el grupo por nombre (el usuario editó a mano).
    if (id && byName.has(nameKey)) {
      const existing = byName.get(nameKey)!;
      byId.set(id, existing);
      return existing;
    }

    const group: Group = {
      id: id || crypto.randomUUID(),
      name,
      tasks: [],
    };
    groups.push(group);
    tasks[group.id] = [];
    byId.set(group.id, group);
    byName.set(nameKey, group);
    return group;
  };

  for (let i = 1; i < rawLines.length; i++) {
    const cols = splitCsvLine(rawLines[i], delimiter);
    const cell = (key: string): string =>
      idx[key] !== undefined ? (cols[idx[key]] ?? "").trim() : "";

    const group = getGroup(cell("grupo_id"), cell("grupo_nombre"));
    if (!group) {
      skipped++;
      continue;
    }

    const title = cell("tarea_titulo").trim();
    if (!title) continue; // grupo sin tareas: ya quedó creado

    let taskId = cell("tarea_id").trim() || crypto.randomUUID();
    if (usedTaskIds.has(taskId)) taskId = crypto.randomUUID();
    usedTaskIds.add(taskId);

    const task: Task = {
      id: taskId,
      title,
      completed: parseCompleted(cell("completada")),
      priority: parsePriority(cell("prioridad")),
    };
    // Evita guardar priority: undefined en el JSON
    if (!task.priority) delete task.priority;
    tasks[group.id].push(task);
  }

  const taskCount = Object.values(tasks).reduce((n, t) => n + t.length, 0);
  return { groups, tasks, stats: { groups: groups.length, tasks: taskCount, skipped } };
}
