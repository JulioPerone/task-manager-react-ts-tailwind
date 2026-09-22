import { useContext, useState } from "react";
import { TasksContext } from "../context/TasksContext"; // 👈 importa solo el contexto
import type { Group } from "../types/contracts";
import TaskItem from "./TaskItem";

const TaskManager = ({ groupId, groups }: { groupId: string; groups: Group[] }) => {
    const { tasks, dispatchTasks } = useContext(TasksContext)!; // 👈 obtiene estado global
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        dispatchTasks({ type: "ADD_TASK", payload: { groupId, title: newTaskTitle } });
        setNewTaskTitle("");
        setShowInput(false);
    };

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

            <div className="mt-4 space-y-2">
                {(tasks[groupId] || []).map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        groupId={groupId}
                        groups={groups}
                        dispatchTasks={dispatchTasks}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskManager;
