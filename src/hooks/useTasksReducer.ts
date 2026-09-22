import type { Task, TaskAction } from "../types/contracts";

type TasksState = Record<string, Task[]>;

// Reducer de tareas agrupadas por groupId (DELETE_GROUP_TASKS lo usa el borrado en cascada)
const useTasksReducer = (state: TasksState, action: TaskAction): TasksState => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                ...state,
                [action.payload.groupId]: [
                    ...(state[action.payload.groupId] || []),
                    { id: crypto.randomUUID(), title: action.payload.title, completed: false }
                ]
            };

        case "EDIT_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].map(t =>
                    t.id === action.payload.taskId ? { ...t, title: action.payload.title } : t
                )
            };

        case "DELETE_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].filter(t => t.id !== action.payload.taskId)
            };

        case "CONFIRM_DELETE_TASK":
            if (!action.payload.confirmed) return state;
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].filter(t => t.id !== action.payload.taskId)
            };


        case "TOGGLE_TASK":
            return {
                ...state,
                [action.payload.groupId]: state[action.payload.groupId].map(t =>
                    t.id === action.payload.taskId ? { ...t, completed: !t.completed } : t
                )
            };

        case "MOVE_TASK": {
            const { fromGroupId, toGroupId, taskId } = action.payload;

            // Ignora el movimiento dentro del mismo grupo y traslada la referencia entre listas
            if (fromGroupId === toGroupId) return state;

            // Buscar la tarea en el grupo origen
            const taskToMove = state[fromGroupId]?.find(t => t.id === taskId);
            if (!taskToMove) return state;

            return {
                ...state,
                [fromGroupId]: state[fromGroupId].filter(t => t.id !== taskId),
                [toGroupId]: [
                    ...(state[toGroupId] || []),
                    taskToMove
                ]
            };
        }



        case "SET_PRIORITY_TASK":
            return {
                ...state,
                [action.payload.groupId]: (state[action.payload.groupId] || []).map(t =>
                    t.id === action.payload.taskId ? { ...t, priority: action.payload.priority } : t
                )
            };

        case "CLEAR_PRIORITY_TASK":
            return {
                ...state,
                [action.payload.groupId]: (state[action.payload.groupId] || []).map(t => {
                    if (t.id !== action.payload.taskId) return t;
                    const next = { ...t };
                    delete next.priority;
                    return next;
                })
            };

        case "DELETE_GROUP_TASKS": {
            const next = { ...state };
            delete next[action.payload.groupId];
            return next;
        }

        case "HYDRATE_TASKS":
        case "SET_TASKS":
            return action.payload.tasks;

        default:
            return state;
    }
};

export default useTasksReducer