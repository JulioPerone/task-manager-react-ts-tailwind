// Componente para la creación y visualización de tareas dentro de un grupo

import { useState } from "react"
import type { Task } from "../types/GroupsForTask";

const TaskGroups = ({ tasks, onUpdate }: { tasks: Task[]; onUpdate: (newTasks: Task[]) => void }) => {

    const [title, setTitle] = useState("");

    // Funcion que maneja la creacion de una nueva tarea
    const handleAddTask = () => {
        if (!title.trim()) return;
        const newTask: Task = {
            id: crypto.randomUUID(),
            title
        };
        onUpdate([...tasks, newTask])
        setTitle("");
    }

    return (
        <div>
            {/* Input para crear nueva tarea + boton */}
            <div className="flex gap-2 mb-3">
                <input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="border rounded p-1 input-skin text-skin mt-2"
                    placeholder="Nueva Tarea"
                />
                <button onClick={handleAddTask}
                    className="surface-skin px-3 rounded-lg transition text-skin
                    material-symbols-outlined">add_card</button>
            </div>
            {/* Renderizado de la lista de tareas */}
            {tasks.map(({ id, title }) => (
                <div
                    key={id}
                    className="border rounded-lg p-2 mb-2 hover-color transition text-skin">
                    {title}
                </div>
            ))}
        </div>
    )
}

export default TaskGroups