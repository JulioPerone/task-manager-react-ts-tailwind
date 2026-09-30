import { useRef, useState } from "react";
import TaskMenu from "./TaskMenu";
import type { Task, Group, TaskAction } from "../types/contracts";

export const DRAG_MIME = "application/taskmanager-task";

export type DragTaskPayload = {
    taskId: string;
    fromGroupId: string;
    fromIndex: number;
};

type Props = {
    task: Task;
    groupId: string;
    index: number;
    groups: Group[];
    dispatchTasks: React.Dispatch<TaskAction>;
    isDragging?: boolean;
    onDragStartItem?: (taskId: string) => void;
    onDragEndItem?: () => void;
};

const TaskItem = ({
    task,
    groupId,
    index,
    groups,
    dispatchTasks,
    isDragging,
    onDragStartItem,
    onDragEndItem,
}: Props) => {

    const priorityStyles = {
        low: "bg-green-300 border-green-600 text-green-800 font-bold",
        medium: "bg-yellow-300 border-yellow-600 text-yellow-800 font-bold",
        high: "bg-red-300 border-red-600 text-red-800 font-bold",
        "very important": "bg-pink-400 border-pink-600 text-pink-800 font-bold",
    };

    // Completada pisa el color de prioridad; al desmarcar se restaura solo
    const completedStyle =
        "bg-neutral-200 border-neutral-400 text-neutral-500";

    const styleClass = task.completed
        ? completedStyle
        : task.priority
          ? priorityStyles[task.priority as keyof typeof priorityStyles]
          : "task-default";

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(task.title);
    const rootRef = useRef<HTMLDivElement>(null);
    const ghostRef = useRef<HTMLElement | null>(null);

    const handleStartEdit = () => {
        setDraft(task.title);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        if (!draft.trim()) return;
        dispatchTasks({
            type: "EDIT_TASK",
            payload: { groupId, taskId: task.id, title: draft.trim() },
        });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setDraft(task.title);
        setIsEditing(false);
    };

    const cleanupGhost = () => {
        ghostRef.current?.remove();
        ghostRef.current = null;
    };

    const handleDragStart = (e: React.DragEvent) => {
        if (isEditing) {
            e.preventDefault();
            return;
        }
        const payload: DragTaskPayload = { taskId: task.id, fromGroupId: groupId, fromIndex: index };
        e.dataTransfer.setData(DRAG_MIME, JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "move";

        // Ghost fluido: clona la tarjeta real para verla al arrastrar
        try {
            const source = rootRef.current ?? (e.currentTarget as HTMLElement);
            const rect = source.getBoundingClientRect();
            const ghost = source.cloneNode(true) as HTMLElement;
            ghost.style.width = `${rect.width}px`;
            ghost.style.height = `${rect.height}px`;
            ghost.style.position = "fixed";
            ghost.style.top = "-1000px";
            ghost.style.left = "-1000px";
            ghost.style.margin = "0";
            ghost.style.opacity = "0.95";
            ghost.style.transform = "rotate(4deg) scale(1.04)";
            ghost.style.boxShadow = "0 20px 40px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)";
            ghost.style.cursor = "grabbing";
            ghost.style.pointerEvents = "none";
            ghost.style.zIndex = "9999";
            document.body.appendChild(ghost);
            ghostRef.current = ghost;
            // Mantiene el cursor en el punto de agarre para que se sienta natural
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            e.dataTransfer.setDragImage(ghost, offsetX, offsetY);
            // Limpieza diferida: el browser ya capturó la imagen
            setTimeout(cleanupGhost, 0);
        } catch {
            // Si falla el ghost custom, el browser usa el default
        }

        onDragStartItem?.(task.id);
    };

    const handleDragEnd = () => {
        cleanupGhost();
        onDragEndItem?.();
    };

    return (
        <div
            ref={rootRef}
            draggable={!isEditing}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between border rounded-2xl p-3 mb-2 transition-all duration-200 ease-out animate-fadeIn cursor-grab active:cursor-grabbing select-none ${styleClass} ${isDragging ? "opacity-30 scale-[0.97] saturate-50" : "hover:-translate-y-0.5 hover:shadow-lg"}`}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                    title="Arrastra para reordenar"
                    className="material-symbols-outlined text-base opacity-60 select-none cursor-grab hover:opacity-100 hover:scale-110 transition"
                    aria-hidden
                >
                    drag_indicator
                </span>
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                        dispatchTasks({ type: "TOGGLE_TASK", payload: { groupId, taskId: task.id } })
                    }
                />
                {isEditing ? (
                    <>
                        <input
                            value={draft}
                            autoFocus
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit();
                                if (e.key === "Escape") handleCancelEdit();
                            }}
                            className="border rounded p-1 w-full text-black"
                        />
                        <button
                            onClick={handleSaveEdit}
                            className="surface-skin text-white px-2 py-1 rounded text-sm"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 text-black px-2 py-1 rounded text-sm"
                        >
                            Cancelar
                        </button>
                    </>
                ) : (
                    <span className={`truncate ${task.completed ? "line-through decoration-2 opacity-70" : ""}`}>
                        {task.title}
                    </span>
                )}
            </div>

            {!isEditing && (
                <TaskMenu
                    task={task}
                    groupId={groupId}
                    groups={groups}
                    dispatchTasks={dispatchTasks}
                    onEdit={handleStartEdit}
                />
            )}
        </div>
    );
};

export default TaskItem
