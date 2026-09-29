// Submenú deslizante derecho: dos bloques (grupos archivados / tareas archivadas)
// con restaurar individual, restaurar todos y vaciado definitivo.
// Recibe estado + callbacks por props; el cableado vive en GroupManager.

import type { TrashState } from "../types/trash";

export type TrashDrawerHandlers = {
  onRestoreGroup: (id: string) => void;
  onRestoreTask: (groupId: string, taskId: string) => void;
  onRestoreAllGroups: () => void;
  onRestoreAllTasks: () => void;
  onRestoreAll: () => void;
  onPurgeGroup: (id: string) => void;
  onPurgeTask: (groupId: string, taskId: string) => void;
  onEmptyTrash: () => void;
};

type TrashDrawerProps = TrashDrawerHandlers & {
  open: boolean;
  onClose: () => void;
  trash: TrashState;
};

const formatDate = (ts: number) => new Date(ts).toLocaleString();

const TrashDrawer = ({
  open,
  onClose,
  trash,
  onRestoreGroup,
  onRestoreTask,
  onRestoreAllGroups,
  onRestoreAllTasks,
  onRestoreAll,
  onPurgeGroup,
  onPurgeTask,
  onEmptyTrash,
}: TrashDrawerProps) => {
  const total = trash.groups.length + trash.tasks.length;

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Panel deslizante */}
      <aside
        role="dialog"
        aria-hidden={!open}
        aria-label="Papelera de grupos y tareas"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-skin shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg uppercase">Papelera</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar papelera"
            className="material-symbols-outlined p-2 rounded-full hover:bg-neutral-200"
          >
            close
          </button>
        </header>

        <div className="flex flex-wrap gap-2 p-4 border-b">
          <button
            onClick={onRestoreAll}
            disabled={total === 0}
            className="surface-skin text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Restaurar todo ({total})
          </button>
          <button
            onClick={() => {
              if (window.confirm("¿Vaciar la papelera definitivamente? No se podrá deshacer.")) {
                onEmptyTrash();
              }
            }}
            disabled={total === 0}
            className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Vaciar papelera
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 [scrollbar-width:thin]">
          {/* Bloque 1: grupos */}
          <section aria-label="Grupos que archivaste">
            <div className="flex items-center justify-between mb-2">
              <h3 className="italic font-bold task-trash">Grupos que archivaste</h3>
              <button
                onClick={onRestoreAllGroups}
                disabled={trash.groups.length === 0}
                className="text-sm underline disabled:opacity-50"
              >
                Restaurar todos
              </button>
            </div>
            <div className="border-2 task-trash rounded-2xl p-3 min-h-32">
              {trash.groups.length === 0 ? (
                <p className="text-sm opacity-60">No hay grupos archivados.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {trash.groups.map(({ group, tasks, deletedAt }) => (
                    <li
                      key={group.id}
                      className="flex items-center justify-between gap-2 border rounded-xl p-2"
                    >
                      <div className="min-w-0">
                        <p className="font-bold truncate">{group.name}</p>
                        <p className="text-xs opacity-60">
                          {tasks.length} tarea(s) · {formatDate(deletedAt)}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => onRestoreGroup(group.id)}
                          title="Restaurar grupo"
                          className="material-symbols-outlined p-1 rounded hover:bg-green-200"
                        >
                          restore_from_trash
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Eliminar "${group.name}" definitivamente?`)) {
                              onPurgeGroup(group.id);
                            }
                          }}
                          title="Eliminar definitivamente"
                          className="material-symbols-outlined p-1 rounded hover:bg-red-200"
                        >
                          delete_forever
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Bloque 2: tareas */}
          <section aria-label="Tareas que archivaste">
            <div className="flex items-center justify-between mb-2">
              <h3 className="italic font-bold task-trash">Tareas que archivaste</h3>
              <button
                onClick={onRestoreAllTasks}
                disabled={trash.tasks.length === 0}
                className="text-sm underline disabled:opacity-50"
              >
                Restaurar todas
              </button>
            </div>
            <div className="border-2 task-trash rounded-2xl p-3 min-h-32">
              {trash.tasks.length === 0 ? (
                <p className="text-sm opacity-60">No hay tareas archivadas.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {trash.tasks.map(({ task, groupId, groupName, deletedAt }) => (
                    <li
                      key={`${groupId}-${task.id}`}
                      className="flex items-center justify-between gap-2 border rounded-xl p-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate">{task.title}</p>
                        <p className="text-xs opacity-60">
                          {groupName ?? groupId} · {formatDate(deletedAt)}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => onRestoreTask(groupId, task.id)}
                          title="Restaurar tarea"
                          className="material-symbols-outlined p-1 rounded hover:bg-green-200"
                        >
                          restore_from_trash
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Eliminar "${task.title}" definitivamente?`)) {
                              onPurgeTask(groupId, task.id);
                            }
                          }}
                          title="Eliminar definitivamente"
                          className="material-symbols-outlined p-1 rounded hover:bg-red-200"
                        >
                          delete_forever
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <footer className="p-4 border-t text-xs opacity-60">
          Los elementos archivados se conservan aunque recargues. Vaciar o eliminar
          definitivamente no se puede deshacer.
        </footer>
      </aside>
    </>
  );
};

export default TrashDrawer;
