import { useState } from "react";
import TaskMenu from "./TaskMenu";
import type { Task, Group, TaskAction } from "../types/contracts";

type Props = {
    task: Task;
    groupId: string;
    groups: Group[];
    dispatchTasks: React.Dispatch<TaskAction>;
};

const TaskItem = ({ task, groupId, groups, dispatchTasks }: Props) => {

    const priorityStyles = {
        low: "bg-green-300 border-green-600 text-green-800 font-bold",
        medium: "bg-yellow-300 border-yellow-600 text-yellow-800 font-bold",
        high: "bg-red-300 border-red-600 text-red-800 font-bold",
        "very important": "bg-pink-400 border-pink-600 text-pink-800 font-bold",
    };

    // Al completar, el gris neutro reemplaza el tono de la prioridad.
    // Al desmarcar, vuelve automáticamente el color de la prioridad.
    const completedStyle =
        "bg-neutral-200 border-neutral-400 text-neutral-500";

    const styleClass = task.completed
        ? completedStyle
        : task.priority
          ? priorityStyles[task.priority as keyof typeof priorityStyles]
          : "task-default";

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(task.title);

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

    return (
        <div
            className={`flex items-center justify-between border rounded-2xl p-3 mb-2 transition-all duration-300 ease-in-out animate-fadeIn ${styleClass}`}
        >
            <div className="flex items-center gap-2 flex-1">
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
                    <span className={`${task.completed ? "line-through decoration-2 opacity-70" : ""}`}>
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