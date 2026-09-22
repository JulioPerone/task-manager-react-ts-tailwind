import { useRef, useState } from "react";
import type { Group, GroupAction, Task, TaskAction } from "../types/contracts";
import { buildCsvContent, parseCsvContent } from "../utils/csv";

type Props = {
  groups: Group[];
  tasks: Record<string, Task[]>;
  dispatchGroups: React.Dispatch<GroupAction>;
  dispatchTasks: React.Dispatch<TaskAction>;
};

const DataControls = ({ groups, tasks, dispatchGroups, dispatchTasks }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  const showMessage = (text: string, error = false) => {
    setMessage(text);
    setIsError(error);
  };

  const handleExport = async () => {
    try {
      setBusy(true);
      const content = buildCsvContent(groups, tasks);
      const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `todolist-plantilla-${date}.csv`;

      // Dialogo nativo para elegir destino, con descarga clásica como respaldo
      const w = window as unknown as {
        showSaveFilePicker?: (opts?: unknown) => Promise<{
          createWritable: () => Promise<{
            write: (data: Blob) => Promise<void>;
            close: () => Promise<void>;
          }>;
        }>;
      };

      if (w.showSaveFilePicker) {
        try {
          const handle = await w.showSaveFilePicker({
            suggestedName: fileName,
            types: [
              {
                description: "Planilla de cálculo (CSV)",
                accept: { "text/csv": [".csv"] },
              },
            ],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          showMessage(`Plantilla guardada como "${fileName}". Ábrela en Excel, Calc o similar, edítala y luego impórtala.`);
          return;
        } catch (err) {
          // El usuario canceló el diálogo: no aplicar el respaldo
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showMessage(`Plantilla "${fileName}" descargada. Ábrela en Excel, Calc o similar, edítala y luego impórtala.`);
    } finally {
      setBusy(false);
    }
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite reimportar el mismo archivo
    if (!file) return;
    try {
      setBusy(true);
      const text = await file.text();
      const parsed = parseCsvContent(text);

      if (parsed.groups.length === 0) {
        showMessage("El archivo no contiene ningún grupo válido.", true);
        return;
      }

      const hasCurrentData =
        groups.length > 0 || Object.values(tasks).some((t) => t.length > 0);
      if (
        hasCurrentData &&
        !window.confirm(
          `Importar "${file.name}" reemplazará tus ${groups.length} grupo(s) actuales por ${parsed.stats.groups} grupo(s) con ${parsed.stats.tasks} tarea(s). ¿Continuar?`,
        )
      ) {
        return;
      }

      dispatchGroups({ type: "SET_GROUPS", payload: { groups: parsed.groups } });
      dispatchTasks({ type: "SET_TASKS", payload: { tasks: parsed.tasks } });
      showMessage(
        `Importado: ${parsed.stats.groups} grupo(s) y ${parsed.stats.tasks} tarea(s) desde "${file.name}".` +
          (parsed.stats.skipped > 0 ? ` (${parsed.stats.skipped} fila(s) omitida(s))` : ""),
      );
    } catch (err) {
      showMessage(
        err instanceof Error ? `No se pudo importar: ${err.message}` : "No se pudo importar el archivo.",
        true,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleExport}
          disabled={busy}
          className="surface-skin text-white px-4 py-2 rounded hover:opacity-90 transition disabled:opacity-50"
        >
          ⬇ Exportar plantilla (CSV)
        </button>
        <button
          onClick={handleImportClick}
          disabled={busy}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
        >
          ⬆ Importar planilla (CSV)
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/plain"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-sm opacity-70">
          La plantilla se abre en Excel, LibreOffice Calc o Google Sheets.
        </span>
      </div>
      {message && (
        <p
          role="status"
          className={`text-sm rounded p-2 ${isError ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default DataControls;
