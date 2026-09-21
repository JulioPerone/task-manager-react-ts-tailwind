import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Group, Task, TaskAction } from "../types/contracts";

type Props = {
    task: Task;
    groupId: string;
    groups: Group[];
    dispatchTasks: React.Dispatch<TaskAction>;
};

const TaskMenu = ({ task, groupId, groups, dispatchTasks }: Props) => {
    const [open, setOpen] = useState(false);
    const [moveOpen, setMoveOpen] = useState(false);
    const [priorityOpen, setPriorityOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const closeAll = () => {
        setOpen(false);
        setMoveOpen(false);
        setPriorityOpen(false);
        setConfirmDelete(false);
    };

    const handleMoveTask = (toGroupId: string) => {
        dispatchTasks({
            type: "MOVE_TASK",
            payload: { fromGroupId: groupId, toGroupId, taskId: task.id }
        });
        setMoveOpen(false);
        setOpen(false);
    };

    const handleSetPriority = (priority: "low" | "medium" | "high" | "very important") => {
        dispatchTasks({
            type: "SET_PRIORITY_TASK",
            payload: { groupId, taskId: task.id, priority },
        });
        setPriorityOpen(false);
        setOpen(false);
    };

    const handleConfirmDelete = (confirmed: boolean) => {
        dispatchTasks({
            type: "CONFIRM_DELETE_TASK",
            payload: { groupId, taskId: task.id, confirmed },
        });
        setConfirmDelete(false);
        setOpen(false);
    };

    // Calcula la posición fija del menú a partir del botón,
    // con clamp al viewport para que SIEMPRE se muestre completo
    // y nunca genere scroll en los contenedores padres.
    const updatePosition = () => {
        const btn = buttonRef.current?.getBoundingClientRect();
        if (!btn) return;

        const menuEl = menuRef.current;
        const menuWidth = menuEl?.offsetWidth ?? 180;
        const menuHeight = menuEl?.offsetHeight ?? 220;

        const GAP = 12;
        const MARGIN = 8;

        // Por defecto a la derecha del botón, centrado verticalmente
        let left = btn.right + GAP;
        let top = btn.top + btn.height / 2 - menuHeight / 2;

        // Si no cabe a la derecha, voltear a la izquierda
        if (left + menuWidth > window.innerWidth - MARGIN) {
            left = btn.left - menuWidth - GAP;
        }
        // Clamp horizontal final (por si la pantalla es muy estrecha)
        left = Math.max(MARGIN, Math.min(left, window.innerWidth - menuWidth - MARGIN));

        // Clamp vertical para que nunca se corte arriba/abajo
        top = Math.max(MARGIN, Math.min(top, window.innerHeight - menuHeight - MARGIN));

        setMenuPos((prev) => (prev.top === top && prev.left === left ? prev : { top, left }));
    };

    // Posicionamiento inicial al abrir
    const handleToggle = () => {
        if (!open && buttonRef.current) {
            const btn = buttonRef.current.getBoundingClientRect();
            // Posición provisional para el primer pintado (se corrige en useLayoutEffect)
            setMenuPos({
                top: Math.max(8, btn.bottom + 8),
                left: Math.max(8, Math.min(btn.right + 12, window.innerWidth - 190)),
            });
            setOpen(true);
        } else {
            closeAll();
        }
    };

    // Reposiciona cuando el menú cambia de tamaño (move / priority / confirm)
    // y cuando hay scroll o resize, para que siga al botón sin cortarse.
    useLayoutEffect(() => {
        if (!open) return;
        updatePosition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, moveOpen, priorityOpen, confirmDelete]);

    useLayoutEffect(() => {
        if (!open) return;
        const onScrollResize = () => updatePosition();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeAll();
        };
        window.addEventListener("scroll", onScrollResize, true);
        window.addEventListener("resize", onScrollResize);
        document.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("scroll", onScrollResize, true);
            window.removeEventListener("resize", onScrollResize);
            document.removeEventListener("keydown", onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // El submenú de prioridad se voltea a la izquierda si no cabe a la derecha
    const flipPriority =
        typeof window !== "undefined" && menuPos.left > window.innerWidth - 320;

    return (
        <>
            {/* Overlay con blur — en portal para no depender de stacking de padres */}
            {open &&
                createPortal(
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-90"
                        onClick={closeAll}
                    />,
                    document.body
                )}

            <div>
                <button ref={buttonRef} onClick={handleToggle} className="px-2">
                    <span className="material-symbols-outlined">more_vert</span>
                </button>

                {open &&
                    createPortal(
                        <div
                            ref={menuRef}
                            style={{ top: menuPos.top, left: menuPos.left }}
                            className="fixed z-100 
                       bg-neutral-900 backdrop-blur-sm text-white border-2 rounded-lg shadow-lg
                       p-2 flex flex-col gap-2 animate-slideIn transition-all duration-200
                       overflow-visible"
                        >
                            {/* Editar */}
                            <button
                                onClick={() =>
                                    dispatchTasks({
                                        type: "EDIT_TASK",
                                        payload: { groupId, taskId: task.id, title: "Nuevo título" },
                                    })
                                }
                                className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </button>

                            {/* Duplicar */}
                            <button
                                onClick={() =>
                                    dispatchTasks({ type: "ADD_TASK", payload: { groupId, title: task.title } })
                                }
                                className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
                            >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>

                            {/* Eliminar con confirmación */}
                            <button
                                onClick={() => setConfirmDelete(!confirmDelete)}
                                className={`flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-neutral-700 rounded ${confirmDelete ? "bg-neutral-700" : ""}`}
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>

                            {/* Mover */}
                            <button
                                onClick={() => {
                                    setMoveOpen(!moveOpen);
                                    setPriorityOpen(false);
                                }}
                                className="flex items-center gap-2 w-full text-left px-2 py-1 hover:bg-neutral-700 rounded"
                            >
                                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                            </button>

                            {moveOpen && (
                                <div className="mt-2 border-t border-neutral-600 pt-2">
                                    {groups.map((g: Group) => (
                                        <button
                                            key={g.id}
                                            onClick={() => handleMoveTask(g.id)}
                                            className="block w-full text-left px-2 py-1 hover:bg-neutral-700 rounded whitespace-nowrap"
                                        >
                                            Mover a {g.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Establecer prioridad + submenu 2 lateral */}
                            <div className="static">
                                <button
                                    onClick={() => {
                                        setPriorityOpen(!priorityOpen);
                                        setMoveOpen(false);
                                    }}
                                    className={`flex items-center justify-between w-full text-left px-2 py-1 hover:bg-neutral-700 rounded ${priorityOpen ? "bg-neutral-700" : ""}`}
                                    aria-expanded={priorityOpen}
                                    aria-label="Establecer prioridad"
                                >
                                    <span className="material-symbols-outlined text-sm">flag</span>
                                    <span className="material-symbols-outlined text-sm opacity-70">
                                        {priorityOpen ? "chevron_left" : "chevron_right"}
                                    </span>
                                </button>

                                {priorityOpen && (
                                    <div
                                        className={`absolute top-0 bottom-0
                                        bg-white dark:bg-neutral-900 border-2 border-neutral-800 dark:border-neutral-200 rounded-lg shadow-lg
                                        p-2 flex flex-col justify-evenly items-center animate-slideIn
                                        ${flipPriority ? "right-full mr-3" : "left-full ml-3"}`}
                                        role="menu"
                                        aria-label="Prioridades"
                                    >
                                        <button
                                            onClick={() => handleSetPriority("very important")}
                                            title="Muy importante"
                                            aria-label="Muy importante"
                                            className={`block w-8 h-8 rounded-md border-2 border-neutral-800 bg-pink-500 hover:bg-pink-300 transition-colors ${task.priority === "very important" ? "ring-2 ring-neutral-800 dark:ring-white" : ""}`}
                                        />
                                        <button
                                            onClick={() => handleSetPriority("high")}
                                            title="Alta"
                                            aria-label="Alta"
                                            className={`block w-8 h-8 rounded-md border-2 border-neutral-800 bg-red-400 hover:bg-red-300 transition-colors ${task.priority === "high" ? "ring-2 ring-neutral-800 dark:ring-white" : ""}`}
                                        />
                                        <button
                                            onClick={() => handleSetPriority("medium")}
                                            title="Media"
                                            aria-label="Media"
                                            className={`block w-8 h-8 rounded-md border-2 border-neutral-800 bg-yellow-400 hover:bg-yellow-300 transition-colors ${task.priority === "medium" ? "ring-2 ring-neutral-800 dark:ring-white" : ""}`}
                                        />
                                        <button
                                            onClick={() => handleSetPriority("low")}
                                            title="Baja"
                                            aria-label="Baja"
                                            className={`block w-8 h-8 rounded-md border-2 border-neutral-800 bg-green-400 hover:bg-green-300 transition-colors ${task.priority === "low" ? "ring-2 ring-neutral-800 dark:ring-white" : ""}`}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Confirmar eliminación - debajo de todos los iconos */}
                            {confirmDelete && (
                                <div className="mt-2 p-2 border-t border-neutral-600">
                                    <p className="text-sm text-gray-200 whitespace-nowrap">¿Seguro que quieres eliminar esta tarea?</p>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleConfirmDelete(true)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => handleConfirmDelete(false)}
                                            className="bg-gray-400 text-black px-2 py-1 rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>,
                        document.body
                    )}
            </div>
        </>
    );
};

export default TaskMenu;
