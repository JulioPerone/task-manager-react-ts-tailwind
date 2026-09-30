import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { TasksContext } from "../context/TasksContext";
import type { Group } from "../types/contracts";
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

const TaskManager = ({ groupId, groups }: { groupId: string; groups: Group[] }) => {
    const { tasks, dispatchTasks } = useContext(TasksContext)!;
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [overIndex, setOverIndex] = useState<number | null>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const dragDepth = useRef(0);

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        dispatchTasks({ type: "ADD_TASK", payload: { groupId, title: newTaskTitle } });
        setNewTaskTitle("");
        setShowInput(false);
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

    const handleDropOnIndex = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault();
        e.stopPropagation();
        const data = parsePayload(e);
        if (!data) {
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

    const list = tasks[groupId] || [];
    const showPlaceholder = overIndex !== null;

    return (
        <div className="p-4 rounded-2xl inner-skin shadow-2xl">
            {!showInput ? (
                <button
                    onClick={() => setShowInput(true)}
                    className="surface-skin text-white px-3 py-1 rounded w-full hover:bg-blue-700 transition"
                >
                    Crear tarea
                </button>
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
            </div>
        </div>
    );
};

export default TaskManager;
