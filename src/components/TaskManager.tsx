import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { TasksContext } from "../context/TasksContext";
import type { Group, Task } from "../types/contracts";
import TaskItem, { DRAG_MIME } from "./TaskItem";
import type { DragTaskPayload } from "./TaskItem";

const hasOurDrag = (e: React.DragEvent) => {
    try {
        return Array.from(e.dataTransfer.types || []).includes(DRAG_MIME);
    } catch {
        return false;
    }
};

const Placeholder = ({ label }: { label: string }) => (
    <div className="drop-placeholder-grow rounded-2xl border-2 border-dashed border-blue-500/70 bg-blue-500/10 h-[62px] mb-2 flex items-center justify-center gap-2 text-blue-700/80 text-sm font-medium overflow-hidden">
        <span className="material-symbols-outlined text-base">arrow_downward</span>
        {label}
    </div>
);

type Priority = NonNullable<Task["priority"]>;

const PRIORITY_OPTIONS: { value: Priority; label: string; boxClass: string }[] = [
    { value: "low", label: "Baja", boxClass: "bg-green-400 hover:bg-green-300" },
    { value: "medium", label: "Media", boxClass: "bg-yellow-400 hover:bg-yellow-300" },
    { value: "high", label: "Alta", boxClass: "bg-red-400 hover:bg-red-300" },
    { value: "very important", label: "Muy importante", boxClass: "bg-pink-500 hover:bg-pink-300" },
];

