import React, { useReducer, useState } from "react"
import type { Tasks, Task, Actions } from "../types/taskType"

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

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!taskInput.trim()) return;

        if (editingTasks) {
            dispatch({ type: "EDIT", payload: { id: editingTasks.id, text: taskInput } })
            setEditingTasks(null);
        } else {
            dispatch({ type: "CREATE", payload: taskInput })
        }
        setTaskInput("");
    };

    const handleCancel = () => {
        dispatch({ type: "CANCEL" })
        setEditingTasks(null)
        setTaskInput("")
    }


    return (
        <>
            <form onSubmit={handleSubmit} className="flex justify-center">
                <input
                    type="text"
                    value={taskInput}
                    onChange={e => setTaskInput(e.target.value)}
                    className="border-2 rounded-2xl p-2 mx-2 bg-amber-300"
                />
                <button className="border-2 rounded-2xl p-3 bg-amber-600"
                    type="submit">{editingTasks ? "Save" : "Add"}</button>
                {editingTasks && (
                    <button className="border-2 rounded-2xl p-3 bg-red-500 mx-2" type="button" onClick={handleCancel}>
                        Cancel
                    </button>)}
            </form>

            <h2 className="uppercase flex justify-center my-3">Lista de Tareas</h2>
            <div className="flex justify-center">
                <div className="border-2 p-3 m-5 rounded-2xl min-w-75 min-h-25 max-w-125 w-full">
                    <ul>
                        {state.map(task => (
                            <li
                                key={task.id}
                                className="border-4 p-2 rounded-2xl border-double my-2 flex justify-between items-center relative"
                            >
                                <span className="truncate">{task.text}</span>

                                <button
                                    onClick={() =>
                                        setEditingTasks(prev => (prev?.id === task.id ? null : task))
                                    }
                                    className="text-xl font-bold ml-2"
                                >
                                    ⋮
                                </button>

                                {editingTasks?.id === task.id && (
                                    <div className="absolute left-full top-0 ml-2 bg-white border rounded-md shadow-md z-10">
                                        <button
                                            onClick={() => {
                                                setTaskInput(task.text);
                                                setEditingTasks(task);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => dispatch({ type: "DELETE", payload: task.id })}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-red-600"
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