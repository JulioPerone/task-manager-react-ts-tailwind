import { useContext, useState } from "react";
import { TasksContext } from "../context/TasksContext";
import type { Group, Task } from "../types/contracts";
import TaskItem from "./TaskItem";

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

    const fullList = tasks[groupId] || [];
    const list = priorityFilter ? fullList.filter((t) => t.priority === priorityFilter) : fullList;

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

            <div className="mt-4 space-y-2">
                {list.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        groupId={groupId}
                        groups={groups}
                        dispatchTasks={dispatchTasks}
                    />
                ))}

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
            </div>
        </div>
    );
};

export default TaskManager;