const TaskManager = ({ groupId, groups }: { groupId: string; groups: Group[] }) => {
    const { tasks, dispatchTasks } = useContext(TasksContext)!;
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragDepth = useRef(0);
    // Filtro independiente por grupo: cada TaskManager tiene su propio estado
    const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
    const [showFilter, setShowFilter] = useState(false);

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        dispatchTasks({ type: "ADD_TASK", payload: { groupId, title: newTaskTitle } });
        setNewTaskTitle("");
        setShowInput(false);
    };

    const handleSelectPriority = (priority: Priority) => {
        // Segunda pulsación quita el filtro (toggle)
        setPriorityFilter((prev) => (prev === priority ? null : priority));
    };

    const handleClearFilter = () => {
        setPriorityFilter(null);
    };

    // Limpieza global: si el drag termina fuera, ninguna columna queda con placeholder colgado
    useEffect(() => {
        const onDocDragEnd = () => {
            dragDepth.current = 0;
            setOverIndex(null);
            setDraggingId(null);
        };
        document.addEventListener("dragend", onDocDragEnd);
        return () => document.removeEventListener("dragend", onDocDragEnd);
    }, []);

    const parsePayload = (e: React.DragEvent): DragTaskPayload | null => {
        try {
            const raw = e.dataTransfer.getData(DRAG_MIME);
            if (!raw) return null;
            return JSON.parse(raw) as DragTaskPayload;
        } catch {
            return null;
        }
    };

    const resetDragState = () => {
        dragDepth.current = 0;
        setOverIndex(null);
        setDraggingId(null);
    };

    const setOverIfChanged = (idx: number) => {
        setOverIndex((prev) => (prev === idx ? prev : idx));
    };

    const fullList = tasks[groupId] || [];
    const isFiltering = priorityFilter !== null;
    const list = isFiltering ? fullList.filter((t) => t.priority === priorityFilter) : fullList;

    const handleDropOnIndex = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        const data = parsePayload(e);
        if (!data) {
            resetDragState();
            return;
        }

        // Con filtro activo los índices visibles no coinciden con los reales:
        // se bloquea el reorden interno y los movimientos externos se añaden al final.
        if (isFiltering) {
            if (data.fromGroupId === groupId) {
                resetDragState();
                return;
            }
            dispatchTasks({
                type: "MOVE_TASK",
                payload: {
                    fromGroupId: data.fromGroupId,
                    toGroupId: groupId,
                    taskId: data.taskId,
                    toIndex: fullList.length,
                },
            });
            resetDragState();
            return;
        }

        if (data.fromGroupId === groupId) {
            // Ajuste visual: si colapsamos el origen, el índice visual corre 1 cuando vienes de arriba
            // El reducer trabaja con índices originales, así que no restamos aquí.
            if (data.fromIndex !== toIndex && !(data.fromIndex + 1 === toIndex)) {
                // Evita no-ops (soltar en el mismo hueco o justo debajo de sí misma)
                let target = toIndex;
                if (data.fromIndex < toIndex) target = toIndex - 1;
                // Si el ajuste lo deja en el mismo sitio, no despachamos
                if (target !== data.fromIndex) {
                    dispatchTasks({
                        type: "REORDER_TASK",
                        payload: { groupId, fromIndex: data.fromIndex, toIndex: target },
                    });
                }
            } else if (data.fromIndex + 1 === toIndex) {
                // Soltado justo debajo de sí misma = sin cambio, evita parpadeo/reorden fantasma
            } else {
                // mismo índice, nada
            }
        } else {
            dispatchTasks({
                type: "MOVE_TASK",
                payload: {
                    fromGroupId: data.fromGroupId,
                    toGroupId: groupId,
                    taskId: data.taskId,
                    toIndex,
                },
            });
        }
        resetDragState();
    };

    const showPlaceholder = overIndex !== null && !isFiltering;

    return (
        <div className="p-4 rounded-2xl inner-skin shadow-2xl">
            {!showInput ? (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowInput(true)}
                            className="surface-skin text-white px-3 py-1 rounded flex-1 hover:bg-blue-700 transition"
                        >
                            Crear tarea
                        </button>

                        <button
                            type="button"
                            title="Filtrar por prioridad"
                            aria-label="Filtrar por prioridad"
                            aria-expanded={showFilter}
                            aria-pressed={priorityFilter !== null}
                            onClick={() => setShowFilter((prev) => !prev)}
                            className={`px-2 py-1 rounded flex items-center justify-center w-[42px] shrink-0 transition hover:opacity-90 ${priorityFilter !== null ? "surface-skin ring-2 ring-offset-1 ring-blue-400" : "surface-skin"}`}
                        >
                            <img
                                width="22"
                                height="22"
                                src="https://img.icons8.com/ios-filled/50/filter--v1.png"
                                alt="Filtrar"
                                className="invert"
                            />
                        </button>
                    </div>

                    {showFilter && (
                        <div
                            role="menu"
                            aria-label="Filtrar por prioridad"
                            className="flex items-center justify-center gap-2 p-2 border rounded-xl bg-white/40 dark:bg-black/20"
                        >
                            {PRIORITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    aria-label={opt.label}
                                    aria-pressed={priorityFilter === opt.value}
                                    onClick={() => handleSelectPriority(opt.value)}
                                    className={`block w-8 h-8 rounded-md border-2 border-neutral-800 transition-colors ${opt.boxClass} ${priorityFilter === opt.value ? "ring-2 ring-neutral-800 dark:ring-white scale-110" : ""}`}
                                />
                            ))}
                            <button
                                type="button"
                                title="Mostrar todas"
                                aria-label="Mostrar todas"
                                onClick={handleClearFilter}
                                className={`px-2 h-8 rounded-md border-2 text-xs font-semibold transition ${priorityFilter === null ? "bg-neutral-800 text-white border-neutral-800" : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100"}`}
                            >
                                Todas
                            </button>
                        </div>
                    )}

                    {priorityFilter !== null && (
                        <p className="text-xs opacity-70 text-center">
                            Mostrando {list.length} de {fullList.length} · filtro: {PRIORITY_OPTIONS.find((o) => o.value === priorityFilter)?.label}{" "}
                            <button type="button" onClick={handleClearFilter} className="underline hover:opacity-100">
                                limpiar
                            </button>
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Nombre de tarea"
                        className="border rounded p-2 w-full input-skin"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddTask}
                            className="surface-skin text-white px-3 py-1 rounded hover-color"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => setShowInput(false)}
                            className="bg-gray-400 text-black px-3 py-1 rounded hover:bg-gray-500 transition"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {isFiltering && (
                <p className="text-[11px] opacity-60 text-center mt-2">
                    Filtro activo: desactívalo para reordenar por arrastre dentro del grupo.
                </p>
            )}

            <div
                onDragEnter={(e) => {
                    if (!hasOurDrag(e)) return;
                    e.preventDefault();
                    dragDepth.current += 1;
                }}
                onDragOver={(e) => {
                    if (!hasOurDrag(e)) return;
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    // Solo cuando el hover es el fondo (no una tarjeta) -> hueco al final
                    if (e.target === e.currentTarget) {
                        setOverIfChanged(list.length);
                    }
                }}
                onDragLeave={(e) => {
                    if (!hasOurDrag(e)) return;
                    dragDepth.current = Math.max(0, dragDepth.current - 1);
                    if (dragDepth.current === 0) {
                        // Salió de verdad de la columna (no solo cambió de tarjeta)
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                            setOverIndex(null);
                        }
                    }
                }}
                onDrop={(e) => handleDropOnIndex(e, overIndex ?? list.length)}
                className="mt-4 min-h-[24px] rounded-xl p-1 transition-colors duration-200"
            >
                {!isFiltering ? (
                    <>
                        {list.map((task, idx) => {
                            const isSource = draggingId === task.id;
                            return (
                                <Fragment key={task.id}>
                                    {overIndex === idx && (
                                        <Placeholder label={isSource ? "Soltar aquí" : "Soltar aquí"} />
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            if (!hasOurDrag(e)) return;
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.dataTransfer.dropEffect = "move";
                                            setOverIfChanged(idx);
                                        }}
                                        onDrop={(e) => handleDropOnIndex(e, idx)}
                                        className={`task-shift overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${isSource ? "max-h-0 opacity-0 scale-[0.96] -mb-2" : "max-h-[120px] opacity-100 scale-100"}`}
                                    >
                                        <TaskItem
                                            task={task}
                                            index={idx}
                                            groupId={groupId}
                                            groups={groups}
                                            dispatchTasks={dispatchTasks}
                                            isDragging={isSource}
                                            onDragStartItem={(id) => {
                                                dragDepth.current = 0;
                                                setDraggingId(id);
                                            }}
                                            onDragEndItem={resetDragState}
                                        />
                                    </div>
                                </Fragment>
                            );
                        })}

                        {/* Hueco al final: aparece con grow suave y empuja sin saltos */}
                        {showPlaceholder && overIndex === list.length && list.length > 0 && (
                            <Placeholder label="Soltar al final" />
                        )}

                        {list.length === 0 && (
                            <div
                                onDragOver={(e) => {
                                    if (!hasOurDrag(e)) return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOverIfChanged(0);
                                }}
                                onDrop={(e) => handleDropOnIndex(e, 0)}
                            >
                                {showPlaceholder ? (
                                    <Placeholder label="Suelta para mover aquí" />
                                ) : (
                                    <p className="text-center text-sm opacity-50 py-4 border border-dashed rounded-xl">
                                        Arrastra tareas aquí
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {list.map((task) => {
                            const realIndex = fullList.findIndex((t) => t.id === task.id);
                            const isSource = draggingId === task.id;
                            return (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    index={realIndex === -1 ? 0 : realIndex}
                                    groupId={groupId}
                                    groups={groups}
                                    dispatchTasks={dispatchTasks}
                                    isDragging={isSource}
                                    onDragStartItem={(id) => {
                                        dragDepth.current = 0;
                                        setDraggingId(id);
                                    }}
                                    onDragEndItem={resetDragState}
                                />
                            );
                        })}

                        {fullList.length === 0 && (
                            <p className="text-center text-sm opacity-50 py-4 border border-dashed rounded-xl">
                                No hay tareas todavía
                            </p>
                        )}

                        {fullList.length > 0 && list.length === 0 && priorityFilter !== null && (
                            <div className="text-center text-sm py-4 border border-dashed rounded-xl space-y-2">
                                <p className="opacity-60">
                                    No hay tareas con prioridad{" "}
                                    {PRIORITY_OPTIONS.find((o) => o.value === priorityFilter)?.label}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleClearFilter}
                                    className="underline font-medium hover:opacity-100"
                                >
                                    Mostrar todas
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskManager;
