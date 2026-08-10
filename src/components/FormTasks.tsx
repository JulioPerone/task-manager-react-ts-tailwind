import React, { useReducer, useState } from "react"
import type { Tasks, Task, Actions } from "../types/taskType"

// El estado cambiara segun la accion recibida
const reducer = (state: Tasks, action: Actions): Task[] => {
    switch (action.type) {
        case "CREATE":
            return [...state, { id: Date.now(), text: action.payload }]
        case "EDIT":
            return state.map(task =>
                task.id === action.payload.id ? { ...action.payload } : task);
        case "DELETE":
            return state.filter(task => task.id !== action.payload)
        case "CANCEL":
            return state;
        default:
            return state;
    }
}

const FormTasks = () => {

    const [taskInput, setTaskInput] = useState("");
    const [editingTasks, setEditingTasks] = useState<Task | null>(null);
    const [state, dispatch] = useReducer(reducer, []);

    // Creacion y edicion de tareas, si esta en edicion una tarea se dispara la accion EDIT
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!taskInput.trim()) return;

        if (editingTasks) {
            dispatch({ type: "EDIT", payload: { id: editingTasks.id, text: taskInput } })
            setEditingTasks(null);
        } else {
            // Caso contrario, se crea una nueva tarea
            dispatch({ type: "CREATE", payload: taskInput })
        }
        setTaskInput("");
    };

    // Cancelar edicion y limpieza de input.
    const handleCancel = () => {
        dispatch({ type: "CANCEL" })
        setEditingTasks(null)
        setTaskInput("")
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="flex justify-center gap-3 mb-6">
                <input
                    type="text"
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    placeholder="Escribe una tarea..."
                    className="w-64 px-4 py-2 rounded-xl border border-gray-300 bg-amber-100 focus:ring-2 focus:ring-amber-400 outline-none shadow-sm transition"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 active:scale-95 transition"
                >
                    {editingTasks ? "Save" : "Add"}
                </button>
                {editingTasks && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition"
                    >
                        Cancel
                    </button>
                )}
            </form>



            <div className="flex justify-center">
                <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-md">
                    <h2 className="uppercase text-center text-lg font-semibold text-gray-700 mb-3">Lista de Tareas</h2>
                    <ul>
                        {state.map(task => (
                            <li
                                key={task.id}
                                className="flex justify-between items-center bg-white border border-gray-200 rounded-xl p-3 my-2 shadow-sm hover:shadow-md transition relative"
                            >
                                <span className="truncate text-gray-800">{task.text}</span>
                                <button
                                    onClick={() => setEditingTasks(prev => (prev?.id === task.id ? null : task))}
                                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                                >
                                    ⋮
                                </button>

                                {editingTasks?.id === task.id && (
                                    <div className="absolute left-full top-0 ml-2 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                setTaskInput(task.text);
                                                setEditingTasks(task);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => dispatch({ type: "DELETE", payload: task.id })}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default FormTasks