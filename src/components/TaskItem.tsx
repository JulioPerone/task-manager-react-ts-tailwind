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
            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between border rounded-2xl p-3 mb-2 transition-all duration-300 ease-in-out animate-fadeIn ${styleClass}`}
        >
            <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    className="mt-1 sm:mt-0 shrink-0 w-5 h-5"
                    onChange={() =>
                        dispatchTasks({ type: "TOGGLE_TASK", payload: { groupId, taskId: task.id } })
                    }
                />
                {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
                        <input
                            value={draft}
                            autoFocus
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit();
                                if (e.key === "Escape") handleCancelEdit();
                            }}
                            className="border rounded p-2 w-full text-black text-base min-w-0"
                        />
                        <div className="flex gap-2">
                        <button
                            onClick={handleSaveEdit}
                            className="surface-skin text-white px-3 py-2 rounded text-sm flex-1 sm:flex-none"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="bg-gray-400 text-black px-3 py-2 rounded text-sm flex-1 sm:flex-none"
                        >
                            Cancelar
                        </button>
                        </div>
                    </div>
                ) : (
                    <span className={`break-words min-w-0 flex-1 text-sm sm:text-base ${task.completed ? "line-through decoration-2 opacity-70" : ""}`}>
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